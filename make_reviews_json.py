import json
import re
import sys

import pandas as pd

file = sys.argv[1] if len(sys.argv) > 1 else "imdb_study_dataset_Julia_Geller.csv"
df = pd.read_csv(file)


def clean(text: str) -> str:
    """Clean IMDB reviews by turning <br /> tags into line breaks"""
    text = re.sub(r"<br\s*/?>", "\n", str(text), flags=re.IGNORECASE)
    # make excessive line break gaps smaller
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


reviews = []
for i, row in df.iterrows():
    reviews.append({
        "id": int(i),
        "text": clean(row["text"]),
        "label": int(row["label"]),
        "ai_label": int(row["ai_classification"]),
    })

with open("reviews.json", "w", encoding="utf-8") as f:
    json.dump(reviews, f, ensure_ascii=False, indent=2)