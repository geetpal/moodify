# Define an endpoint (e.g., /detect-emotion) that accepts a search query and returns the detected emotion keyword.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model.hf_model import get_emotion, load_model_and_tokenizer

app = FastAPI()

app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # Allows all origins
       allow_credentials=True,
       allow_methods=["*"],  # Allows all methods
       allow_headers=["*"],  # Allows all headers
   )

class Query(BaseModel):
    query: str

# get the user query from frontend and send it to the model
tokenizer, model = load_model_and_tokenizer()

@app.post("/send-query-to-model")
async def send_query_to_model(query: Query):
    emotion = get_emotion(query.query, tokenizer, model)
    return {"emotion": emotion}


