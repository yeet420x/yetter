from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import logging
from agents.luna.main import LunaAgent

app = FastAPI()
logger = logging.getLogger(__name__)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Luna agent
luna = LunaAgent()

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await websocket.accept()
        logger.debug("WebSocket connection accepted")
        
        while True:
            try:
                # Receive message from client
                message = await websocket.receive_text()
                
                # Generate response from Luna
                response = luna.process_message(message)
                
                # Send response back to client
                await websocket.send_json(response)
                
            except Exception as e:
                logger.error(f"Error in WebSocket communication: {e}")
                await websocket.send_json({
                    "message": "*connection flickers* Something seems to be amiss...",
                    "status": "error"
                })
                
    except Exception as e:
        logger.error(f"WebSocket connection error: {e}")
    finally:
        try:
            await websocket.close()
            logger.info("Client disconnected normally")
        except:
            logger.warning("Client disconnected abnormally")
        logger.debug("WebSocket connection ended")

@app.get("/")
def read_root():
    return {"status": "Luna is operational"} 