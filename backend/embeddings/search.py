from sentence_transformers import SentenceTransformer
import faiss # load this faiss after sentence_transformers to avoid import error

# Load FAISS index
index = faiss.read_index("embeddings/pharmacy.index")

# Load knowledge text
# Load knowledge text
with open("embeddings/pharmacy_text.txt", "r", encoding="utf-8") as file:
    text = file.read()

# Recreate the same chunks used by embeddings.py
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

print("Question:", question)
print("Distance:", distances[0][0])
print("Index:", best_index)
print("Retrieved knowledge:")
print(chunks[best_index])
