/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import http from 'http';
import os from 'os';
import path from 'path';
import express from 'express';
import { Server as SocketServer } from 'socket.io';
import { createExpressApp } from './server/index';
import { initDatabase } from './server/database';

async function startServer() {
  // 1. Initialize SQLite database
  initDatabase();

  const app = express();
  const httpServer = http.createServer(app);

  // 2. Attach Socket.IO to HTTP server
  const io = new SocketServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    // Automatically join the shared fest room
    socket.join('mavericks-fest-2026');
    console.log(`[Socket.IO] Connected: ${socket.id} (joined room: mavericks-fest-2026)`);

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Disconnected: ${socket.id}`);
    });
  });

  // 3. Configure Express App with REST endpoints and static routes
  createExpressApp(io, app);

  const isProduction = process.env.NODE_ENV === 'production';
  const PORT = 3000;
  const HOST = '0.0.0.0';

  if (!isProduction) {
    // In dev mode, mount Vite middleware to serve client SPA on port 3000
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built dist files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 4. Bind to 0.0.0.0 and PORT so phones can connect over Wi-Fi
  httpServer.listen(PORT, HOST, () => {
    console.log(`====================================================`);
    console.log(` CampusHub + FindIt Central Application Server Ready `);
    console.log(` Port: ${PORT} | Bound: ${HOST}`);
    console.log(` Local (Laptop): http://localhost:${PORT}`);

    // Print all local network IPv4 addresses for smartphones on Wi-Fi
    const interfaces = os.networkInterfaces();
    console.log(`\n Smartphone Access (Connect to same Wi-Fi):`);
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          console.log(`  -> http://${iface.address}:${PORT}`);
        }
      }
    }
    console.log(`====================================================`);
  });
}

startServer();
