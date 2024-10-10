// A single tile for inputting letters for a guess
export default function Tile({ letter, status }) {
  return (
    <div className={`tile ${status}`}>
      {letter}
    </div>
  );
};