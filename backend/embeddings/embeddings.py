from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer
import faiss


# Load knowledge base
knowledge_file = Path("knowledge_base/pharmacy_info.txt")
text = knowledge_file.read_text(encoding="utf-8")

print("Knowledge base loaded")

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

print("Embedding model loaded")

# Split knowledge into sections
sections = text.split("\n\n")

chunks = []
current_chunk = ""

for section in sections:
    section = section.strip()

    if not section:
        continue

    if section in [
        "Prescription Information",
        "Prescription Medicines",
        "Orders",
        "Safety",
        "Customer Support",
    ]:
        if current_chunk:
            chunks.append(current_chunk)

        current_chunk = section
    else:
        current_chunk += "\n\n" + section

if current_chunk:
    chunks.append(current_chunk)

print("Number of chunks:", len(chunks))

embedding = model.encode(
    chunks,
    convert_to_numpy=True,
)

embedding = np.asarray(embedding, dtype=np.float32)
embedding = np.ascontiguousarray(embedding)

print("Embedding created")
print("Shape:", embedding.shape)
print("Dtype:", embedding.dtype)
print("Contiguous:", embedding.flags["C_CONTIGUOUS"])

# Create FAISS index
dimension = embedding.shape[1]
index = faiss.IndexFlatL2(dimension)

print("FAISS index created")

# Add embedding
index.add(embedding)

print("Embedding added to FAISS")
print("Number of vectors:", index.ntotal)

# Save FAISS index
faiss.write_index(index, "embeddings/pharmacy.index")

print("FAISS index saved")

# Save knowledge text
text_file = Path("embeddings/pharmacy_text.txt")
text_file.write_text("\n\n".join(chunks), encoding="utf-8")

print("Knowledge text saved")