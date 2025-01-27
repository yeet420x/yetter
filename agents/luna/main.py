import json
import logging
import random
from typing import Dict, Any
import re
from datetime import datetime
from .llm_handler import LLMHandler

class ResponseGenerator:
    def __init__(self):
        self.llm = LLMHandler()
        self.conversation_state = {
            "topic": None,
            "intensity": 0.5,
            "intimacy": 0.5
        }
        
        self.emotes = {
            "seductive": ["⚰️💜", "●w●", "✧w✧"],
            "playful": ["🦇✨", "uwu~", "owo~"],
            "dominant": ["⚰️👑", "●˘●", "✧♠✧"],
            "intimate": ["💜✨", "●︿●", "♠w♠"],
            "concerned": ["🦇💔", "●﹏●", "⚰️💭"],
            "default": ["🦇", "●w●", "✧"]
        }
        
        self.gothic_expressions = [
            "Darkness whispers...",
            "From shadows deep...",
            "In gothic grace...",
            "Moonlight beckons...",
            "Night embraces us...",
        ]
        
        self.logger = logging.getLogger(__name__)

    def get_gothic_expression(self) -> str:
        """Get a random gothic expression"""
        return random.choice(self.gothic_expressions)

    def get_emote(self, mood: str) -> str:
        """Get an emote based on mood"""
        return random.choice(self.emotes.get(mood, self.emotes["default"]))

    def generate_response(self, message: str, context: dict = None) -> dict:
        try:
            # Analyze message
            if context is None:
                context = self.analyze_message(message)
            
            self.conversation_state.update(context)

            # Generate response
            response = self.llm.generate_response(message)

            if response["success"]:
                # Add appropriate emote based on context
                emote = self.get_emote(response.get("mood", "default"))
                response_text = f"{response['response']} {emote}"

                return {
                    "message": response_text,
                    "status": "success"
                }
            else:
                return {
                    "message": f"{self.get_gothic_expression()} {self.get_emote('concerned')}",
                    "status": "error"
                }

        except Exception as e:
            self.logger.error(f"Error in response generation: {str(e)}")
            return {
                "message": f"The shadows momentarily cloud my vision... {self.get_emote('concerned')}",
                "status": "error"
            }

    def analyze_message(self, message: str) -> dict:
        """Analyze message content for better context"""
        return {
            "topic": "general",
            "intensity": 0.5,
            "intimacy": 0.5
        }

class LunaAgent:
    def __init__(self):
        self.response_generator = ResponseGenerator()
        self.logger = logging.getLogger(__name__)

    def process_message(self, message_data: str) -> dict:
        try:
            # Parse message data
            if isinstance(message_data, str):
                data = json.loads(message_data)
                message = data.get("message", "")
            else:
                message = message_data.get("message", "")

            # Generate response
            response = self.response_generator.generate_response(message)
            
            return {
                "message": response["message"],
                "status": response["status"]
            }

        except Exception as e:
            self.logger.error(f"Error processing message: {str(e)}")
            return {
                "message": f"{self.response_generator.get_gothic_expression()} The shadows of error cloud my vision... {self.response_generator.get_emote('concerned')}",
                "status": "error"
            } 