"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const PORT = 8080;
const wss = new ws_1.WebSocketServer({ port: PORT });
const gameManager = new GameManager_1.GameManager();
console.log(`WebSocket server started on ws://localhost:${PORT}`);
wss.on('connection', (ws) => {
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
