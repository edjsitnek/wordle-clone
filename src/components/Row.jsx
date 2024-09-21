import Tile from "./Tile";

// A row of tiles that constitute an attempt at the answer
export default function Row() {
  return (
    <div className="row">
      <Tile />
      <Tile />
      <Tile />
      <Tile />
      <Tile />
    </div>
  )
}