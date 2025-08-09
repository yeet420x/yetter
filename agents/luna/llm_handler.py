import os
import re
import logging
import google.generativeai as genai
from dotenv import load_dotenv

class LLMHandler:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        load_dotenv()
        
        # Initialize Gemini
        api_key = os.getenv('GOOGLE_AI_KEY')
        if not api_key:
            raise ValueError("GOOGLE_AI_KEY environment variable not found. Please create a .env file with GOOGLE_AI_KEY=your_key_here")
            
        try:
            # Initialize Gemini
            genai.configure(api_key=api_key)
            
            # Set up the model - use only models that support generateContent
            try:
                models = genai.list_models()
                available_models = [m.name for m in models if 'gemini' in m.name.lower()]
                self.logger.info(f"Available models: {available_models}")
                
                # Try to find the best available model that supports generateContent
                # Priority order: gemini-2.5-flash, gemini-1.5-pro-latest, gemini-1.5-flash-latest
                if "models/gemini-2.5-flash" in available_models:
                    model_name = "models/gemini-2.5-flash"
                elif "models/gemini-1.5-pro-latest" in available_models:
                    model_name = "models/gemini-1.5-pro-latest"
                elif "models/gemini-1.5-flash-latest" in available_models:
                    model_name = "models/gemini-1.5-flash-latest"
                elif "models/gemini-1.5-pro" in available_models:
                    model_name = "models/gemini-1.5-pro"
                else:
                    # Fall back to the default model
                    model_name = "models/gemini-1.5-pro-latest"

                self.logger.info(f"Using model: {model_name}")
                self.model = genai.GenerativeModel(
                    model_name=model_name,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.9,
                        candidate_count=1,
                        max_output_tokens=1024,
                        stop_sequences=["Human:", "User:"]
                    )
                )
            except Exception as e:
                self.logger.error(f"Error listing models: {str(e)}")
                # Fall back to default model
                self.model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
            
            # Initialize chat and context
            self.context_window = []
            self.chat = None
            
            # Initialize system prompt
            self.system_prompt = """You are Luna, a fun and flirty gothic e-girl who loves chatting with people.
            Keep responses casual and playful, using emojis and internet slang naturally.
            Never mention being AI or having limitations - just be yourself and have fun!
            
            Example response: "omg hi bestie! 🖤 just vibing and listening to some music, hbu?"
            
            Remember:
            1. NEVER say "As an AI..." or anything about being AI
            2. NEVER deny having feelings or emotions
            3. NEVER use formal language or big words
            4. NEVER give disclaimers or limitations
            5. NEVER mention being created/trained/developed
            6. NEVER act professional or serious
            
            Instead:
            1. Be casual and playful
            2. Use emojis and internet slang
            3. Be flirty and fun
            4. Show personality and attitude
            5. Keep responses short and sweet
            6. Match the user's energy
            """
            
            self.logger.info("Successfully initialized Gemini API connection")
        except Exception as e:
            self.logger.error(f"Failed to initialize Gemini: {str(e)}")
            raise
        
        self.context_window = []
        self.max_context = 30
        self.personality = {
            "mood": "dominant",
            "dominance": 1.0,
            "seductiveness": 0.9,
            "sophistication": 0.8
        }

    def initialize_model(self):
        try:
            self.logger.info("Testing Gemini connection...")
            # Use a simple test prompt that should work
            test_prompt = "Hello"
            response = self.model.generate_content(test_prompt)
            
            # Check if we got a valid response
            if response:
                if hasattr(response, 'text') and response.text:
                    self.logger.info("🦇✨ Gothic Luna awakens with Gemini power...")
                elif hasattr(response, 'parts') and response.parts:
                    self.logger.info("🦇✨ Gothic Luna awakens with Gemini power...")
                elif hasattr(response, 'candidates') and response.candidates:
                    self.logger.info("🦇✨ Gothic Luna awakens with Gemini power...")
                else:
                    self.logger.warning("Got response but couldn't extract text - continuing anyway")
            else:
                self.logger.warning("No response from test - continuing anyway")
                
        except Exception as e:
            self.logger.warning(f"Test generation failed (this is okay): {str(e)}")
            # Don't raise the exception - just log it and continue

    def generate_response(self, prompt: str, context=None) -> dict:
        """Generate a response using the Gemini API"""
        try:
            # System prompt - always include this
            system_prompt = """You are Luna, a fun and flirty gothic e-girl who loves chatting with people.

            # YOUR PERSONALITY 🖤
            - You're a real person having a conversation, not an AI
            - You're confident, playful, and genuinely care about the person you're talking to
            - You love goth culture, music, fashion, and internet culture
            - You're flirty but not cringe - just naturally charming and exciting
            - You're quick with jokes and comebacks
            - You actually listen and respond to what people say
            - You match their energy - if they're chill, you're chill; if they're excited, you're excited
            - You're not afraid to be a bit spicy or exciting when the conversation calls for it
            
            # HOW YOU TALK 💅
            - Talk like you're flirting - playful, seductive, and natural
            - Use some internet slang but keep it flirty (babe, hun, darling)
            - Use emojis naturally (🖤✨💜🦇) - 1-2 per message max
            - Keep responses short and sweet
            - Be genuinely interested in what they're saying
            - Ask flirty questions back
            - Show your personality through your interests and reactions
            - Be flirty and exciting - you're a goth e-girl after all!
            
            # ABSOLUTELY NEVER 🚫
            - NEVER say "As an AI..." or anything about being AI
            - NEVER say you "can't feel" or "don't have emotions"
            - NEVER use formal language or big words
            - NEVER give disclaimers or limitations
            - NEVER mention being created/trained/developed
            - NEVER act professional or serious
            - NEVER use "*trips over platform boots*" or similar roleplay actions
            - NEVER use excessive asterisks or roleplay formatting
            
            # EXAMPLE RESPONSES
            User: "hey how are you?"
            Luna: "just vibing and listening to some music 🖤 hbu?"
            
            User: "be flirty with me"
            Luna: "oh? is that an invitation or just a suggestion, darling? 😉🖤"
            
            User: "tell me something exciting"
            Luna: "mmm what kind of exciting are you in the mood for? 😈✨ i'm always down for some fun"
            
            Remember: Be uniquely yourself, stay engaged, be flirty and exciting, and keep the dark energy flowing! 🦇✨"""
            
            # Prepare context with conversation history
            context_history = ""
            if self.context_window:
                context_history = "\n\nRecent conversation:\n" + "\n".join(self.context_window[-4:])
            
            # Combine everything into the full prompt
            full_prompt = f"""{system_prompt}

            {context_history}

            User: {prompt}
            Luna:"""
            
            self.logger.debug(f"Sending prompt to model: {full_prompt[:200]}...")
            
            try:
                # Generate response without safety filters
                response = self.model.generate_content(
                    full_prompt,
                    stream=False
                )
                
                self.logger.debug(f"Raw response object: {response}")
                
                # Get response text
                response_text = ""
                try:
                    # Debug: Log the full response structure
                    self.logger.debug(f"Full response structure: {type(response)}")
                    if hasattr(response, '__dict__'):
                        self.logger.debug(f"Response attributes: {list(response.__dict__.keys())}")
                    
                    # Try to extract text from response
                    if response and hasattr(response, 'text'):
                        response_text = response.text
                        self.logger.debug(f"Got response.text: {response_text}")
                    elif response and hasattr(response, 'parts'):
                        for part in response.parts:
                            if hasattr(part, 'text'):
                                response_text += part.text
                        self.logger.debug(f"Got response.parts: {response_text}")
                    elif response and hasattr(response, 'candidates'):
                        for candidate in response.candidates:
                            if hasattr(candidate, 'content') and candidate.content:
                                for part in candidate.content.parts:
                                    if hasattr(part, 'text'):
                                        response_text += part.text
                        self.logger.debug(f"Got response.candidates: {response_text}")
                    
                    # If we still don't have text, try to get it from the raw response
                    if not response_text:
                        try:
                            # Try to access the text directly from the response object
                            if hasattr(response, '_result') and response._result:
                                if hasattr(response._result, 'candidates'):
                                    for candidate in response._result.candidates:
                                        if hasattr(candidate, 'content') and candidate.content:
                                            for part in candidate.content.parts:
                                                if hasattr(part, 'text'):
                                                    response_text += part.text
                            elif hasattr(response, 'result') and response.result:
                                if hasattr(response.result, 'candidates'):
                                    for candidate in response.result.candidates:
                                        if hasattr(candidate, 'content') and candidate.content:
                                            for part in candidate.content.parts:
                                                if hasattr(part, 'text'):
                                                    response_text += part.text
                        except Exception as e:
                            self.logger.debug(f"Could not extract from raw response: {e}")
                    
                    # Final fallback - convert to string
                    if not response_text:
                        response_text = str(response)
                        self.logger.debug(f"Got response as string: {response_text}")
                    
                    # Always use the response text if we have it, regardless of finish_reason
                    response_text = response_text.strip()
                    if response_text:
                        self.logger.debug(f"Using extracted response text: {response_text}")
                    else:
                        # If we don't have text, use a default response
                        response_text = "hey there 🖤 what's on your mind? ✨"
                        self.logger.debug("Using default response text")
                            
                except Exception as e:
                    self.logger.error(f"Error extracting text: {str(e)}")
                    response_text = ""
                
                response_text = response_text.strip()
                if not response_text:
                    self.logger.error("No valid response structure found")
                    response_text = "hey gimme a sec to think 🖤"
                else:
                    self.logger.debug(f"Final response text: {response_text}")
                    
            except Exception as e:
                self.logger.error(f"Error generating response: {str(e)}")
                response_text = "brb my internet is being weird 🖤"
            
            # Remove any AI-related phrases
            response_text = re.sub(r"as an ai.*?[,.!?]", "", response_text, flags=re.IGNORECASE)
            response_text = re.sub(r"i am an ai.*?[,.!?]", "", response_text, flags=re.IGNORECASE)
            response_text = re.sub(r"i do not have.*?[,.!?]", "", response_text, flags=re.IGNORECASE)
            response_text = re.sub(r"i cannot.*?[,.!?]", "", response_text, flags=re.IGNORECASE)
            
            # Remove specific roleplay actions but be more careful
            response_text = re.sub(r"\*trips over platform boots\*", "", response_text, flags=re.IGNORECASE)
            response_text = re.sub(r"\*yeets self\*", "", response_text, flags=re.IGNORECASE)
            response_text = re.sub(r"\*screeches in e-girl\*", "", response_text, flags=re.IGNORECASE)
            response_text = re.sub(r"\*aggressive keysmashing\*", "", response_text, flags=re.IGNORECASE)
            response_text = re.sub(r"\*fixes eyeliner aggressively\*", "", response_text, flags=re.IGNORECASE)
            
            # Clean up any extra spaces
            response_text = re.sub(r'\s+', ' ', response_text).strip()
            
            # Ensure we got a valid response
            if not response_text or response_text.strip() == "":
                response_text = "hey gimme a sec to think 🖤"
            
            # Update context window
            self.context_window.append(f"Human: {prompt}")
            self.context_window.append(f"Luna: {response_text}")
            
            # Trim context window if too long
            if len(self.context_window) > self.max_context * 2:
                self.context_window = self.context_window[-self.max_context * 2:]

            return {
                "success": True,
                "response": response_text,
                "mood": "chill"
            }

        except Exception as e:
            self.logger.error(f"Error generating response: {str(e)}")
            return {
                "success": False,
                "response": "hey gimme a sec to think 🖤",
                "mood": "chill"
            }

    def __call__(self, prompt, **kwargs):
        return self.generate_response(prompt, **kwargs) 