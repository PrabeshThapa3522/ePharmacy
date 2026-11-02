# ePharmacy

An AI-integrated pharmacy management and e-commerce web application designed to make pharmacy services more accessible and efficient. The platform allows customers to explore products, manage orders, upload prescriptions, and interact with an AI-powered pharmacy assistant.

## Features

### Customer Features
- User registration and login.
- Browse available pharmacy products.
- View product information.
- Place and manage orders.
- Upload prescriptions for pharmacist review.
- Interact with the AI Pharmacy Assistant.

### Pharmacist and Staff Features
- Manage pharmacy operations.
- Review uploaded prescriptions.
- Approve or reject prescriptions.
- View customer information.
- Maintain customer medicine history records.

### AI Pharmacy Assistant
- AI-powered conversational interface.
- Retrieval-Augmented Generation (RAG) for pharmacy-related questions.
- Semantic search using Sentence Transformers.
- Knowledge retrieval using FAISS.
- Response generation using Llama 3 through Ollama.
- Safety-focused responses that avoid diagnosis, prescribing, and medication dosage recommendations.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| Authentication | JWT |
| AI Model | Llama 3 |
| LLM Runtime | Ollama |
| Embeddings | Sentence Transformers |
| Vector Database | FAISS |
| Version Control | Git and GitHub |

## Project Structure

```text
Pharmacy/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── embeddings/
│   ├── knowledge_base/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── routes/
│   └── package.json
│
├── .gitignore
└── README.md
```



## Getting Started

Follow these instructions to run the application locally.

### Prerequisites

Install the following before setting up the project:

- Python 3.11 or compatible version.
- Node.js and npm.
- PostgreSQL.
- Git.
- Ollama (for the AI Assistant).

### 1. Clone the Repository

```bash
git clone https://github.com/PrabeshThapa3522/ePharmacy.git
cd Pharmacy
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv ../venv
```

Activate it on macOS or Linux:

```bash
source ../venv/bin/activate
```

Install the dependencies:

```bash
python3 -m pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the backend directory using `.env.example` as a reference.

Example:

```env
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/pharmacy_db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Use your own PostgreSQL credentials and a secure secret key. Do not commit your `.env` file to GitHub.

### 4. Database Setup

Create a PostgreSQL database named:

```sql
CREATE DATABASE pharmacy_db;
```

Ensure that the database connection URL in your backend `.env` file matches your PostgreSQL configuration.

### 5. Run the Backend

From the `backend` directory, run:

```bash
uvicorn app.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

FastAPI interactive documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### 7. AI Assistant Setup

Install and start Ollama, then download the Llama 3 model:

```bash
ollama pull llama3:latest
```

Make sure the Ollama service is running.

The AI Assistant uses a pharmacy knowledge base, Sentence Transformers, and FAISS for retrieving relevant information before generating responses with Llama 3.

Generate the embeddings and FAISS index from the backend directory:

```bash
python embeddings.py
```

The generated index and knowledge text are used by the AI service.

## AI Assistant Architecture

The AI Pharmacy Assistant uses Retrieval-Augmented Generation (RAG).

```text
User Question
     |
     v
Sentence Transformer
     |
     v
Question Embedding
     |
     v
FAISS Similarity Search
     |
     v
Relevant Pharmacy Knowledge
     |
     v
Llama 3 (Ollama)
     |
     v
Generated Response
```

The assistant is designed to answer questions using the pharmacy knowledge base. It does not replace a qualified pharmacist or healthcare professional.

## API Endpoint

### AI Chat

**POST** `/api/ai/chat`

Request:

```json
{
  "message": "Can I upload a prescription?"
}
```

Response:

```json
{
  "response": "Yes, customers can upload a prescription through Bishwas Pharmacy."
}
```

## Security and Safety

- Password-based authentication with JWT.
- Environment variables for sensitive configuration.
- Role-based access to protected application areas.
- Prescription approval and rejection handled by pharmacists.
- AI Assistant restrictions against diagnosis and prescribing.

## Future Improvements

- AI-powered prescription text extraction (OCR).
- Inventory demand forecasting.
- Smart medicine search.
- Live order-status assistance.
- Improved AI retrieval and response evaluation.

## License

This project is currently developed for educational and portfolio purposes. A license can be added when the project is ready for distribution.


Appendix

