import './App.css'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'
import Modal from './components/Modal'
import useKeyboard from './hooks/useKeyboard'
import useGameLogic from './hooks/useGameLogic'
import { useState, useEffect } from 'react';

const TOTAL_ROWS = 6;
const WORD_LENGTH = 5;
const defaultStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  winPercentage: 0,
  totalAttempts: 0,
  averageAttempts: 0
}

const initializeStats = () => {
  const savedStats = localStorage.getItem('stats');
  return savedStats ? JSON.parse(savedStats) : defaultStats;
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false); // Track if modal is open
  const [stats, setStats] = useState(initializeStats); // Track statistics of previous games played
  const [statsClicked, setStatsClicked] = useState(false); // Track if the stats screen is displayed
  const [answerText, setAnswerText] = useState("Click to view solution"); // Message that can show the game solution for testing purposes

  const {
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
    resetGame
  } = useGameLogic(WORD_LENGTH, TOTAL_ROWS, setModalOpen, setStats, setAnswerText)

  const handleKeyPress = useKeyboard(WORD_LENGTH, setCurrentGuess, handleSubmitGuess, currentGuess, gameOver);

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats])

  // Reset stats when "Reset Stats" button is clicked
  const resetStats = () => {
    localStorage.clear();
    setStats(defaultStats);
  }

  // Show stats when "View Stats" button is clicked
  const showStats = () => {
    setModalOpen(true);
    setStatsClicked(true);
  }

  // Toggle answer text for testing purposes
  const handleAnswerText = () => {
    if (answerText === "Click to view solution") {
      setAnswerText(solution)
    }
    else {
      setAnswerText("Click to view solution")
    }
  }

  return (
    <div className="gameContainer">
      <div className="gameHeader">
        <p onClick={handleAnswerText}>{answerText}</p>
        <button onClick={showStats}>View Stats</button>
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} attempts={attempts} statuses={tileStatuses} />
      <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} />

      {/* Display modal when "Show Stats" button is clicked */}
      {statsClicked &&
        <Modal
          isWin={isWin}
          numGuesses={attempts + 1}
          solution={solution}
          onClickX={setModalOpen}
          onClickReset={resetGame}
          onClickResetStats={resetStats}
          stats={stats}
          statsClicked={statsClicked}
          setStatsClicked={setStatsClicked}
        />
      }
      {/* Display modal when the game is over */}
      {gameOver && (
        modalOpen ? (
          <Modal
            isWin={isWin}
            numGuesses={attempts + 1}
            solution={solution}
            onClickX={setModalOpen}
            onClickReset={resetGame}
            onClickResetStats={resetStats}
            stats={stats}
            statsClicked={statsClicked}
            setStatsClicked={setStatsClicked}
          />
        ) : (
          <button onClick={resetGame} className="resetButton">Start New Game</button>
        )
      )}
    </div>
  );
};
