from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch

def load_model_and_tokenizer():
    try:
        tokenizer = T5Tokenizer.from_pretrained(
            "mrm8488/t5-base-finetuned-emotion",
            model_max_length=512,
            legacy=True
        )
        
        model = T5ForConditionalGeneration.from_pretrained(
            "mrm8488/t5-base-finetuned-emotion"
        )
        return tokenizer, model
    except Exception as e:
        print(f"Error loading model or tokenizer: {str(e)}")
        raise

def get_emotion(text, tokenizer=None, model=None):
    if tokenizer is None or model is None:
        tokenizer, model = load_model_and_tokenizer()
        
    try:
        input_text = f"emotion: {text}"
        inputs = tokenizer(input_text, return_tensors="pt", truncation=True, max_length=512)
        
        outputs = model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_length=2,
            num_return_sequences=1
        )
        
        emotion = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return emotion
    
    except Exception as e:
        print(f"Error predicting emotion: {str(e)}")
        return None

# Initialize model and tokenizer once
tokenizer, model = load_model_and_tokenizer()

# Interactive terminal input
if __name__ == "__main__":
    print("Emotion Detection Model (type 'quit' to exit)")
    print("-" * 50)
    
    while True:
        # Get input from user
        text = input("\nEnter text to analyze: ").strip()
        
        # Check for quit command
        if text.lower() in ['quit', 'exit', 'q']:
            print("\nGoodbye!")
            break
            
        # Skip empty inputs
        if not text:
            print("Please enter some text to analyze.")
            continue
            
        # Get and display emotion
        emotion = get_emotion(text, tokenizer, model)
        print(f"\nDetected emotion: {emotion}")

