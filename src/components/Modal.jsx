// A modal that pops up when a game over is reached
export default function Modal({ isWin, numGuesses, solution, onClickX, onClickReset, onClickResetStats, stats, statsClicked, setStatsClicked }) {
  const fillStats = () => {
    return (
      <div className="stats">
        <ul>
          <li>
            <div className="statNum">{stats.gamesPlayed}</div>
            <div className="statName">Played</div>
          </li>
          <li>
            <div className="statNum">{stats.winPercentage}</div>
            <div className="statName">Win%</div>
          </li>
          <li>
            <div className="statNum">{stats.averageAttempts}</div>
            <div className="statName">Average Attempts</div>
          </li>
        </ul>
      </div>
    )
  }

  const handleModalContent = () => {
    if (isWin === true && statsClicked === false) { // Content if the game was won
      return (
        <>
          <div className="title">
            <h1>You won!</h1>
          </div>
          <div className="body">
            {(numGuesses === 1) ? (
              <p>You guessed the correct word in 1 attempt!</p>
            ) : (
              <p>You guessed the correct word in {numGuesses} attempts!</p>
            )}
          </div>
          {fillStats()}
          <div className="footer">
            <button onClick={onClickResetStats} className="statsResetButton">Reset Stats</button>
            <button onClick={onClickReset} className="resetButton">Start New Game</button>
          </div>
        </>
      )
    }
    if (isWin === false && statsClicked === true) { // Content if "Show Stats" was clicked
      return (
        <>
          <div className="title">
            <h1>Game Stats</h1>
          </div>
          {fillStats()}
          <div className="footer">
            <button onClick={onClickResetStats} className="statsResetButton">Reset Stats</button>
          </div>
        </>
      )
    }
    if (isWin === false && statsClicked === false) { // Content if the game was lost
      return (
        <>
          <div className="title">
            <h1>Game Over!</h1>
          </div>
          <div className="body">
            <p>The correct word was {solution}</p>
          </div>
          {fillStats()}
          <div className="footer">
            <button onClick={onClickResetStats} className="statsResetButton">Reset Stats</button>
            <button onClick={onClickReset} className="resetButton">Start New Game</button>
          </div>
        </>
      )
    }
  }

  const exitModal = () => {
    onClickX(false);
    setStatsClicked(false);
  }

  return (
    // Clicking on the background will close modal
    <div className="modalBackground" onClick={exitModal}>
      <div className="modalContainer" onClick={e => e.stopPropagation()}>
        <div className="closeButton">
          <button onClick={exitModal}>X</button>
        </div>
        {handleModalContent()}
      </div>
    </div>
  );
};