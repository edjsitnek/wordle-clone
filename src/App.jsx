import './App.css'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'
import { useState } from 'react';

const TOTAL_ROWS = 6;
const WORD_LENGTH = 5;
const correctAnswer = "LOTUS";

export default function App() {
  // Track all guesses (each guess is an array of letters)
  const [guesses, setGuesses] = useState(Array(TOTAL_ROWS).fill([]));
  const [statuses, setStatuses] = useState(Array(TOTAL_ROWS).fill([]));
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

  const handleStatuses = () => {
    const newStatuses = currentGuess.map((letter, i) => {
      if (letter === correctAnswer[i]) return 'correct';
      if (correctAnswer.includes(letter)) return 'wrongSpot';
      return 'incorrect';
    })

    // Fill the next empty spot (current guess) with updated status colors
    setStatuses((prevStatuses) => {
      const newStatusesArr = [...prevStatuses];
      newStatusesArr[prevStatuses.findIndex((s) => s.length === 0)] = newStatuses;
      return newStatusesArr;
    });
  }

  const handleSubmitGuess = () => {
    if (currentGuess.length === WORD_LENGTH) {

      // Update guesses state with the current guess
      const updatedGuesses = [...guesses];
      updatedGuesses[attempts] = currentGuess;
      setGuesses(updatedGuesses);

      handleStatuses();
      setCurrentGuess([]);
      setAttempts(attempts + 1);  // Move to the next row for the next guess
    }
  };
  return (
    <div className="gameContainer">
      <Grid guesses={guesses} currentGuess={currentGuess} attempts={attempts} statuses={statuses} />
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
};
