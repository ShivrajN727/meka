@computation
Feature: Math Computation

  As a user
  I want to solve math problems
  So that I can get correct answers

  Scenario: Simple math is solved locally
    Given the user is on the chat page
    When the user sends "solve2+2="
    Then the system should classify it as "math_simple"
    And return "4"

  Scenario: Quadratic or linear math is solved locally
    Given the user is on the chat page
    When the user sends "solve x^2+2x+1=0"
    Then the system should classify it as "math_quadratic"
    And return the correct solution

  Scenario: Complex math is routed to Gemini
    Given the user is on the chat page
    When the user sends "integrate sin(x)^2 dx"
    Then the system should classify it as "math_complex"
    And call Gemini API