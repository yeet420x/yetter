import json
import logging
from typing import Dict, Any
from .llm_handler import LLMHandler

class LunaAgent:
    def __init__(self):
        self.llm = LLMHandler()
        self.logger = logging.getLogger(__name__)

    def process_message(self, message_data: str) -> dict:
        try:
            # Parse message data - handle both string and object inputs
            if isinstance(message_data, str):
                try:
                    data = json.loads(message_data)
                    message = data.get("message", "")
                except json.JSONDecodeError:
                    # If it's not JSON, treat it as a plain message
                    message = message_data
            else:
                # If it's already an object/dict
                message = message_data.get("message", "")

            # Generate response directly from LLM
            response = self.llm.generate_response(message)
            
            # Return the response as is - no extra processing
            return {
                "response": response.get("response", "hey gimme a sec to think 🖤"),
                "success": response.get("success", True),  # Default to True since we got a response
                "mood": response.get("mood", "chill")
            }

        except Exception as e:
            self.logger.error(f"Error processing message: {str(e)}")
            return {
                "response": "omg bestie my brain is lagging rn 🖤",
                "success": False,
                "mood": "chill"
            }