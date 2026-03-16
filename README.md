# Color Guess Game

A fun browserbased game where you memorize a color and try to recreate it using a color picker. Built with React + Vite.

## How to Play

1. A random color fills your screen memorize it (you have 5 seconds!)
2. The color disappears now recreate it using the HSL color picker
3. Submit your guess and see how close you were
4. Your score is based on how accurately you matched the color

## Features

- Full screen color memorization with a live countdown timer
- Interactive HSL color picker using `react-colorful`
- Score calculated using RGB color distance
- [react-colorful](https://github.com/omgovich/react-colorful) — lightweight color picker

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/Are-You-ColourBlind-.git
cd Are-You-ColourBlind-

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## Project Structure

```
color-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx            # Root component
│   ├── ColorGuess.jsx     # Main game logic & UI
│   ├── ColorGuess.css     # Game styles
│   └── main.jsx           # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
