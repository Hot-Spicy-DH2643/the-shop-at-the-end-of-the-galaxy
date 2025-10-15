import { WebSocketServer } from 'ws';

/**
 * Service to manage real-time asteroid viewers via WebSocket
 * Tracks which users are viewing which asteroid modals
 */
class AsteroidViewersService {
  constructor() {
    this.viewersByAsteroid = new Map();
    this.connectionToAsteroid = new WeakMap();
    this.wss = null;
  }

  initialize(server) {
    this.wss = new WebSocketServer({
      server,
      path: '/ws/asteroid-viewers',
    });

    this.wss.on('connection', ws => {
      ws.on('message', message => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.handleDisconnect(ws);
      });

      ws.on('error', error => {
        console.error('WebSocket error:', error);
      });

      this.sendToClient(ws, {
        type: 'connected',
        message: 'Successfully connected to asteroid viewers service',
      });
    });

    // console.log('WebSocket server initialized at /ws/asteroid-viewers');
  }

  handleMessage(ws, data) {
    const { type, asteroidId } = data;

    switch (type) {
      case 'view':
        this.handleViewAsteroid(ws, asteroidId);
        break;

      case 'unview':
        this.handleUnviewAsteroid(ws, asteroidId);
        break;

      case 'ping':
        this.sendToClient(ws, { type: 'pong' });
        break;

      default:
        console.warn('Unknown message type:', type);
    }
  }

  handleViewAsteroid(ws, asteroidId) {
    if (!asteroidId) {
      console.warn('No asteroidId provided for view message');
      return;
    }

    this.handleDisconnect(ws);

    if (!this.viewersByAsteroid.has(asteroidId)) {
      this.viewersByAsteroid.set(asteroidId, new Set());
    }

    this.viewersByAsteroid.get(asteroidId).add(ws);
    this.connectionToAsteroid.set(ws, asteroidId);

    this.broadcastViewerCount(asteroidId);
  }

  handleUnviewAsteroid(ws, asteroidId) {
    if (!asteroidId || !this.viewersByAsteroid.has(asteroidId)) {
      return;
    }

    const viewers = this.viewersByAsteroid.get(asteroidId);
    viewers.delete(ws);

    if (viewers.size === 0) {
      this.viewersByAsteroid.delete(asteroidId);
    } else {
      this.broadcastViewerCount(asteroidId);
    }

    this.connectionToAsteroid.delete(ws);
  }

  handleDisconnect(ws) {
    const asteroidId = this.connectionToAsteroid.get(ws);

    if (asteroidId) {
      this.handleUnviewAsteroid(ws, asteroidId);
    }
  }

  broadcastViewerCount(asteroidId) {
    const viewers = this.viewersByAsteroid.get(asteroidId);

    if (!viewers || viewers.size === 0) {
      return;
    }

    const count = viewers.size;
    const message = {
      type: 'viewer-count',
      asteroidId,
      count,
    };

    viewers.forEach(client => {
      this.sendToClient(client, message);
    });
  }

  sendToClient(ws, data) {
    if (ws.readyState === 1) {
      // WebSocket.OPEN = 1
      ws.send(JSON.stringify(data));
    }
  }

  getViewerCount(asteroidId) {
    return this.viewersByAsteroid.get(asteroidId)?.size || 0;
  }

  getAllViewedAsteroids() {
    const result = [];

    this.viewersByAsteroid.forEach((viewers, asteroidId) => {
      result.push({
        asteroidId,
        count: viewers.size,
      });
    });

    return result;
  }
}

// Export singleton instance
export const asteroidViewersService = new AsteroidViewersService();
