import logging
import random

logger = logging.getLogger(__name__)

class EmotionalEngine:
    def __init__(self):
        logger.debug("Initializing EmotionalEngine")
        self.comfort_level = 0.5  # neutral starting point
        self.melancholy = 0.7     # characteristic trait
        self.introspection = 0.8  # characteristic trait

    def update_comfort_level(self, user_input: str) -> None:
        """Update comfort level based on user input"""
        # Simple sentiment analysis
        positive_words = {'good', 'great', 'happy', 'thanks', 'love', 'nice', 'hello', 'hi'}
        negative_words = {'bad', 'sad', 'angry', 'hate', 'terrible', 'awful'}
        
        words = user_input.lower().split()
        
        # Adjust comfort level based on words
        for word in words:
            if word in positive_words:
                self.comfort_level = min(1.0, self.comfort_level + 0.1)
            elif word in negative_words:
                self.comfort_level = max(0.0, self.comfort_level - 0.1)

    def get_emotional_state(self) -> dict:
        """Return current emotional state"""
        return {
            "comfort_level": self.comfort_level,
            "melancholy": self.melancholy,
            "introspection": self.introspection
        } 