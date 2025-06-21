import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    public startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: { color: "white" }
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: { color: "black" }
        }));
    }

    makeMove(socket: WebSocket, move: { from: string, to: string }) {
        const currentTurn = this.board.turn();

        const isWhiteTurn = currentTurn === 'w';
        const isValidPlayer =
            (isWhiteTurn && socket === this.player1) ||
            (!isWhiteTurn && socket === this.player2);

        if (!isValidPlayer) {
            console.warn("Invalid turn: move attempted by wrong player.");
            return;
        }

        const result = this.board.move(move);

        if (!result) {
            console.warn("Invalid move attempted:", move);
            return;
        }

   
        const message = JSON.stringify({
            type: MOVE,
            payload: move
        });

        this.player1.send(message);
        this.player2.send(message);

        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";

            const gameOverMessage = JSON.stringify({
                type: GAME_OVER,
                payload: { winner }
            });

            this.player1.send(gameOverMessage);
            this.player2.send(gameOverMessage);
        }
    }
}
