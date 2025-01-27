from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.luna.main import LunaAgent
import json
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize Luna
luna = LunaAgent()

class Message(BaseModel):
    message: str

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            message = await websocket.receive_text()
            logger.debug(f"Received message: {message}")
            
            response = luna.process_message(message)
            logger.debug(f"Generated response: {response}")
            
            if response and "message" in response:
                await websocket.send_json(response)
                logger.debug(f"Sent response: {response}")
            else:
                logger.error(f"Invalid response format: {response}")
                await websocket.send_json({
                    "message": "*shadows flicker* Something went wrong... 🦇",
                    "status": "error"
                })
    except Exception as e:
        logger.error(f"WebSocket error: {e}", exc_info=True)

# Keep the REST endpoints as backup
@app.post("/chat")
async def chat(message: Message):
    try:
        # Format message for Luna
        message_json = json.dumps({"message": message.message})
        
        # Get response from Luna
        response = luna.process_message(message_json)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/reset")
async def reset():
    try:
        luna.reset_state()
        return {"message": "Conversation reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 