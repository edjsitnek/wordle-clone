import './App.css'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'
import { useState, useEffect } from 'react';

const TOTAL_ROWS = 6;
const WORD_LENGTH = 5;

export default function App() {
  // Track all guesses (each guess is an array of letters)
  const [guesses, setGuesses] = useState(Array(TOTAL_ROWS).fill([]));
  const [statuses, setStatuses] = useState(Array(TOTAL_ROWS).fill([]));
  const [currentGuess, setCurrentGuess] = useState([]);  // Track current input
  const [attempts, setAttempts] = useState(0);  // Track the current attempt number
  const [validGuesses, setValidGuesses] = useState([]); // List of valid guesses (from valid-guesses.txt)
  const [possibleSolutions, setPossibleSolutions] = useState([]); // List of possible solutions (from possible-solutions.txt)
  const [solution, setSolution] = useState(''); // The randomly selected solution


  // Load word lists when the component mounts
  useEffect(() => {
    // Fetch valid guesses
    fetch('/data/valid-guesses.txt')
      .then(response => response.text())
      .then(text => {
        const words = text.split('\n').map(word => word.trim());
        setValidGuesses(words);
      });

    // Fetch possible solutions
    fetch('/data/possible-solutions.txt')
      .then(response => response.text())
      .then(text => {
        const words = text.split('\n').map(word => word.trim());
        setPossibleSolutions(words);

        const randomSolution = words[Math.floor(Math.random() * words.length)];
        setSolution(randomSolution);
      });
  }, []);

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
      if (letter.toLowerCase() === solution[i]) return 'correct';
      if (solution.includes(letter.toLowerCase())) return 'wrongSpot';
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
    const wholeGuess = currentGuess.join('').toLowerCase(); // Convert guess to whole lowercase word for comparisons

    if (currentGuess.length === WORD_LENGTH && (validGuesses.includes(wholeGuess) || possibleSolutions.includes(wholeGuess))) {
      // Update guesses state with the current guess
      const updatedGuesses = [...guesses];
      updatedGuesses[attempts] = currentGuess;
      setGuesses(updatedGuesses);

      handleStatuses();
      setCurrentGuess([]);
      setAttempts(attempts + 1);  // Move to the next row for the next guess

      if (wholeGuess === solution) {
        alert('You guessed the correct word!');
      }
    }
  };
  return (
    <div className="gameContainer">
      <Grid guesses={guesses} currentGuess={currentGuess} attempts={attempts} statuses={statuses} />
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
};
