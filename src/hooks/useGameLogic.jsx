import { useState, useEffect } from "react";

export default function useGameLogic(wordLength, totalRows, setModalOpen, setStats, setAnswerText) {
  const [guesses, setGuesses] = useState(Array(totalRows).fill([])); // Track all guesses (each guess is an array of letters)
  const [tileStatuses, setTileStatuses] = useState(Array(totalRows).fill([])); // Game tile statuses
  const [keyStatuses, setKeyStatuses] = useState([]); // Keyboard key statuses
  const [currentGuess, setCurrentGuess] = useState([]);  // Track current input
  const [guessHistory, setGuessHistory] = useState([]); // Track history of guessed words
  const [attempts, setAttempts] = useState(0);  // Track the current attempt number
  const [validGuesses, setValidGuesses] = useState([]); // List of valid guesses (from valid-guesses.txt)
  const [possibleSolutions, setPossibleSolutions] = useState([]); // List of possible solutions (from possible-solutions.txt)
  const [solution, setSolution] = useState(''); // The randomly selected solution
  const [gameOver, setGameOver] = useState(false); // Track whether game is over
  const [isWin, setIsWin] = useState(false); // Track if the game over is a win or not

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

  // Handle updating tile statuses/colors
  const handleStatuses = () => {
    // Normalize to uppercase so the Keyboard keys have correct reference
    const normalizedGuess = currentGuess.map(letter => letter.toUpperCase());
    const normalizedSolution = solution.toUpperCase();
    const newTileStatuses = Array(wordLength).fill('incorrect');
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

  const handleStatistics = (won, attempts) => {
    setStats((prevStats) => {
      const updatedStats = { ...prevStats };

      // Increment games played
      updatedStats.gamesPlayed += 1;

      if (won) {
        // Increment games won
        updatedStats.gamesWon += 1;

        // Add attempts to total attempts
        updatedStats.totalAttempts += attempts;

        // Calculate average attempts
        updatedStats.averageAttempts = (
          updatedStats.totalAttempts / updatedStats.gamesWon
        ).toFixed(2); // Round to 2 decimal places
      }

      // Update win percentage
      updatedStats.winPercentage = Math.round(
        (updatedStats.gamesWon / updatedStats.gamesPlayed) * 100
      );

      return updatedStats;
    })
  }

  // Reset the game
  const resetGame = () => {
    const randomSolution = possibleSolutions[Math.floor(Math.random() * possibleSolutions.length)];
    setSolution(randomSolution);
    setGuesses(Array(totalRows).fill([]));
    setTileStatuses(Array(totalRows).fill([]));
    setKeyStatuses({});
    setCurrentGuess([]);
    setAttempts(0);
    setGameOver(false);
    setAnswerText("Click to view solution")
  };

  function handleSubmitGuess() {
    if (gameOver) return; // Prevent submitting if game is over

    const wholeGuess = currentGuess.join('').toLowerCase(); // Convert guess to whole lowercase word for comparisons

    if (currentGuess.length === wordLength && (validGuesses.includes(wholeGuess) || possibleSolutions.includes(wholeGuess))) {
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

        if (wholeGuess === solution) { // Game over when the solution is guessed
          setTimeout(() => {
            setGameOver(true);
            setIsWin(true);
            setModalOpen(true);
            handleStatistics(true, attempts + 1);
          }, 2000);
          return;
        }

        setCurrentGuess([]);
        setAttempts(attempts + 1);  // Move to the next row for the next guess

        if (attempts + 1 === totalRows) { // Game over when max attempts are reached
          setTimeout(() => {
            setGameOver(true);
            setIsWin(false);
            setModalOpen(true);
            handleStatistics(false, attempts + 1);
          }, 2000);
        }
      }
    }
  };

  return {
    attempts,
    guesses,
    currentGuess,
    setCurrentGuess,
    solution,
    tileStatuses,
    keyStatuses,
    gameOver,
    isWin,
    handleSubmitGuess,
    resetGame,
  }
}