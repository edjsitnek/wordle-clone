// A single tile for inputting letters for a guess
export default function Tile({ letter }) {
  return (
    <div className={"tile"}>
      {letter}
    </div>
  );
};