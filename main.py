from fastapi import FastAPI, UploadFile, File, HTTPException
from deepface import DeepFace
import numpy as np
import os
import pickle
import tempfile



app = FastAPI

# ----------------------------
# Config
# ----------------------------
FACE_DB = "face_data"
os.makedirs(FACE_DB, exist_ok=True)

MODEL_NAME = "ArcFace"
DETECTOR = "retinaface"

# ----------------------------
# Helpers
# ----------------------------
def save_embedding(student_id: str, embedding: list):
    with open(f"{FACE_DB}/{student_id}.pkl", "wb") as f:
        pickle.dump(embedding, f)

def load_embedding(student_id: str):
    path = f"{FACE_DB}/{student_id}.pkl"
    if os.path.exists(path):
        with open(path, "rb") as f:
            return pickle.load(f)
    return None

def save_temp_image(upload_file: UploadFile):
    temp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    temp.write(upload_file.file.read())
    temp.close()
    return temp.name

# ----------------------------
# Health Check
# ----------------------------
@app.get("/")
def root():
    return {"status": "AI server running ✅"}

# ----------------------------
# API 1: Register Face
# ----------------------------
@app.post("/face/register/{student_id}")
async def register_face(
    student_id: str,
    file: UploadFile = File(...)
):
    img_path = None
    try:
        img_path = save_temp_image(file)

        result = DeepFace.represent(
            img_path=img_path,
            model_name=MODEL_NAME,
            detector_backend=DETECTOR,
            enforce_detection=True
        )

        if not result:
            raise HTTPException(status_code=400, detail="No face detected")

        embedding = result[0]["embedding"]
        save_embedding(student_id, embedding)

        return {
            "success": True,
            "student_id": student_id,
            "message": "Face registered successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        if img_path and os.path.exists(img_path):
            os.remove(img_path)

# ----------------------------
# API 2: Verify Face
# ----------------------------
@app.post("/face/verify/{student_id}")
async def verify_face(
    student_id: str,
    file: UploadFile = File(...)
):
    img_path = None
    try:
        stored_embedding = load_embedding(student_id)
        if stored_embedding is None:
            return {
                "match": False,
                "message": "Face not registered"
            }

        img_path = save_temp_image(file)

        result = DeepFace.represent(
            img_path=img_path,
            model_name=MODEL_NAME,
            detector_backend=DETECTOR,
            enforce_detection=True
        )

        if not result:
            raise HTTPException(status_code=400, detail="No face detected")

        new_embedding = result[0]["embedding"]

        # Cosine distance
        stored = np.array(stored_embedding)
        new = np.array(new_embedding)

        cosine_distance = 1 - np.dot(stored, new) / (
            np.linalg.norm(stored) * np.linalg.norm(new)
        )

        # ✅ Convert NumPy types to native Python types
        match = bool(cosine_distance < 0.30)
        distance = float(cosine_distance)

        return {
            "match": match,
            "distance": distance,
            "student_id": student_id
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        if img_path and os.path.exists(img_path):
            os.remove(img_path)
