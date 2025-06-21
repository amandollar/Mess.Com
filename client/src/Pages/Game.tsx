import { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import "../index.css";

const INIT_GAME = "init_game" as const;
const MOVE = "move" as const;
const GAME_OVER = "game_over" as const;
const OPPONENT_DISCONNECTED = "opponent_disconnected" as const;

type ServerMessage =
  | { type: typeof INIT_GAME; payload: { color: "white" | "black" } }
  | { type: typeof MOVE; payload: { from: string; to: string } }
  | { type: typeof GAME_OVER; payload: { winner: "white" | "black" } }
  | { type: typeof OPPONENT_DISCONNECTED; payload: { message: string } };

export default function Game() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [color, setColor] = useState<"white" | "black">("white");
  const [status, setStatus] = useState("Waiting for opponent...");
  const socketRef = useRef<WebSocket | null>(null);
  const [boardSize, setBoardSize] = useState(420); 

  useEffect(() => {

    const handleResize = () => {
      const newSize = Math.min(
        420,
        window.innerWidth - 40, 
        window.innerHeight - 200 
      );
      setBoardSize(newSize);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const socket = new WebSocket("wss://mess-com.onrender.com");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: INIT_GAME }));
    };

    socket.onmessage = (event) => {
      const msg: ServerMessage = JSON.parse(event.data);

      if (msg.type === INIT_GAME) {
        setColor(msg.payload.color);
        setStatus(`🎮 Game started! You are playing as ${msg.payload.color.toUpperCase()}`);
      }

      if (msg.type === MOVE) {
        game.move(msg.payload);
        setFen(game.fen());
        setGame(new Chess(game.fen()));
      }

      if (msg.type === GAME_OVER) {
        setStatus(`🏁 Game over! Winner: ${msg.payload.winner.toUpperCase()}`);
      }

      if (msg.type === OPPONENT_DISCONNECTED) {
        setStatus("⚠️ Opponent disconnected.");
      }
    };

    socket.onclose = () => setStatus("🔌 Waiting for someone to join.");
    socket.onerror = () => setStatus("❌ Connection error.");

    return () => socket.close();
  }, []);

  const onDrop = (from: string, to: string) => {
    if (game.turn() !== color[0]) return false;
    const move = game.move({ from, to, promotion: "q" });
    if (move) {
      setFen(game.fen());
      setGame(new Chess(game.fen()));
      socketRef.current?.send(JSON.stringify({ type: MOVE, move: { from, to } }));
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col items-center justify-start px-4 py-4 sm:py-6">
      <div className="w-full max-w-3xl flex flex-col items-center space-y-4 sm:space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-400 drop-shadow-lg animate-pulse tracking-wide">
          ♛ Mess
        </h1>
        
        <p className="text-base sm:text-lg text-slate-300 bg-slate-700 px-4 py-2 rounded-full shadow-md text-center w-full sm:w-auto">
          {status}
        </p>

        <div className="rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-slate-700 p-1 sm:p-2 bg-slate-800 transition duration-300 hover:scale-[1.02]">
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardOrientation={color}
            boardWidth={boardSize}
            customDarkSquareStyle={{ backgroundColor: "#1e3a8a" }}
            customLightSquareStyle={{ backgroundColor: "#facc15" }}
          />
        </div>

        <footer className="text-xs sm:text-sm w-full mt-4 sm:mt-6 text-center text-slate-400 flex flex-col items-center gap-1 sm:gap-2">
          <div className="flex gap-1 sm:gap-2 items-center text-xs sm:text-sm">
            <span className="text-lime-400">⚔ Connected as:</span>
            <span className="font-semibold text-white capitalize">{color}</span>
          </div>
          <div className="text-xs opacity-70">
            Made with <span className="text-red-500">♥</span> by Aman •{" "}
            <span className="italic">Multiplayer WebSocket Chess</span>
          </div>
        </footer>
      </div>
    </div>
  );
}