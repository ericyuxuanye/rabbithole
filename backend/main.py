from typing import Union

from fastapi import FastAPI
from model import infer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    # comment
    return {"item_id": item_id, "q": q}

@app.post("/inference/")
def model_output(user: list[str], assistant: list[str]):
    return {"result": infer(user, assistant)}
