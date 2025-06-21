import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
    private games: Game[] = [];
    private pendingUser: WebSocket | null = null;
    private users: WebSocket[] = [];

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
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
                } catch (err) {
                    console.error("Failed to notify opponent of disconnection:", err);
                }
                return false;
            }
            return true;
        });
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data: string | Buffer) => {
            try {
                const parsed = JSON.parse(data.toString());

                switch (parsed.type) {
                    case INIT_GAME:
                        this.handleInitGame(socket);
                        break;
                    case MOVE:
                        this.handleMove(socket, parsed.move);
                        break;
                    default:
                        console.warn("Unknown message type:", parsed.type);
                }
            } catch (err) {
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

    private handleInitGame(socket: WebSocket) {
        if (this.pendingUser) {
            const game = new Game(this.pendingUser, socket);
            this.games.push(game);
            this.pendingUser = null;
        } else {
            this.pendingUser = socket;
        }
    }

    private handleMove(socket: WebSocket, move: { from: string, to: string }) {
        const game = this.games.find(g =>
            g.player1 === socket || g.player2 === socket
        );

        if (game) {
            game.makeMove(socket, move);
        } else {
            console.warn("Move received but no active game found for socket.");
        }
    }
}
