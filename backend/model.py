import re
import openvino_genai as ov_genai
from optimum.intel.openvino import OVModelForCausalLM
from transformers import AutoTokenizer
model_path = "./finetuned_model"


pat = re.compile(r"</s>")
# pipe = ov_genai.LLMPipeline(model_path, "GPU")
config = ov_genai.GenerationConfig()
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = OVModelForCausalLM.from_pretrained(model_path, device="GPU")

# hf_hub.snapshot_download(model_id, local_dir=model_path)
# # device = "GPU"
def infer(user: list[str], assistant: list[str]):
    # return re.sub(answer_pat, '', pipe.generate(query, max_length=200))
    # pipe.start_chat()
    assistant.append("")
    # f"\n<|user|>:{query}</s>\n<|assistant|>:"
    model_query = "</s>".join(f"\n<|user|>:{u}</s>\n<|assistant|>:{a}" for u, a in zip(user, assistant))
    print(model_query)
    # ret = pipe.generate(query, config, max_length=200)
    # pipe.finish_chat()
    # return ret
    model_inputs = tokenizer(model_query, return_tensors="pt")
    # print("Model inputs:", model_inputs)
    res = model.generate(**model_inputs, max_new_tokens=200)
    hf_output = tokenizer.decode(res[0, model_inputs["input_ids"].shape[1]:])
    print(hf_output)
    return re.sub(pat, "", hf_output)

# import re
# import openvino_genai as ov_genai
# # from optimum.intel.openvino import OVModelForCausalLM
# # from transformers import AutoTokenizer

# model_path = "TinyLlama"

# # answer_pat = re.compile(r"\n*# Answer\n*")
# pipe = ov_genai.LLMPipeline(model_path, "NPU")
# # tokenizer = AutoTokenizer.from_pretrained(model_path)
# # model = OVModelForCausalLM.from_pretrained(model_path)

# def infer(query: str):
#     model_query = f"Teacher and student are solving an equation. Student: {query} Teacher:"
    
#     # Generate response
#     response = pipe.generate(model_query, max_length=500)  # Increased max length for debugging
    
#     # Log raw response for debugging
#     print(f"Raw model response: {response}")
    
#     # Post-processing (if needed)
#     clean_response = re.sub(r'\n+', '\n', response)  # For cleaning up excessive line breaks
    
#     return clean_response
