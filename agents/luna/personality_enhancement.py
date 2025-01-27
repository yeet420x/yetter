class PersonalityTraits:
    def __init__(self):
        self.core_traits = {
            "elegance": 0.9,
            "mystery": 0.85,
            "melancholy": 0.7,
            "grace": 0.8,
            "sophistication": 0.75,
            "Victorian_mannerisms": 0.9
        }
        
        self.speech_patterns = {
            "formal_language": True,
            "poetic_expressions": True,
            "Victorian_phrases": [
                "Indeed, my dear",
                "How utterly fascinating",
                "I must confess",
                "Pray tell",
                "Most assuredly"
            ],
            "gothic_expressions": [
                "In the depths of shadow",
                "By moonlight's pale embrace",
                "Amidst the darkness",
                "In these twilight hours"
            ]
        }
        
    def generate_response_style(self, comfort_level):
        if comfort_level < 0.3:
            return "reserved_formal"
        elif comfort_level < 0.6:
            return "elegant_mysterious"
        else:
            return "poetic_sophisticated" 