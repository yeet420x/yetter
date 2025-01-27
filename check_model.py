import os

models_dir = os.path.join(os.getcwd(), "models")
print("Models directory:", models_dir)
print("\nFiles in models directory:")
for file in os.listdir(models_dir):
    print(f"- {file}") 