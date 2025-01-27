import logging
import random
from typing import Dict, Any
from agents.luna.responses.dialog import LUNA_RESPONSES

logger = logging.getLogger(__name__)

class ResponseGenerator:
    def __init__(self):
        """Initialize the response generator with predefined responses."""
        logger.debug("Initializing ResponseGenerator")
        try:
            self.response_patterns = LUNA_RESPONSES
            if not self.response_patterns:
                raise ValueError("Response patterns empty")
            logger.debug(f"Initialized with patterns: {list(self.response_patterns.keys())}")
        except Exception as e:
            logger.error(f"Error during initialization: {e}")
            raise

    def _analyze_message(self, message: str) -> str:
        """Analyze message content to determine the most appropriate response category."""
        message = message.lower().strip()
        
        # Check each category's patterns
        for category, data in self.response_patterns.items():
            patterns = data.get("patterns", [])
            if any(pattern in message for pattern in patterns):
                logger.debug(f"Found matching category: {category}")
                return category
                
        logger.debug("No specific category matched, using default response")
        return "default"

    def generate_normal_response(self, emotional_state: Dict[str, Any]) -> dict:
        """Generate a contextually appropriate response based on the input message."""
        try:
            message = emotional_state.get("last_message", "")
            if not message:
                return {
                    "message": "*tilts head thoughtfully* I'm listening...",
                    "emotional_state": emotional_state,
                    "status": "normal"
                }

            # Find appropriate category
            category = self._analyze_message(message)
            
            # Get response from category
            if category != "default" and category in self.response_patterns:
                response = random.choice(self.response_patterns[category]["responses"])
            else:
                response = "*tilts head thoughtfully* I'm listening..."

            return {
                "message": response,
                "emotional_state": emotional_state,
                "status": "normal"
            }

        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return self.generate_error_response(emotional_state)

    def generate_rejection_response(self, emotional_state: Dict[str, Any]) -> dict:
        """Generate a rejection response for inappropriate content."""
        try:
            if "boundary_enforcement" in self.response_patterns:
                response = random.choice(self.response_patterns["boundary_enforcement"]["responses"])
            else:
                response = "*frost forms in her voice* Such topics are forbidden."
            
            return {
                "message": response,
                "emotional_state": emotional_state,
                "status": "rejected"
            }
        except Exception as e:
            logger.error(f"Error generating rejection: {e}")
            return {
                "message": "*frost forms in her voice* Such topics are forbidden.",
                "emotional_state": emotional_state,
                "status": "rejected"
            }

    def generate_error_response(self, emotional_state: Dict[str, Any]) -> dict:
        """Generate an error response when something goes wrong."""
        return {
            "message": "*looks confused* Something seems to be troubling me...",
            "emotional_state": emotional_state,
            "status": "error"
        } 