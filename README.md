# Meka
AI Agent built for Rutgers Software Engineering Class Spring 2026

# Team (iteration 1)
Requirements: Yiwen Cai  
Development: Shivraj Nath  
Testing: Zohaib Ahmed, Muhammad Nazir

# Team (iteration 2) 
Requirements: Zohaib Ahmed, Muhammad Nazir  
Development: Yiwen Cai  
Testing: Shivraj Nath

# Team (iteration 3)
Requirements: Shivraj Nath  
Development: Zohaib Ahmed, Muhammad Nazir  
Testing: Yiwen Cai

# Metadata
**Application Name:** meka  
## Core Features for Iteration 1:
- Landing page
- User account creation
- Login/Logout

## Core Features for Iteration 2:
- Chat Interface
- Fly out panel  
- Conversation History  
- Search box

## Core Features for Iteration 3: 
- LLM Selector
- Theme Selector
- Accurate Information
- LLM Recommendation 

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** SQLite
- **Testing:** Jasmine, Cucumber.js, Puppeteer

## User Stories and Features

### Identified Stories for Iteration 1
| # | User Story | Function | Points Assigned |
|---|------------|----------|-----------------|
| A | As a visitor, I want to see a landing page that explains the tool, so I can understand the application | Home Page | 2 |
| B | As a new user, I want to create an account, so I can access the interface | Account Creation | 3 | 
| C | As a registered user, I want to login to my preexisting account, so that I can access the interface | Log-In | 3 |
| D | As a logged-in user, I want to be able to log out, so that my session is securely ended | Log-Out | 1 | 

Total effort: 2 + 3 + 3 + 1 = 9 points.  
These stories deliver a basic interface with a landing page and user authentication.

### Identified Stories for Iteration 2
| #  | User Story                                                                                                                 | Function                  | Points |
| -- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------ |
| E1 | As a user, I want to enter a prompt in a chat input box, so that I can send a question to the LLM                          | Send Prompt               | 2      |
| E2 | As a user, I want to receive a response from the LLM after submitting a prompt, so that I can get answers                  | Receive Response          | 2      |
| F  | As a logged-in user, I want my conversations to be saved automatically after each message, so that I can review them later | Save Conversation History | 2      |
| G1 | As a logged-in user, I want to search conversations by keyword, so that I can find relevant chats                          | Search by Keyword         | 2      |
| G2 | As a logged-in user, I want to see a list of matching conversations, so that I can choose one to view                      | Display Search Results    | 1      |
| H  | As a logged-in user, I want to reopen a previous conversation, so that I can continue chatting in the same thread          | Continue Conversation     | 2      |


Total effort: 2+2+2+2+1+2 = 11 points.   
These stories allow users to interact with the LLM and manage their conversation history.

### Identified Stories for Iteration 3
| # | User Story | Function | Points Assigned |
|---|------------|----------|-----------------|
| I | As a regular user, I want to select different backend LLMs, so I can get a response that may be more accurate. | Selected LLMs | 2 |
| J1 | As a mathematical user, I want to be able to get accurate responses to math questions from the LLM, so I can solve problems. | Computation | 1 | 
| J2 | As a practical user, I want to be able to ask about the weather in my location to the LLM, so I can find out quickly and conveniently. | Factual Lookup | 1 |
| K | As an expressive user, I want to be able to change the theme of the website through the LLM, so that the site can cater to my visual needs. | Customization | 2 | 
| L | As a regular user, I want the website to suggest what the best LLM is based on my question, so that I’m given the most accurate information. | Reccomendation | 3 |

Total effort: 2 + 1 + 1 + 2 + 3 = 9 points.  
These stories fine tunes the service to be as accurate as possible. 
