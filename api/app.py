# api/app.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from joblib import load
import httpx, re
from bs4 import BeautifulSoup

# 1) Create the app FIRST
app = FastAPI(title="Fake News Detector API")

# 2) CORS (allow your Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3) (Optional) load model; keep None-safe for first run
MODEL_PATH = "../models/baseline.joblib"
model = None
try:
    model = load(MODEL_PATH)
except Exception:
    pass

# 4) Schemas
class TextIn(BaseModel):
    text: str

class UrlIn(BaseModel):
    url: str

# 5) Helpers
def scrape(url: str) -> str:
    with httpx.Client(follow_redirects=True, timeout=10) as c:
        r = c.get(url)
        r.raise_for_status()
    from bs4 import BeautifulSoup  # local import is fine
    soup = BeautifulSoup(r.text, "html.parser")
    for tag in soup(["script", "style", "noscript", "header", "footer", "nav"]):
        tag.decompose()
    text = " ".join(t.get_text(" ", strip=True) for t in soup.find_all())
    return re.sub(r"\s+", " ", text).strip()

# 6) Routes
@app.get("/ping")
def ping():
    return {"status": "ok", "model_loaded": bool(model)}

@app.post("/classify_text")
def classify_text(inp: TextIn):
    if model is None:
        # stub response so frontend can integrate before training
        return {"label": "real", "score": 0.42, "threshold": 0.5, "stub": True}
    p = float(model.predict_proba([inp.text])[0][1])  # prob(fake)
    return {"label": "fake" if p >= 0.5 else "real", "score": p, "threshold": 0.5}

@app.post("/classify_url")
def classify_url(inp: UrlIn):
    if model is None:
        return {"label": "real", "score": 0.39, "threshold": 0.5, "chars": 0, "stub": True}
    text = scrape(inp.url)
    p = float(model.predict_proba([text])[0][1])
    return {"label": "fake" if p >= 0.5 else "real", "score": p, "threshold": 0.5, "chars": len(text)}
