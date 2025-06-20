"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        if (this.pendingUser === socket) {
            this.pendingUser = null;
        }
        this.games = this.games.filter(game => {
            if (game.player1 === socket || game.player2 === socket) {
                const opponent = game.player1 === socket ? game.player2 : game.player1;
                try {
                    opponent.send(JSON.stringify({
                        type: "OPPONENT_DISCONNECTED",
                        payload: {
                            message: "Your opponent has disconnected"
                        }
                    }));
                }
                catch (err) {
                    console.error("Failed to notify opponent of disconnection:", err);
                }
                return false; // Remove game
            }
            return true;
        });
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            try {
                const parsed = JSON.parse(data.toString());
                switch (parsed.type) {
                    case messages_1.INIT_GAME:
                        this.handleInitGame(socket);
                        break;
                    case messages_1.MOVE:
                        this.handleMove(socket, parsed.move);
                        break;
                    default:
                        console.warn("Unknown message type:", parsed.type);
                }
            }
            catch (err) {
                console.error("Invalid message received:", err);
            }
        });
        socket.on("close", () => {
            this.removeUser(socket);
        });
        socket.on("error", (err) => {
            console.error("WebSocket error:", err);
            this.removeUser(socket);
        });
    }
    handleInitGame(socket) {
        if (this.pendingUser) {
            const game = new Game_1.Game(this.pendingUser, socket);
            this.games.push(game);
            this.pendingUser = null;
        }
        else {
            this.pendingUser = socket;
        }
    }
    handleMove(socket, move) {
        const game = this.games.find(g => g.player1 === socket || g.player2 === socket);
        if (game) {
            game.makeMove(socket, move);
        }
        else {
            console.warn("Move received but no active game found for socket.");
        }
    }
}
exports.GameManager = GameManager;
