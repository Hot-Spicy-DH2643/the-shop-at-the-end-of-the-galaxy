import { useEffect, useState, useRef, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  asteroidId?: string;
  count?: number;
  message?: string;
}

/**
 * Custom hook to manage WebSocket connection for asteroid viewer counts
 * Connects to the backend WebSocket server and tracks real-time viewers
 */
export function useAsteroidViewers(asteroidId: string | null) {
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentAsteroidRef = useRef<string | null>(null);
  const isCleaningUpRef = useRef<boolean>(false);
  const hasReceivedCountRef = useRef<boolean>(false);

  // Get WebSocket URL from environment or default to localhost
  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WS_HOST || 'localhost:3001';
    return `${protocol}//${host}/ws/asteroid-viewers`;
  }, []);

  // Send message to WebSocket server
  const sendMessage = useCallback((data: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  // Connect to WebSocket server
  const connect = useCallback(() => {
    // Don't connect if we're cleaning up
    if (isCleaningUpRef.current) {
      return;
    }

    // Stop multiple connections
    if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      const wsUrl = getWebSocketUrl();
      console.log('Connecting to WebSocket:', wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);

        // If we have an asteroid ID, notify the server we're viewing it
        if (currentAsteroidRef.current) {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: 'view',
                asteroidId: currentAsteroidRef.current,
              })
            );
          }
        }
      };

      ws.onmessage = event => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          if (
            data.type === 'viewer-count' &&
            data.asteroidId === currentAsteroidRef.current
          ) {
            setViewerCount(data.count || 0);
            // Mark that we've received a count, stop loading
            if (!hasReceivedCountRef.current) {
              hasReceivedCountRef.current = true;
              setIsLoading(false);
            }
          } else if (data.type === 'connected') {
            console.log('WebSocket connection acknowledged:', data.message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;

        // Don't reconnect if we're cleaning up
        if (isCleaningUpRef.current) {
          return;
        }

        // Attempt to reconnect after 3 seconds only if not manually closed
        if (reconnectTimeoutRef.current === null) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
          }, 3000);
        }
      };

      ws.onerror = error => {
        // Don't log errors during cleanup
        if (!isCleaningUpRef.current) {
          console.error('WebSocket error:', error);
        }
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }, [getWebSocketUrl]);

  // Initialize WebSocket connection on mount
  useEffect(() => {
    isCleaningUpRef.current = false;
    connect();

    // Cleanup on unmount
    return () => {
      isCleaningUpRef.current = true;

      // Clear any pending reconnection attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Close WebSocket connection
      if (wsRef.current) {
        const ws = wsRef.current;
        const readyState = ws.readyState;

        if (readyState === WebSocket.CONNECTING) {
          wsRef.current = null;
          return;
        }

        // Only send unview message if connection is open
        if (readyState === WebSocket.OPEN && currentAsteroidRef.current) {
          try {
            ws.send(
              JSON.stringify({
                type: 'unview',
                asteroidId: currentAsteroidRef.current,
              })
            );
          } catch (error) {
            // Ignore errors during cleanup
            console.debug('Error sending unview during cleanup:', error);
          }
        }

        // Close the connection if it's not already closed
        if (
          readyState !== WebSocket.CLOSED &&
          readyState !== WebSocket.CLOSING
        ) {
          ws.close();
        }

        wsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount/unmount

  // Handle asteroid ID changes
  useEffect(() => {
    if (!isConnected) return;

    // Unview previous asteroid if exists
    if (
      currentAsteroidRef.current &&
      currentAsteroidRef.current !== asteroidId
    ) {
      sendMessage({
        type: 'unview',
        asteroidId: currentAsteroidRef.current,
      });
      setViewerCount(0);
      setIsLoading(true);
      hasReceivedCountRef.current = false;
    }

    // View new asteroid if provided
    if (asteroidId) {
      currentAsteroidRef.current = asteroidId;
      setIsLoading(true);
      hasReceivedCountRef.current = false;
      sendMessage({
        type: 'view',
        asteroidId: asteroidId,
      });
    } else {
      currentAsteroidRef.current = null;
      setViewerCount(0);
      setIsLoading(false);
    }
  }, [asteroidId, isConnected, sendMessage]);

  return {
    viewerCount,
    isConnected,
    isLoading,
  };
}
