import http from 'http';
import app from './app';
import { setupSocket } from './socket';

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

// Initialize Socket.io
setupSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSockets enabled`);
});
