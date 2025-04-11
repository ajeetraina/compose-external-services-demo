# Docker Compose v2.35.0 External AI Services Demo

This repository demonstrates how to use the new external services feature in Docker Compose v2.35.0 to easily integrate AI models from Docker Model Runner.

## Key Features

- External AI service integration with Docker Compose
- Automatic environment variable injection for model connectivity
- Compatible with Docker Model Runner
- Based on the [ajeetraina/genai-app-demo](https://github.com/ajeetraina/genai-app-demo) project

## Requirements

- Docker Desktop (latest version)
- Docker Compose v2.35.0
- Mac with Apple Silicon (for provided installation commands)

## Installation

```bash
# Download the Docker Compose binary
curl -L "https://github.com/docker/compose/releases/download/v2.35.0/docker-compose-darwin-aarch64" -o docker-compose

# Make it executable
chmod +x docker-compose

# Move it to a directory in your PATH or use it directly
./docker-compose up
```

## How It Works

The `compose.yaml` file includes an external service definition:

```yaml
llama_model:
  external: true
  type: model
  options:
    model: ignaciolopezluna020/llama3.2:1b
```

When you start the application, Docker Compose will:

1. Connect to the specified AI model using Docker Model Runner
2. Inject environment variables into your backend service
3. Your backend code can use these variables to connect to the model

## Implementation Details

This setup uses the "external services" feature added in Docker Compose v2.35.0, which allows Compose to connect to AI models running in Docker Model Runner.

The `depends_on` relationship causes Docker Compose to automatically inject the necessary environment variables into your container, primarily `LLM_URL` which provides the endpoint for communicating with the model.

## License

Based on the original [ajeetraina/genai-app-demo](https://github.com/ajeetraina/genai-app-demo) project.