FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install torch==2.6.0 --extra-index-url https://download.pytorch.org/whl/cpu && pip install -r requirements.txt --no-deps

COPY . .

RUN python -c "import nltk; nltk.download('punkt'); nltk.download('wordnet'); nltk.download('averaged_perceptron_tagger')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]