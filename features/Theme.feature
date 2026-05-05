@theme
Feature: Theme

Scenario: Toggle from dark to light
    Given I am on the landing page
    And the theme is dark
    When I click the theme toggle button
    Then the theme should be light

Scenario: Toggle back to dark
  Given I am on the landing page
  And the theme is dark
  When I click the theme toggle button twice
  Then the theme should be dark