import { useState, useEffect } from "react";

export default function useKeyboard(wordLength, setCurrentGuess, handleSubmitGuess, currentGuess, gameOver) {
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
  }, [currentGuess, gameOver]); // Include dependencies to ensure correct state is available

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
    if (currentGuess.length < wordLength) {
      setCurrentGuess([...currentGuess, key]);
    }
  }
  const handleBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  }

  return handleKeyPress;
}