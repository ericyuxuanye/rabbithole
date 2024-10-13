from transformers import AutoTokenizer
from optimum.intel.openvino import OVModelForCausalLM

model_id = "OpenVINO/mistral-7b-instruct-v0.1-int4-ov"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = OVModelForCausalLM.from_pretrained(model_id)

inputs = tokenizer("What is OpenVINO?", return_tensors="pt")

outputs = model.generate(**inputs, max_length=200)
text = tokenizer.batch_decode(outputs)[0]
print(text)