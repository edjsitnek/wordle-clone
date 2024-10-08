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
  const [gameOver, setGameOver] = useState(false); // Track whether game is over


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

  // Handle physical keyboard input using keydown event
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver) return; // Prevent input if game is over
      const key = event.key.toUpperCase();

      if (key === "ENTER") {
        handleSubmitGuess();
      } else if (key === "BACKSPACE") {
        handleBackspace();
      } else if (/^[A-Z]$/.test(key)) {
        handleLetterInput(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Clean up event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentGuess, guesses, solution, gameOver]); // Include dependencies to ensure correct state is available

  // Handle clicking on the onscreen keyboard
  const handleKeyPress = (key) => {
    if (gameOver) return; // Prevent input if game is over

    if (key !== "Enter" && key !== "Backspace") {
      handleLetterInput(key)
    }
    else if (key === "Enter") {
      handleSubmitGuess();
    }
    else if (key === "Backspace") {
      handleBackspace();
    }
  }
  const handleLetterInput = (key) => {
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess([...currentGuess, key]);
    }
  }
  const handleBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  }

  // Handle updating tile statuses/colors
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
    if (gameOver) return; // Prevent submitting if game is over

    const wholeGuess = currentGuess.join('').toLowerCase(); // Convert guess to whole lowercase word for comparisons

    if (currentGuess.length === WORD_LENGTH && (validGuesses.includes(wholeGuess) || possibleSolutions.includes(wholeGuess))) {
      // Update guesses state with the current guess
      const updatedGuesses = [...guesses];
      updatedGuesses[attempts] = currentGuess;
      setGuesses(updatedGuesses);

      handleStatuses();

      if (wholeGuess === solution) {
        setGameOver(true);
        alert(`You guessed the correct word in ${attempts + 1} attempts!`);
        return;
      }

      setCurrentGuess([]);
      setAttempts(attempts + 1);  // Move to the next row for the next guess

      if (attempts + 1 === TOTAL_ROWS) {
        setGameOver(true); // Game over when max attempts are reached
        alert(`Game Over! The correct word was ${solution}`);
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    const randomSolution = possibleSolutions[Math.floor(Math.random() * possibleSolutions.length)];
    setSolution(randomSolution);
    setGuesses(Array(TOTAL_ROWS).fill([]));
    setStatuses(Array(TOTAL_ROWS).fill([]));
    setCurrentGuess([]);
    setAttempts(0);
    setGameOver(false);
  };

  return (
    <div className="gameContainer">
      <Grid guesses={guesses} currentGuess={currentGuess} attempts={attempts} statuses={statuses} />
      <Keyboard onKeyPress={handleKeyPress} />

      {gameOver && (
        <button onClick={resetGame} className="resetButton">Start New Game</button>
      )}
    </div>
  );
};
