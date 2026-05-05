Feature: Model Recommendation
//this feature already showed during other acceptance tests
  As a user
  I want the system to choose the best model
  So that I get accurate responses

  Scenario: Math query uses local solver
    Given the user is on the chat page
    When the user sends "5 * 6"
    Then the system should use internal math solver

  Scenario: Complex math uses Gemini
    Given the user sends "solve integral of x^2 * sin(x)"
    Then the system should route the query to Gemini

  Scenario: General query uses default LLM
    Given the user sends "Tell me a joke"
    Then the system should use the default LLM