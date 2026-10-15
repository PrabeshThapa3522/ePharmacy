import ollama
from sentence_transformers import SentenceTransformer
import faiss


# Load FAISS index
index = faiss.read_index("embeddings/pharmacy.index")

# Load knowledge text
with open("embeddings/pharmacy_text.txt", "r", encoding="utf-8") as file:
    text = file.read()


# Recreate knowledge chunks
sections = text.split("\n\n")

chunks = []
current_chunk = ""

headings = [
    "Pharmacy Information",
    "Prescription Medicines",
    "Orders",
    "Safety",
    "Customer Support",
]

for section in sections:
    section = section.strip()

    if not section:
        continue

    if section in headings:
        if current_chunk:
            chunks.append(current_chunk)

        current_chunk = section
    else:
        current_chunk += "\n\n" + section

if current_chunk:
    chunks.append(current_chunk)


# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


def get_ai_response(message: str) -> str:

    # Create question embedding
    question_embedding = model.encode(
        [message],
        convert_to_numpy=True,
    ).astype("float32")

    # Search FAISS
    distances, indices = index.search(
        question_embedding,
        k=1,
    )

    # Get relevant knowledge
    best_index = indices[0][0]
    retrieved_knowledge = chunks[best_index]

    # Create prompt
    prompt = f"""
You are a pharmacy assistant.

Answer the user's question using ONLY the provided pharmacy knowledge.
STRICT RULES:
- Answer using ONLY the provided pharmacy knowledge.
- Do not add information that is not present in the knowledge.
- Do not make assumptions or invent details.
- If the knowledge does not contain the answer, say that you do not have that information.
- Do not diagnose medical conditions.
- Do not prescribe medicines.
- Do not recommend changing medication dosage.
- Prescription approval is performed by a pharmacist, not by the AI.

Pharmacy knowledge:
{retrieved_knowledge}

User question:
{message}

Give a clear and concise answer.
"""

    # Ask Llama 3
    response = ollama.chat(
        model="llama3:latest",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    return response["message"]["content"]