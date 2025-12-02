# Trey Tuscai - MacOS.dev

A fully interactive macOS-inspired portfolio built with React and Vite. Experience my background through a simulated operating system interface.

## Project Overview

This project was created as the final project for SSUI P4 at CMU. It demonstrates advanced UI/UX design, state management, and interactive system architecture.

## Applications

#### Xcode (Portfolio Browser)
- File browser with collapsible folder structure
- Detailed information about education, experience, and projects
- Build simulation with humorous output messages
- Syntax-highlighted code display

#### Maze Game
- **Custom raycasting engine** built from scratch
- First-person 3D perspective from 2D map data
- Win condition: Find the golden exit tile
- WASD/Arrow key controls
- Reset with 'R' key

#### Terminal
- **15+ interactive commands**: `help`, `about`, `skills`, `projects`, `contact`, etc.
- Command history navigation (↑/↓ arrow keys)
- Tab completion
- ASCII art outputs (`neofetch`, `cowsay`, `matrix`)
- App launching: `open xcode`, `open finder`, `open chrome`

#### Finder
- macOS-style file browser
- Application launcher
- Trash functionality

#### Chrome Browser *(Requires server)*
- Remote browser control via WebSocket
- Real-time screenshot display
- Click/keyboard/scroll interaction
- URL navigation

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd my-portfolio
```

2. **Install dependencies**
```bash
   npm install
```

3. **Run development server**
```bash
   npm run dev
```

4. **Open in browser**
```
   Navigate to http://localhost:5173
```

### Optional: Browser App Setup

To use the Chrome browser app:

1. **Install browser server dependencies**
```bash
   npm install express ws playwright
```

2. **Run the browser server** (in a separate terminal)
```bash
   node server.js
```