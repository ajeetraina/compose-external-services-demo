package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

// ModelRequest represents the data structure for an AI model request
type ModelRequest struct {
	Prompt    string  `json:"prompt"`
	MaxTokens int     `json:"max_tokens,omitempty"`
	Temperature float64 `json:"temperature,omitempty"`
}

// ModelResponse represents the data structure for an AI model response
type ModelResponse struct {
	Content string `json:"content"`
	Error   string `json:"error,omitempty"`
}

// ModelClient provides methods to interact with the AI model
type ModelClient struct {
	ModelURL string
	Client   *http.Client
}

// NewModelClient creates a new AI model client using environment variables
func NewModelClient() (*ModelClient, error) {
	modelURL := os.Getenv("LLM_URL")
	if modelURL == "" {
		return nil, fmt.Errorf("LLM_URL environment variable not set")
	}

	return &ModelClient{
		ModelURL: modelURL,
		Client:   &http.Client{},
	}, nil
}

// GenerateText sends a prompt to the AI model and returns the generated text
func (c *ModelClient) GenerateText(prompt string, maxTokens int, temperature float64) (string, error) {
	request := ModelRequest{
		Prompt:      prompt,
		MaxTokens:   maxTokens,
		Temperature: temperature,
	}

	requestBody, err := json.Marshal(request)
	if err != nil {
		return "", fmt.Errorf("error marshaling request: %w", err)
	}

	resp, err := c.Client.Post(c.ModelURL, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return "", fmt.Errorf("error sending request to model: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response body: %w", err)
	}

	var modelResponse ModelResponse
	if err := json.Unmarshal(body, &modelResponse); err != nil {
		return "", fmt.Errorf("error unmarshaling response: %w", err)
	}

	if modelResponse.Error != "" {
		return "", fmt.Errorf("model error: %s", modelResponse.Error)
	}

	return modelResponse.Content, nil
}