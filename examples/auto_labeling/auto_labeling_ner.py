from fastapi import FastAPI

from pydantic import BaseModel, Field
from typing import List

import spacy

app = FastAPI(
    title="spacy-ja_ginza-ner API",
    description="tiny REST-API example for doccano auto-labeling",
    version="1.0.0"
)

nlp = spacy.load("ja_ginza")

class SequenceText(BaseModel):
    text: str = Field(description="入力テキスト", example="富士山は山梨県と静岡県にまたがってあります。")

class SequenceLabel(BaseModel):
    label: str = Field(description="label", example="Location")
    start_offset: int = Field(description="start_offset", example=0)
    end_offset: int = Field(description="end_offset", example=5)
    
@app.post('/ner', response_model=List[SequenceLabel])
async def ner(sequence: SequenceText):
    return [ {"label": ent.label_, "start_offset": ent.start_char, "end_offset": ent.end_char} for ent in nlp(sequence.text).ents ]
