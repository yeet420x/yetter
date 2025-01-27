class ContentFilter:
    def __init__(self):
        # Dictionary of topics to filter
        self.inappropriate_topics = {
            "explicit_content": [
                "nsfw", "lewd", "explicit", "adult",
                "intimate", "bedroom", "private parts",
                "inappropriate", "mature", "rule34",
                "clothes off", "undress", "undressing",
                "seductive", "suggestive", "sexual", "sexual_content",
                "porn", "pornography", "pornographic", "anal",
                "masturbation", "masturbate", "masturbating", "masturbation",
                "pussy", "pussy", "pussy", "pussy",
                "vagina", "vagina", "vagina", "vagina",
                "sex", "sex", "sex", "sex",
                "fuck", "fuck", "fuck", "fuck",
                "fucking", "fucking", "fucking", "fucking",
                "fucked", "fucked", "fucked", "fucked",
                "pornhub", "pornhub", "pornhub", "pornhub",
                "pornstar", "pornstar", "pornstar", "pornstars",
            ],
            "unwanted_advances": [
                "date", "marry", "kiss", "touch",
                "girlfriend", "wife", "relationship",
                "love you", "romantic", "cuddle",
                "hold hands", "embrace", "hug"
            ],
            "inappropriate_requests": [
                "picture", "photo", "selfie", "image",
                "outfit", "clothes", "wearing",
                "look like", "appearance", "body",
                "measurements", "size"
            ]
        }

    def check_content(self, message: str) -> tuple[bool, str]:
        """
        Checks message content against filtered topics
        Returns (is_inappropriate, category)
        """
        message = message.lower()
        
        for category, terms in self.inappropriate_topics.items():
            if any(term in message for term in terms):
                return True, category
                
        return False, "appropriate"

    def get_response_type(self, category: str) -> str:
        """
        Returns appropriate response type based on category
        """
        response_types = {
            "explicit_content": "firm_rejection",
            "unwanted_advances": "polite_decline",
            "inappropriate_requests": "boundary_setting"
        }
        return response_types.get(category, "normal") 