import nltk

nltk.download('punkt_tab')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger_eng')

from nltk.corpus import wordnet
from nltk.tokenize import word_tokenize
from nltk import pos_tag

from transformers import pipeline

emotion_pipeline = pipeline('text2text-generation', model='mrm8488/t5-base-finetuned-emotion')

def get_synonyms_for_emotion(sentence, max_synonyms=3, similarity_threshold=0.9):
    words = word_tokenize(sentence)  # Tokenize the sentence into words
    tagged_words = pos_tag(words)  # POS tagging to identify parts of speech
    all_synonyms = set()  # Use a set to avoid duplicates

    for word, tag in tagged_words:
        if tag.startswith('VBG') or tag.startswith('NN') or tag.startswith('JJ'):
            print(word + " " + tag)
            word_synonyms = set()
            original_synsets = wordnet.synsets(word)
            
            for synset in original_synsets:
                for synonym in synset.lemmas():
                    if synonym.name() != word:
                        for candidate_synset in wordnet.synsets(synonym.name()):
                            # Calculate similarity directly
                            similarity = max(
                                synset.wup_similarity(candidate_synset)
                                for synset in original_synsets
                            )
                            if similarity and similarity >= similarity_threshold:
                                word_synonyms.add(synonym.name())
                                break
                    if len(word_synonyms) >= max_synonyms:
                        break
                if len(word_synonyms) >= max_synonyms:
                    break

            all_synonyms.update(word_synonyms)
    print("all synonyms are", all_synonyms)
    return list(all_synonyms)  

def get_emotion(text):
    try:
        # Prepare the input text with a prefix for emotion detection
        input_text = f"emotion: {text}"
        
        # Generate emotion prediction using the pipeline
        output = emotion_pipeline(input_text, max_length=2, num_return_sequences=1)
        
        # Extract the emotion from the output
        emotion_keyword = output[0]['generated_text']

        input_text = text + " " + emotion_keyword
        emotion = get_synonyms_for_emotion(input_text)
        return emotion
    
    except Exception as e:
        print(f"Error predicting emotion: {str(e)}")
        return None

# def load_model_and_tokenizer():
#     try:
#         tokenizer = T5Tokenizer.from_pretrained(
#             "mrm8488/t5-base-finetuned-emotion",
#             model_max_length=512,
#             legacy=True
#         )
        
#         model = T5ForConditionalGeneration.from_pretrained(
#             "mrm8488/t5-base-finetuned-emotion"
#         )
#         return tokenizer, model
#     except Exception as e:
#         print(f"Error loading model or tokenizer: {str(e)}")
#         raise

# def get_emotion(text, tokenizer=None, model=None):
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
# tokenizer, model = load_model_and_tokenizer()

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

