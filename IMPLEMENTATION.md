# Implementation Guide: External AI Services in Docker Compose v2.35.0

This guide provides detailed instructions for implementing the new external services feature in Docker Compose v2.35.0.

## Step 1: Install Docker Compose v2.35.0

```bash
# Download Docker Compose binary
curl -L "https://github.com/docker/compose/releases/download/v2.35.0/docker-compose-darwin-aarch64" -o docker-compose-v2.35.0

# Make it executable
chmod +x docker-compose-v2.35.0
```

## Step 2: Modify Your compose.yaml File

Add the external model service and create a dependency:

```yaml
services:
  # Your existing service
  backend:
    # ... existing configuration ...
    depends_on:
      - llama_model  # Add this line

  # Add this new service for the AI model
  llama_model:
    external: true
    type: model
    options:
      model: ignaciolopezluna020/llama3.2:1b
```

## Step 3: Update Your Backend Code

Access the model URL from environment variables:

```go
llmURL := os.Getenv("LLM_URL")
if llmURL == "" {
    log.Fatal("LLM_URL environment variable not set")
}

// Use llmURL to connect to the model
```

## Step 4: Run the Application

```bash
./docker-compose-v2.35.0 up
```

## Step 5: Test the Integration

```bash
curl -X POST http://localhost:8080/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Tell me about Docker Compose"}'
```

## Technical Details

The external services feature in Docker Compose v2.35.0 creates an abstraction that allows seamless integration with Docker Model Runner. When you declare an external model service, Docker Compose will:

1. Identify the model service as external using the `external: true` property
2. Connect to Docker Model Runner using information from the `type: model` property
3. Retrieve the specified model based on the `options.model` property
4. Inject environment variables into dependent services (those with `depends_on` relationships)

The primary environment variable that gets injected is `LLM_URL`, which contains the endpoint for connecting to the model.

This approach significantly simplifies AI model integration by eliminating the need to manually manage connection details or endpoints.