FROM python:3.11-slim

WORKDIR /app

COPY apps/python-ai/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY apps/python-ai /app

ENV PYTHONUNBUFFERED=1
ENV PORT=4002

EXPOSE 4002

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
