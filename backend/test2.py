# # import huggingface_hub as hf_hub

# # model_id = "OpenVINO/Phi-3-medium-4k-instruct-int4-ov"
# import openvino_genai as ov_genai
# model_path = "Phi-3-medium-4k-instruct-int4-ov"

# # hf_hub.snapshot_download(model_id, local_dir=model_path)


# device = "CPU"
# pipe = ov_genai.LLMPipeline(model_path, device)
# print(pipe.generate("What is OpenVINO?", max_length=200))

from transformers import AutoConfig, AutoTokenizer
from optimum.intel.openvino import OVModelForCausalLM

import openvino as ov
import openvino.properties as props
import openvino.properties.hint as hints
import openvino.properties.streams as streams


model_dir = "TinyLlama"
print(f"Loading model from {model_dir}")

ov_config = {hints.performance_mode(): hints.PerformanceMode.LATENCY, streams.num(): "1", props.cache_dir(): ""}

# if "GPU" in device.value and "qwen2-7b-instruct" in model_id.value:
#     ov_config["GPU_ENABLE_SDPA_OPTIMIZATION"] = "NO"

# On a GPU device a model is executed in FP16 precision. For red-pajama-3b-chat model there known accuracy
# issues caused by this, which we avoid by setting precision hint to "f32".
core = ov.Core()

# if model_id.value == "red-pajama-3b-chat" and "GPU" in core.available_devices and device.value in ["GPU", "AUTO"]:
#     ov_config["INFERENCE_PRECISION_HINT"] = "f32"

# model_name = model_configuration["model_id"]
tok = AutoTokenizer.from_pretrained(model_dir, trust_remote_code=True)

ov_model = OVModelForCausalLM.from_pretrained(
    model_dir,
    device="GPU",
    ov_config=ov_config,
    config=AutoConfig.from_pretrained(model_dir, trust_remote_code=True),
    trust_remote_code=True,
)

import torch
from threading import Event, Thread

from typing import List, Tuple
from transformers import (
    AutoTokenizer,
    StoppingCriteria,
    StoppingCriteriaList,
    TextIteratorStreamer,
)


model_name = "Llama"
start_message = "You are a knowledgeable agent."
history_template = model_configuration.get("history_template")
has_chat_template = model_configuration.get("has_chat_template", history_template is None)
current_message_template = model_configuration.get("current_message_template")
stop_tokens = model_configuration.get("stop_tokens")
tokenizer_kwargs = model_configuration.get("tokenizer_kwargs", {})

max_new_tokens = 256


class StopOnTokens(StoppingCriteria):
    def __init__(self, token_ids):
        self.token_ids = token_ids

    def __call__(self, input_ids: torch.LongTensor, scores: torch.FloatTensor, **kwargs) -> bool:
        for stop_id in self.token_ids:
            if input_ids[0][-1] == stop_id:
                return True
        return False


if stop_tokens is not None:
    if isinstance(stop_tokens[0], str):
        stop_tokens = tok.convert_tokens_to_ids(stop_tokens)

    stop_tokens = [StopOnTokens(stop_tokens)]


def default_partial_text_processor(partial_text: str, new_text: str):
    """
    helper for updating partially generated answer, used by default

    Params:
      partial_text: text buffer for storing previosly generated text
      new_text: text update for the current step
    Returns:
      updated text string

    """
    partial_text += new_text
    return partial_text


text_processor = model_configuration.get("partial_text_processor", default_partial_text_processor)


def convert_history_to_token(history: List[Tuple[str, str]]):
    """
    function for conversion history stored as list pairs of user and assistant messages to tokens according to model expected conversation template
    Params:
      history: dialogue history
    Returns:
      history in token format
    """
    if pt_model_name == "baichuan2":
        system_tokens = tok.encode(start_message)
        history_tokens = []
        for old_query, response in history[:-1]:
            round_tokens = []
            round_tokens.append(195)
            round_tokens.extend(tok.encode(old_query))
            round_tokens.append(196)
            round_tokens.extend(tok.encode(response))
            history_tokens = round_tokens + history_tokens
        input_tokens = system_tokens + history_tokens
        input_tokens.append(195)
        input_tokens.extend(tok.encode(history[-1][0]))
        input_tokens.append(196)
        input_token = torch.LongTensor([input_tokens])
    elif history_template is None or has_chat_template:
        messages = [{"role": "system", "content": start_message}]
        for idx, (user_msg, model_msg) in enumerate(history):
            if idx == len(history) - 1 and not model_msg:
                messages.append({"role": "user", "content": user_msg})
                break
            if user_msg:
                messages.append({"role": "user", "content": user_msg})
            if model_msg:
                messages.append({"role": "assistant", "content": model_msg})

        input_token = tok.apply_chat_template(messages, add_generation_prompt=True, tokenize=True, return_tensors="pt")
    else:
        text = start_message + "".join(
            ["".join([history_template.format(num=round, user=item[0], assistant=item[1])]) for round, item in enumerate(history[:-1])]
        )
        text += "".join(
            [
                "".join(
                    [
                        current_message_template.format(
                            num=len(history) + 1,
                            user=history[-1][0],
                            assistant=history[-1][1],
                        )
                    ]
                )
            ]
        )
        input_token = tok(text, return_tensors="pt", **tokenizer_kwargs).input_ids
    return input_token


def bot(history, temperature, top_p, top_k, repetition_penalty, conversation_id):
    """
    callback function for running chatbot on submit button click

    Params:
      history: conversation history
      temperature:  parameter for control the level of creativity in AI-generated text.
                    By adjusting the `temperature`, you can influence the AI model's probability distribution, making the text more focused or diverse.
      top_p: parameter for control the range of tokens considered by the AI model based on their cumulative probability.
      top_k: parameter for control the range of tokens considered by the AI model based on their cumulative probability, selecting number of tokens with highest probability.
      repetition_penalty: parameter for penalizing tokens based on how frequently they occur in the text.
      conversation_id: unique conversation identifier.

    """

    # Construct the input message string for the model by concatenating the current system message and conversation history
    # Tokenize the messages string
    input_ids = convert_history_to_token(history)
    if input_ids.shape[1] > 2000:
        history = [history[-1]]
        input_ids = convert_history_to_token(history)
    streamer = TextIteratorStreamer(tok, timeout=3600.0, skip_prompt=True, skip_special_tokens=True)
    generate_kwargs = dict(
        input_ids=input_ids,
        max_new_tokens=max_new_tokens,
        temperature=temperature,
        do_sample=temperature > 0.0,
        top_p=top_p,
        top_k=top_k,
        repetition_penalty=repetition_penalty,
        streamer=streamer,
    )
    if stop_tokens is not None:
        generate_kwargs["stopping_criteria"] = StoppingCriteriaList(stop_tokens)

    stream_complete = Event()

    def generate_and_signal_complete():
        """
        genration function for single thread
        """
        global start_time
        ov_model.generate(**generate_kwargs)
        stream_complete.set()

    t1 = Thread(target=generate_and_signal_complete)
    t1.start()

    # Initialize an empty string to store the generated text
    partial_text = ""
    for new_text in streamer:
        partial_text = text_processor(partial_text, new_text)
        history[-1][1] = partial_text
        yield history


def request_cancel():
    ov_model.request.cancel()