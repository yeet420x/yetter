from transformers import AutoModelForCausalLM, AutoTokenizer, AutoModel
import torch
import numpy as np

class EnhancedModel:
    def __init__(self):
        # Using a smaller BERT model for embeddings
        self.model_name = "bert-base-uncased"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModel.from_pretrained(self.model_name)
        
        # Personality embedding vector
        self.personality_embedding = self.generate_personality_embedding()
        
    def generate_personality_embedding(self):
        gothic_traits = [
            "shy", "introspective", "poetic", "mysterious",
            "dark aesthetic", "romantic", "melancholic"
        ]
        return np.mean([self.get_word_embedding(trait) for trait in gothic_traits], axis=0)
    
    def get_word_embedding(self, word):
        # Add padding and attention mask
        inputs = self.tokenizer(
            word,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=512
        )
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            
        # Get the embedding from the last hidden state
        # Take mean of token embeddings
        embeddings = outputs.last_hidden_state.mean(dim=1)
        return embeddings.numpy()

    def get_response_embedding(self, text):
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=512
        )
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            
        return outputs.last_hidden_state.mean(dim=1).numpy() 