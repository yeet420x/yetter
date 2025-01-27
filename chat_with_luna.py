import logging
from agents.luna.main import LunaAgent
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def chat_with_luna():
    try:
        print("Initializing Luna...")
        luna = LunaAgent()
        print("Luna is ready! Type 'exit' to end the conversation.")
        
        while True:
            user_input = input("\nYou: ").strip()
            
            if user_input.lower() == 'exit':
                print("\nLuna: *waves goodbye* See you later! ★w★")
                break
                
            message = json.dumps({"message": user_input})
            response = luna.process_message(message)
            print("\nLuna:", response["message"])
            
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        print("An error occurred. Please try again.")

if __name__ == "__main__":
    chat_with_luna() 