import websockets
import asyncio
import json

async def test_connection():
    uri = "wss://hcycfuvviw7fmk-8000.proxy.runpod.net/ws/chat"
    print(f"Connecting to {uri}")
    
    try:
        async with websockets.connect(uri, ssl=True) as websocket:
            print("Connected!")
            message = {"message": "Hello Luna!"}
            print(f"Sending: {message}")
            await websocket.send(json.dumps(message))
            response = await websocket.recv()
            print(f"Luna says: {response}")
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(test_connection()) 