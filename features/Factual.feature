@weather
Feature: Weather Lookup

  As a user
  I want to get weather information
  So that I can know current conditions

  Scenario: User asks weather with location
    Given the user is on the chat page
    When the user sends "weather Milan"
    Then the system should call the weather service
    And return weather information for "Milan"

  Scenario: Weather query is detected even with extra words
    Given the user is on the chat page
    When the user sends "what is the weather Paris"
    Then the system should extract "Paris"
    And return weather information for "Paris"

  Scenario: Weather overrides model selection
    Given the user is on the chat page
    Given the user selects "gemini"
    When the user sends "weather Tokyo"
    Then the system should call the weather service
    And return weather information for "Tokyo"