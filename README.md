# Systemik Board Project

A React-based application for creating interactive system boards with draggable figures and connecting lines.

## Features

- Create and manage interactive boards
- Add draggable figures with text
- Connect figures with lines
- Save and load boards
- Resize figures
- 2D board interface

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-deps
   ```

### Running the Application

From the root directory, run:

```bash
npm start
```

This will start the development server and open the application in your browser at `http://localhost:3000`.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run install-deps` - Installs all frontend dependencies

## Project Structure

```
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── App.js      # Main application component
│   │   └── ...
│   └── package.json    # Frontend dependencies
├── package.json        # Root package.json with scripts
└── README.md
```

## Usage

1. Click "Figur hinzufügen" to add new figures to the board
2. Drag figures around the board
3. Click on figures to select them for drawing lines
4. Use the resize handle on figures to change their size
5. Save your boards using "Brett speichern"
6. Load previously saved boards with "Brett laden"