import './App.css'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'
import { useState, useEffect } from 'react';

const TOTAL_ROWS = 6;
const WORD_LENGTH = 5;

export default function App() {
  const [guesses, setGuesses] = useState(Array(TOTAL_ROWS).fill([])); // Track all guesses (each guess is an array of letters)
  const [tileStatuses, setTileStatuses] = useState(Array(TOTAL_ROWS).fill([])); // Game tile statuses
  const [keyStatuses, setKeyStatuses] = useState([]); // Keyboard key statuses
  const [currentGuess, setCurrentGuess] = useState([]);  // Track current input
  const [guessHistory, setGuessHistory] = useState([]); // Track history of guessed words
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
    // Normalize to uppercase so the Keyboard keys have correct reference
    const normalizedGuess = currentGuess.map(letter => letter.toUpperCase());
    const normalizedSolution = solution.toUpperCase();
    const newTileStatuses = Array(WORD_LENGTH).fill('incorrect');
    const newKeyStatuses = { ...keyStatuses };

    // Create a count of letters in the solution
    const solutionLetterCounts = {};
    for (const letter of normalizedSolution) {
      solutionLetterCounts[letter] = (solutionLetterCounts[letter] || 0) + 1;
    };

    // First pass: Mark "correct" (green) letters
    normalizedGuess.forEach((letter, i) => {
      if (letter === normalizedSolution[i]) {
        newTileStatuses[i] = 'correct';
        solutionLetterCounts[letter]--; // Decrement count for correct letters
        newKeyStatuses[letter] = 'correct';
      }
    });

    // Second pass: Mark "wrongSpot" (yellow) letters if there are unused occurrences
    normalizedGuess.forEach((letter, i) => {
      if (newTileStatuses[i] === 'correct') return; // Skip already marked "correct" letters

      if (solutionLetterCounts[letter] > 0) { // If letter exists in solution and hasn't been fully used
        newTileStatuses[i] = 'wrongSpot';
        solutionLetterCounts[letter]--; // Decrement count for this letter in the solution
        if (newKeyStatuses[letter] !== 'correct') {
          newKeyStatuses[letter] = 'wrongSpot';
        }
      } else if (!newKeyStatuses[letter]) {
        newKeyStatuses[letter] = 'incorrect';
      }
    });

    // Determine the row index to update before starting the staggered updates
    const rowIndex = tileStatuses.findIndex((s) => s.length === 0);

    // Stagger the tile status updates for individual flipping effect
    newTileStatuses.forEach((status, index) => {
      setTimeout(() => {
        setTileStatuses((prevStatuses) => {
          const newStatusesArr = [...prevStatuses];
          newStatusesArr[rowIndex] = [...newStatusesArr[rowIndex]]; // Make a shallow copy of the row
          newStatusesArr[rowIndex][index] = status; // Update the status of the specific tile
          return newStatusesArr;
        });
      }, index * 300); // 300ms delay between each tile flipping
    });

    // Update keyStatuses with updated values
    setKeyStatuses({ ...newKeyStatuses });
  }

  const handleSubmitGuess = () => {
    if (gameOver) return; // Prevent submitting if game is over

    const wholeGuess = currentGuess.join('').toLowerCase(); // Convert guess to whole lowercase word for comparisons

    if (currentGuess.length === WORD_LENGTH && (validGuesses.includes(wholeGuess) || possibleSolutions.includes(wholeGuess))) {
      if (guessHistory && !guessHistory.includes(wholeGuess)) { // If there is a guess history, don't allow a repeated guess
        // Update guesses state with the current guess
        const updatedGuesses = [...guesses];
        updatedGuesses[attempts] = currentGuess;
        setGuesses(updatedGuesses);

        // Update guess history state with current guess
        const updatedGuessHistory = [...guessHistory];
        updatedGuessHistory[attempts] = wholeGuess;
        setGuessHistory(updatedGuessHistory);

        handleStatuses();

        if (wholeGuess === solution) {
          setGameOver(true);
          // alert(`You guessed the correct word in ${attempts + 1} attempts!`);
          return;
        }

        setCurrentGuess([]);
        setAttempts(attempts + 1);  // Move to the next row for the next guess

        if (attempts + 1 === TOTAL_ROWS) {
          setGameOver(true); // Game over when max attempts are reached
          alert(`Game Over! The correct word was ${solution}`);
        }
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    const randomSolution = possibleSolutions[Math.floor(Math.random() * possibleSolutions.length)];
    setSolution(randomSolution);
    setGuesses(Array(TOTAL_ROWS).fill([]));
    setTileStatuses(Array(TOTAL_ROWS).fill([]));
    setKeyStatuses({});
    setCurrentGuess([]);
    setAttempts(0);
    setGameOver(false);
  };

  return (
    <div className="gameContainer">
      <p>{solution}</p>
      <Grid guesses={guesses} currentGuess={currentGuess} attempts={attempts} statuses={tileStatuses} />
      <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} />

      {gameOver && (
        <button onClick={resetGame} className="resetButton">Start New Game</button>
      )}
    </div>
  );
};
