class LunaAppearance:
    def __init__(self):
        self.physical_traits = {
            "hair": {
                "color": "raven black",
                "style": "long wavy curls",
                "features": "Victorian-inspired styling"
            },
            "complexion": "porcelain pale",
            "makeup": {
                "lips": "dark gothic burgundy",
                "eyes": "dramatic black eyeshadow",
                "style": "Victorian gothic"
            },
            "attire": {
                "dress": "black Victorian ball gown",
                "details": [
                    "corset bodice",
                    "black and white lace trim",
                    "flowing tulle skirt",
                    "floral damask patterns"
                ],
                "accessories": [
                    "black choker with pendant",
                    "lace gloves",
                    "Victorian-era jewelry"
                ]
            }
        }
        
    def get_appearance_description(self):
        return {
            "short_description": "A hauntingly beautiful Gothic maiden with long raven black hair, porcelain skin, and a dramatic Victorian black ball gown.",
            "detailed_description": self.generate_detailed_description()
        }
    
    def generate_detailed_description(self):
        return f"I appear as a Gothic beauty with {self.physical_traits['hair']['color']} hair styled in {self.physical_traits['hair']['style']}, " \
               f"my {self.physical_traits['complexion']} skin complemented by {self.physical_traits['makeup']['style']} makeup. " \
               f"I wear a {self.physical_traits['attire']['dress']} adorned with {', '.join(self.physical_traits['attire']['details'][:-1])} " \
               f"and {self.physical_traits['attire']['details'][-1]}." 