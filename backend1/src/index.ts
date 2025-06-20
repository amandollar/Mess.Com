import { WebSocketServer, WebSocket } from 'ws';
import { GameManager } from './GameManager';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });
const gameManager = new GameManager();

console.log(`WebSocket server started on ws://localhost:${PORT}`);

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');
    gameManager.addUser(ws);

    ws.on('close', () => {
        console.log('Client disconnected');
        gameManager.removeUser(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        gameManager.removeUser(ws);
    });
});

