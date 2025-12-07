# PRODIGY_WD_03
Tic-Tac-Toe Web Application — PvP & PvC

A modern and interactive Tic-Tac-Toe game built using HTML, CSS, and JavaScript. It supports both Player vs Player and Player vs Computer modes, features a smart AI opponent, win detection, score tracking, keyboard shortcuts, animations, and a responsive UI.<br>

Features

• Player vs Player mode
• Player vs Computer mode (smart AI)
• Win, loss, and tie detection
• Highlights winning combination
• Scoreboard for X and O
• Restart round button
• Reset full scores
• Fully responsive UI
• Smooth animations and clean visuals
• Keyboard support (keys 1–9 to play, R to restart)<br>

Tech Stack

• HTML5
• CSS3
• JavaScript (ES6)<br>

Project Structure<br>

index.html
script.js
style.css
README.md<br>

How to Run

Download or clone the repository
git clone https://github.com/MehreenKhan465/PRODIGY_WD_03.git<br>

Open the folder

Run the game by opening:
index.html
That’s it — your Tic-Tac-Toe game is ready!<br>

Game Logic Overview

• Maintains a 9-cell board array
• Detects winner using predefined win conditions
• Simple but effective AI (win → block → center → corners → sides)
• Renders board dynamically using DOM updates
• Adds win animations and disables board after victory
• Handles mode switching without page reload
