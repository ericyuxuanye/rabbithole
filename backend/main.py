from typing import Union

from fastapi import FastAPI
from model import infer

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    # comment
    return {"item_id": item_id, "q": q}

@app.get("/inference/")
def model_output(query: str):
    return {"result": infer(query)}
