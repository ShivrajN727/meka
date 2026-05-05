@selector
Feature: Model Selector

  As a user
  I want to select different models
  So that I can control how responses are generated

  Scenario: User selects Gemini explicitly
    Given the user is on the chat page
    When the user selects "gemini"
    And the user sends "Hello"
    Then a response should be returned
    And the selected model should be "gemini"

  Scenario: Default model is used when no model is specified
    Given the user is on the chat page
    When the user sends "Hello"
    Then a response should be returned
    And no model is explicitly selected

  Scenario: Model selection overrides other routing
    Given the user is on the chat page
    When the user selects "gemini"
    When the user sends "Tell me a story"
    Then a response should be returned
    And the selected model should be "gemini"