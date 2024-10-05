import './App.css'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'
import { useState } from 'react';

const TOTAL_ROWS = 6;
const WORD_LENGTH = 5;

export default function App() {
  // Track all guesses (each guess is an array of letters)
  const [guesses, setGuesses] = useState(Array(TOTAL_ROWS).fill([]));
  const [currentGuess, setCurrentGuess] = useState([]);  // Track current input
  const [attempts, setAttempts] = useState(0);  // Track the current attempt number

  const handleKeyPress = (key) => {
    if (key !== "Enter" && key !== "Backspace") {
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess([...currentGuess, key]);
      }
    }
    else if (key === "Enter") {
      if (currentGuess.length === WORD_LENGTH) {
        handleSubmitGuess();
      };
    }
    else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    }
  }

  const handleSubmitGuess = () => {
    if (currentGuess.length === WORD_LENGTH) {
      // Update guesses state with the current guess
      const updatedGuesses = [...guesses];
      updatedGuesses[attempts] = currentGuess;

      setGuesses(updatedGuesses);
      setCurrentGuess([]);
      setAttempts(attempts + 1);  // Move to the next row for the next guess
    }
  };
  return (
    <div className="gameContainer">
      <Grid guesses={guesses} currentGuess={currentGuess} attempts={attempts} />
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
};
