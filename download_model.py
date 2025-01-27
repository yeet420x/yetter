from huggingface_hub import hf_hub_download
import os

def download_model():
    print("Starting model download...")
    
    # Create models directory if it doesn't exist
    models_dir = os.path.join(os.getcwd(), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    try:
        # Download the GGUF model
        model_path = hf_hub_download(
            repo_id="TheBloke/Mistral-7B-Instruct-v0.1-GGUF",
            filename="mistral-7b-instruct-v0.1.Q4_K_M.gguf",
            local_dir=models_dir,
            local_dir_use_symlinks=False
        )
        
        print(f"\nModel downloaded successfully to: {model_path}")
        return model_path
        
    except Exception as e:
        print(f"Error downloading model: {e}")
        return None

if __name__ == "__main__":
    print("This will download the Mistral 7B GGUF model (approximately 4GB)")
    response = input("Do you want to continue? (y/n): ")
    
    if response.lower() == 'y':
        download_model()
    else:
        print("Download cancelled") 