import Tile from "./Tile";

// A row of tiles that constitute an attempt at the answer
export default function Row({ guess }) {
  const emptyTiles = Array(5 - guess.length).fill("")
  const rowTiles = [...guess, ...emptyTiles];

  return (
    <div className="row">
      {rowTiles.map((letter, i) => (
        <Tile key={i} letter={letter} />
      ))}
    </div>
  );
};