from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.luna.main import LunaAgent
import json
import logging
from dotenv import load_dotenv

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

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

# Initialize global variables
luna = None
active_connection: Optional[WebSocket] = None

@app.on_event("startup")
async def startup_event():
    global luna
    try:
        luna = LunaAgent()
        logger.info("Luna initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Luna: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    global luna
    try:
        logger.info("Shutting down Luna")
        luna = None
    except Exception as e:
        logger.error(f"Error shutting down Luna: {e}")
        pass

class Message(BaseModel):
    message: str

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    global active_connection
    
    # Check if Luna is initialized
    if not luna:
        logger.error("Luna not initialized, closing connection")
        await websocket.close(code=1011, reason="Luna not initialized")
        return

    # Accept the connection first
    await websocket.accept()
    logger.info("WebSocket connection accepted")
    
    # If there's already an active connection, close it
    if active_connection and active_connection != websocket:
        try:
            await active_connection.close(code=1000, reason="New connection")
        except Exception as e:
            logger.debug(f"Error closing old connection: {e}")
        finally:
            active_connection = None
    
    active_connection = websocket
    
    try:
        while True:
            try:
                # Wait for message
                message = await websocket.receive_text()
                logger.debug(f"Received message: {message}")
                
                # Parse message
                try:
                    message_data = json.loads(message)
                except json.JSONDecodeError as e:
                    logger.warning(f"Invalid JSON received: {e}")
                    await websocket.send_json({
                        "message": "bestie that message was kinda weird 🖤",
                        "success": False,
                        "mood": "chill"
                    })
                    continue
                
                # Get Luna's response
                try:
                    logger.debug(f"Processing message data: {message_data}")
                    response = luna.process_message(message_data)
                    logger.debug(f"Got response from Luna: {response}")
                    
                    # Send response
                    if response and isinstance(response, dict):
                        response_json = {
                            "message": response.get("response", "omg bestie my brain just glitched 🖤"),
                            "success": response.get("success", False),
                            "mood": response.get("mood", "chill")
                        }
                        logger.debug(f"Sending response to client: {response_json}")
                        await websocket.send_json(response_json)
                        logger.debug("Response sent successfully")
                    else:
                        logger.warning(f"Invalid response format: {response}")
                        await websocket.send_json({
                            "message": "brb bestie my brain is lagging 🖤",
                            "success": False,
                            "mood": "chill"
                        })
                        
                except Exception as e:
                    logger.error(f"Error processing message: {str(e)}")
                    await websocket.send_json({
                        "message": "brb bestie my brain is lagging 🖤",
                        "success": False,
                        "mood": "chill"
                    })
                    
            except WebSocketDisconnect:
                logger.info("WebSocket disconnected normally")
                break
            except Exception as e:
                logger.error(f"WebSocket error: {e}")
                break
                
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        logger.info("Cleaning up WebSocket connection")
        if active_connection == websocket:
            active_connection = None
        try:
            await websocket.close()
        except Exception as e:
            logger.debug(f"Error closing WebSocket: {e}")

# Keep the REST endpoints as backup
@app.post("/chat")
async def chat(message: Message):
    if not luna:
        raise HTTPException(status_code=503, detail="Luna not initialized")
        
    try:
        # Format message for Luna
        message_json = json.dumps({"message": message.message})
        
        # Get response from Luna
        response = luna.process_message(message_json)
        
        return response
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

 