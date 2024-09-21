import Row from "./Row";

// A grid of rows making up all of the spots for attempts at the answer
export default function Grid() {
  return (
    <div className="grid">
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
    </div>
  )
}