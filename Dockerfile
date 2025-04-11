# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy Go module files and download dependencies
COPY go.mod go.sum* ./
RUN if [ -f go.sum ]; then go mod download; else go mod tidy; fi

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o backend .

# Runtime stage
FROM alpine:latest AS backend

RUN apk --no-cache add ca-certificates wget curl

WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/backend /app/backend

# Expose ports
EXPOSE 8080 9090

# Command to run
CMD ["/app/backend"]
