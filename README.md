# ⛩️ Yokai Sweeper (Forest Escape)

> A grid-based logic and probability puzzle game built with Vanilla JavaScript. 

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

## 🎮 Play the Game
**[Play the Live Demo Here](https://rahul2k77-ui.github.io/yokai-sweeper)**

## 💡 About the Project
**Yokai Sweeper** is a strategic web game that challenges players to navigate a hidden grid to find the exit (Torii gate) without stepping on hidden dangers (Yokai and Curses). 

Drawing inspiration from classic games like Minesweeper, the player must use logic and deduction to map out safe paths. Moving to a new tile reveals auditory and visual clues—such as "rustling leaves" or "glowing mist"—indicating the presence of adjacent threats. 

This project demonstrates clean DOM manipulation, object-oriented state management, and grid-based mathematical logic without relying on external libraries.

## ✨ Features
* **Procedural Generation:** Threats and safe paths are randomized on every new journey.
* **Adjacency Logic:** Dynamic clue generation based on calculating the Manhattan distance between the player's coordinate and hidden entities.
* **Flagging System:** Right-click functionality allows players to strategically mark tiles they deduce to be dangerous.
* **Modern Aesthetic:** A sleek, Japanese folklore-inspired UI with custom color variables and a responsive grid.

## 🧠 Technical Highlights
* **Object-Oriented Design (OOP):** The entire game state and logic are encapsulated within a single ES6 `YokaiEscapeGame` class, preventing global namespace pollution.
* **Optimized State Management:** Utilizes JavaScript `Set()` objects to track visited, flagged, and dangerous coordinates, ensuring `O(1)` time complexity for collision and state lookups.
* **Event Delegation:** Clean separation of UI rendering and underlying game logic.

## 🛠️ Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/rahul2k77-ui/yokai-sweeper.git](https://github.com/rahul2k77-ui/yokai-sweeper.git)
