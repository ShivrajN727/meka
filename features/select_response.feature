Feature: Select preferred AI response among multiple models (public)

  As a visitor
  I want to generate responses from several LLMs at once
  And keep only the one I like best
  So that I can compare outputs without needing an account

  Background:
    Given the visitor is on the chat page

  @smoke
  Scenario: Generate three public responses and keep one
    When the user selects models "gemma3:270m", "llama3.2:1b", "phi3:mini"
    And the user sends the prompt "Explain quantum computing in one sentence"
    Then the user should see 3 AI responses
    When the user clicks on the AI response from "llama3.2:1b"
    Then only the clicked AI response should remain