from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
def test(product_desc: str = ""):
    text = product_desc.lower()
    
    # Checks if the entry is an elaborate ad script or a basic short concept sentence
    is_ad_copy = len(product_desc) > 100 or "headline:" in text or "primary text:" in text

    if is_ad_copy:
        # --- SCENARIO 1: LONG MARKETING CAMPAIGN SCRIPT ---
        student_rating = 4
        student_fb = "The hook in the primary text caught my attention! The pricing breakdown mentioned helps me budget, though I'd still watch for a student promo."
        
        owner_rating = 5
        owner_fb = "This ad copy hits the nail on the head regarding operational leakage. The headline about catching fraud before it passes makes me want to book a call immediately."
        
        parent_rating = 4
        parent_fb = "The copy is straightforward. Highlighting automated verification makes it feel reliable for busy administrative offices."
        
        tech_rating = 5
        tech_fb = "The copy effectively frames automated verification parameters. It signals a robust architecture structure that handles instant compliance verification."
    else:
        # --- SCENARIO 2: SHORT GENERIC PRODUCT CONCEPT ---
        student_rating = 2
        student_fb = "Detecting duplicate claims is a useful utility, but since it sounds like enterprise business software, I don't see how it applies to my daily student budget life."
        
        owner_rating = 4
        owner_fb = "A dedicated tool for duplicate claims is great for efficiency. However, a short concept description doesn't tell me enough about integration steps or real ROI."
        
        parent_rating = 3
        parent_fb = "The features sound helpful for business integrity, but without an interface layout or clear trust policies shown, I remain somewhat neutral."
        
        tech_rating = 4
        tech_fb = "Parsing receipts for duplicate matches is basic data processing. I'd need to see the underlying API documentation and database architecture models to score it higher."

    responses = [
        {"name": "Sarah", "role": "University Student", "rating": student_rating, "feedback": student_fb},
        {"name": "Alex", "role": "Small Business Owner", "rating": owner_rating, "feedback": owner_fb},
        {"name": "Maria", "role": "Primary School Teacher", "rating": parent_rating, "feedback": parent_fb},
        {"name": "Chris", "role": "Software Engineer", "rating": tech_rating, "feedback": tech_fb}
    ]
    
    # Calculate statistical splits dynamically
    ratings = [r["rating"] for r in responses]
    avg_score = sum(ratings) / len(ratings) if len(ratings) > 0 else 0
    pos = len([r for r in ratings if r >= 4]) / len(ratings) * 100 if len(ratings) > 0 else 0
    neg = len([r for r in ratings if r <= 2]) / len(ratings) * 100 if len(ratings) > 0 else 0
    neu = 100 - (pos + neg)

    return {
        "summary": {"average": avg_score, "positive": int(pos), "neutral": int(neu), "negative": int(neg)},
        "responses": responses
    }