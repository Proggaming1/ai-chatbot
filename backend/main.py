from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import together
import uuid
from datetime import datetime
from typing import Optional

load_dotenv()

app = FastAPI(title="AI Chatbot API", version="1.0.0")

# Configure CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Together AI
together.api_key = os.getenv("TOGETHER_AI_API_KEY")

# In-memory storage
chat_history = {}

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    model: str = "meta-llama/Llama-3.1-70b-instruct-turbo"

class ChatResponse(BaseModel):
    conversation_id: str
    response: str
    timestamp: str
    model: str

class ConversationHistory(BaseModel):
    conversation_id: str
    messages: list

# Model choices
MODELS = {
    "llama-70b": "meta-llama/Llama-3.1-70b-instruct-turbo",
    "llama-8b": "meta-llama/Llama-3.1-8b-instruct-turbo",
    "mistral": "mistralai/Mistral-7B-Instruct-v0.3",
    "qwen": "Qwen/Qwen2.5-72B-Instruct-Turbo",
}

@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "AI Chatbot API is running",
        "models": list(MODELS.keys())
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatMessage):
    """
    Send a message and get AI response.
    """
    try:
        conv_id = request.conversation_id or str(uuid.uuid4())
        
        model_name = request.model
        if model_name not in MODELS:
            model_name = "llama-70b"
        model = MODELS[model_name]
        
        messages = chat_history.get(conv_id, [])
        messages.append({
            "role": "user",
            "content": request.message
        })
        
        # Call Together AI
        response = together.Complete.create(
            model=model,
            prompt=request.message,
            max_tokens=2048,
            temperature=0.7,
            top_k=50,
            top_p=0.9,
            repetition_penalty=1.0,
            stop=["\n\nUser:", "\n\nAssistant:"]
        )
        
        ai_response = response["output"]["choices"][0]["text"].strip()
        
        messages.append({
            "role": "assistant",
            "content": ai_response
        })
        
        chat_history[conv_id] = messages[-20:]
        
        return ChatResponse(
            conversation_id=conv_id,
            response=ai_response,
            timestamp=datetime.now().isoformat(),
            model=model_name
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history/{conversation_id}", response_model=ConversationHistory)
async def get_history(conversation_id: str):
    """Get chat history for a conversation."""
    messages = chat_history.get(conversation_id, [])
    return ConversationHistory(
        conversation_id=conversation_id,
        messages=messages
    )

@app.delete("/api/history/{conversation_id}")
async def delete_history(conversation_id: str):
    """Delete chat history for a conversation."""
    if conversation_id in chat_history:
        del chat_history[conversation_id]
        return {"status": "deleted", "conversation_id": conversation_id}
    return {"status": "not_found", "conversation_id": conversation_id}

@app.get("/api/models")
async def get_models():
    """Get available models."""
    return {
        "models": [
            {
                "id": "llama-70b",
                "name": "LLaMA 3.1 70B",
                "description": "Best for general purpose, balanced",
                "speed": "medium"
            },
            {
                "id": "llama-8b",
                "name": "LLaMA 3.1 8B",
                "description": "Lightweight, fast responses",
                "speed": "fast"
            },
            {
                "id": "mistral",
                "name": "Mistral 7B",
                "description": "Fast inference, good quality",
                "speed": "fast"
            },
            {
                "id": "qwen",
                "name": "Qwen 2.5 72B",
                "description": "Excellent reasoning and coding",
                "speed": "medium"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
