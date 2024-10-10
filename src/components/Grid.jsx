import Row from "./Row";

// A grid of rows making up all of the spots for attempts at the answer
export default function Grid({ guesses, currentGuess, attempts, statuses }) {
  return (
    <div className="grid">
      {guesses.map((guess, i) => {
        // If on the current row (user is still typing), show the current guess
        if (i === attempts) {
          return <Row key={i} guess={currentGuess} statuses={statuses[i]} />;
        }
        // Otherwise, show either a guess or an empty row
        return <Row key={i} guess={guess} statuses={statuses[i]} />;
      })}
    </div>
  )
}