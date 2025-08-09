from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import logging
from agents.luna.main import LunaAgent
from twitter import TwitterAPI
import os
from fastapi import HTTPException

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

twitter_api = TwitterAPI(
    consumer_key=os.getenv('TWITTER_API_KEY'),
    consumer_secret=os.getenv('TWITTER_API_SECRET'),
    access_token=os.getenv('TWITTER_ACCESS_TOKEN'),
    access_token_secret=os.getenv('TWITTER_ACCESS_SECRET')
)

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await websocket.accept()
        logger.info("WebSocket connection established")
        
        while True:
            message = await websocket.receive_text()
            logger.debug(f"Received message: {message}")
            
            try:
                response = luna.process_message(message)
                await websocket.send_json(response)
                logger.debug(f"Sent response: {response}")
                
            except Exception as e:
                logger.error(f"Message processing error: {str(e)}", exc_info=True)
                await websocket.send_json({
                    "message": "⚠️ My circuits are glitching... Try again?",
                    "status": "error"
                })
                
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}", exc_info=True)
    finally:
        await websocket.close()
        logger.info("WebSocket connection closed")

@app.get("/")
def read_root():
    return {"status": "Luna is operational"}

@app.post("/tweet")
async def tweet(message: dict):
    try:
        response = twitter_api.tweet(message['message'])
        return {"success": True, "tweet_id": response.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 