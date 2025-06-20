"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: { color: "white" }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: { color: "black" }
        }));
    }
    makeMove(socket, move) {
        const currentTurn = this.board.turn(); // 'w' or 'b'
        const isWhiteTurn = currentTurn === 'w';
        const isValidPlayer = (isWhiteTurn && socket === this.player1) ||
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
        // Broadcast the valid move to both players
        const message = JSON.stringify({
            type: messages_1.MOVE,
            payload: move
        });
        this.player1.send(message);
        this.player2.send(message);
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            const gameOverMessage = JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: { winner }
            });
            this.player1.send(gameOverMessage);
            this.player2.send(gameOverMessage);
        }
    }
}
exports.Game = Game;
