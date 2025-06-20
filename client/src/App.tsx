import { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const INIT_GAME = "init_game" as const;
const MOVE = "move" as const;
const GAME_OVER = "game_over" as const;
const OPPONENT_DISCONNECTED = "opponent_disconnected" as const;

type ServerMessage =
  | { type: typeof INIT_GAME; payload: { color: "white" | "black" } }
  | { type: typeof MOVE; payload: { from: string; to: string } }
  | { type: typeof GAME_OVER; payload: { winner: "white" | "black" } }
  | { type: typeof OPPONENT_DISCONNECTED; payload: { message: string } };

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [color, setColor] = useState<"white" | "black">("white");
  const [status, setStatus] = useState("Waiting for opponent...");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("https://mess-com.onrender.com/");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: INIT_GAME }));
    };

    socket.onmessage = (event) => {
      const msg: ServerMessage = JSON.parse(event.data);

      if (msg.type === INIT_GAME) {
        setColor(msg.payload.color);
        setStatus("Game started. You are " + msg.payload.color);
      }

      if (msg.type === MOVE) {
        game.move(msg.payload);
        setFen(game.fen());
        setGame(new Chess(game.fen()));
      }

      if (msg.type === GAME_OVER) {
        setStatus("Game over. Winner: " + msg.payload.winner);
      }

      if (msg.type === OPPONENT_DISCONNECTED) {
        setStatus("Opponent disconnected.");
      }
    };

    socket.onclose = () => {
      setStatus("Connection closed.");
    };

    socket.onerror = () => {
      setStatus("Connection error.");
    };

    return () => {
      socket.close();
    };
  }, []);

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (game.turn() !== color[0]) return false;

    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    if (move) {
      setFen(game.fen());
      setGame(new Chess(game.fen()));
      socketRef.current?.send(JSON.stringify({ type: MOVE, move: { from: sourceSquare, to: targetSquare } }));
      return true;
    }
    return false;
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Mess.COM</h1>
      <p className="mb-4 text-lg">{status}</p>
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={color}
        boardWidth={400}
        customBoardStyle={{ borderRadius: "0.5rem", boxShadow: "0 0 15px rgba(0,0,0,0.5)" }}
        customDarkSquareStyle={{ backgroundColor: "#779556" }}
        customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
      />
    </div>
  );
}
