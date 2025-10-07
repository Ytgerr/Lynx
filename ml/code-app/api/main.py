from fastapi import FastAPI
from pydantic import BaseModel
import spacy


app = FastAPI()

model = spacy.load("en_core_web_sm")

class TextInput(BaseModel):
    text: str

@app.post("/entity-recognition")
async def ner(input_data: TextInput):
    doc = model(input_data.text)
    triplets = [{"text": ent.text, "label": ent.label_, "start": ent.start_char, "end": ent.end_char} for ent in doc.ents]
    return {"triplets": triplets}
