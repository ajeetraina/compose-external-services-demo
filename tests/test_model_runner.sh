#!/bin/bash

# Simple test script to verify that Model Runner integration is working

echo "Testing Model Runner integration..."

# Check if the backend service is responding
echo "Checking backend health..."
curl -s http://localhost:8080/health

# Check if the API info endpoint shows Model Runner integration
echo "\nChecking API info..."
CURLRESULT=$(curl -s http://localhost:8080/api/info)
echo "$CURLRESULT"

# Check if LLM_URL is present in environment
echo "\nChecking for LLM_URL environment variable in container..."
docker-compose exec backend env | grep LLM

# Send a test prompt to the chat endpoint
echo "\nSending test prompt to chat endpoint..."
curl -X POST http://localhost:8080/chat \
     -H "Content-Type: application/json" \
     -d '{"messages": [], "message": "Hello, are you using Docker Model Runner?"}'

echo "\nTest completed."
