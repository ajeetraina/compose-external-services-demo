# Docker Compose v2.35.0 External AI Services Demo

This repository demonstrates how to use the new external services feature in Docker Compose v2.35.0 to easily integrate AI models via Docker Model Runner. It's based on the [ajeetraina/genai-app-demo](https://github.com/ajeetraina/genai-app-demo) project, maintaining the same tech stack and functionality while adding support for the external AI services feature.

## Features

- Chat interface with streaming responses
- Prometheus metrics for observability
- Automatic environment variable injection for AI model connectivity
- Compatible with Docker Model Runner via external services
- Designed to work with existing Docker infrastructure

## Prerequisites

- Docker Desktop (latest version)
- Docker Compose v2.35.0
- Go 1.23+ (for development)

## Getting Started

### Installing Docker Compose v2.35.0

For Mac with Apple Silicon:

```bash
# Download the Docker Compose binary
curl -L "https://github.com/docker/compose/releases/download/v2.35.0/docker-compose-darwin-aarch64" -o docker-compose

# Make it executable
chmod +x docker-compose

# Move it to a location in your PATH or use it directly
./docker-compose up
```

### Running the Application

```bash
# Clone this repository
git clone https://github.com/ajeetraina/compose-external-services-demo.git
cd compose-external-services-demo

# Start the application using Docker Compose v2.35.0
./docker-compose up
```

## How It Works

The application uses Docker Compose's new external services feature to connect to an AI model. The key components are:

1. **compose.yaml**: Defines the services, including the external AI model service:

```yaml
llama_model:
  external: true
  type: model
  options:
    model: ignaciolopezluna020/llama3.2:1b
```

2. **main.go**: Detects and uses the environment variables injected by Docker Compose:

```go
llmURL := os.Getenv("LLM_URL")
if llmURL != "" {
    // Using Docker Model Runner provided model
    client = openai.NewClient(
        option.WithBaseURL(llmURL),
        // No API key needed for Docker Model Runner
    )
}
```

3. **Observability**: Includes Prometheus metrics for monitoring performance.

## Architecture

The application consists of these services:

- **backend**: Go service that handles API requests and communicates with the AI model
- **frontend**: React app that provides a user interface
- **llama_model**: External AI model service provided by Docker Model Runner
- **prometheus**: Metrics collection
- **grafana**: Metrics visualization
- **jaeger**: Tracing service

## API Endpoints

- `/chat`: Main endpoint for sending messages to the AI model
- `/health`: Health check endpoint
- `/api/info`: Information about the current AI model integration
- `/metrics`: Prometheus metrics

## Environment Variables

- `LLM_URL`: Automatically injected by Docker Compose when using external model services
- `MODEL`: (Optional) Model name to use
- `BASE_URL` and `API_KEY`: Fallback configuration if not using Docker Model Runner

## Docker Compose v2.35.0 Features

This project showcases how the new external services feature in Docker Compose v2.35.0 simplifies AI model integration by:

1. Eliminating the need to manually configure AI model endpoints
2. Automatically injecting environment variables
3. Handling the connection to Docker Model Runner
4. Supporting development and production environments consistently

## License

This project is based on the original [ajeetraina/genai-app-demo](https://github.com/ajeetraina/genai-app-demo) project and follows its licensing.