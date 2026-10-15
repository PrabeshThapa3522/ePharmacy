from sentence_transformers import SentenceTransformer
import faiss
import ollama


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


# User question
question = "Do I need a prescription to order medicine?"


# Create question embedding
question_embedding = model.encode(
    [question],
    convert_to_numpy=True,
).astype("float32")


# Search FAISS
distances, indices = index.search(question_embedding, k=1)

best_index = indices[0][0]
retrieved_knowledge = chunks[best_index]


print("Retrieved knowledge:")
print(retrieved_knowledge)


# Create prompt for Llama
prompt = f"""
You are a pharmacy assistant.

Answer the user's question using ONLY the provided pharmacy knowledge.

Pharmacy knowledge:
{retrieved_knowledge}

User question:
{question}

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


# Print final answer
print("\nAI Answer:")
print(response["message"]["content"])