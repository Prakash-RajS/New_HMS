// src/components/WebSocketContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Use refs to track connection state without re-renders
  const connectionAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);
  const reconnectTimeoutRef = useRef(null);

  const connectWebSocket = useCallback(() => {
    // Prevent multiple connection attempts
    if (isConnectingRef.current || socket?.readyState === WebSocket.OPEN) {
      console.log(
        "🔄 Connection already in progress or established, skipping..."
      );
      return;
    }

    // Close existing connection if any
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      console.log("🔌 Closing existing WebSocket connection");
      socket.close(1000, "Reconnecting");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("🔐 No token found, skipping WebSocket connection");
      return;
    }

    // ✅ Connect to FastAPI backend on port 8000
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const wsUrl = backendUrl.replace(/^http/, "ws") + "/ws";

    connectionAttemptsRef.current += 1;
    setConnectionAttempts(connectionAttemptsRef.current);

    console.log(
      `🔌 Attempt #${connectionAttemptsRef.current}: Connecting to WebSocket:`,
      wsUrl
    );

    isConnectingRef.current = true;

    try {
      const newSocket = new WebSocket(wsUrl);

      newSocket.onopen = () => {
        console.log("✅ WebSocket connected successfully to backend");
        setIsConnected(true);
        setSocket(newSocket);
        isConnectingRef.current = false;
        connectionAttemptsRef.current = 0;
        setConnectionAttempts(0);

        // Clear any pending reconnect timeouts
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }

        // Send authentication info
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        const authMessage = {
          type: "client_info",
          user_id: user?.id,
          username: user?.username,
          role: user?.role,
          timestamp: new Date().toISOString(),
        };

        newSocket.send(JSON.stringify(authMessage));
        console.log("📤 Sent auth message:", authMessage);
      };

      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 WebSocket message received:", data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error(
            "❌ Error parsing WebSocket message:",
            error,
            "Raw:",
            event.data
          );
        }
      };

      newSocket.onclose = (event) => {
        console.log(
          "🔌 WebSocket disconnected. Code:",
          event.code,
          "Reason:",
          event.reason,
          "Clean:",
          event.wasClean
        );
        setIsConnected(false);
        setSocket(null);
        isConnectingRef.current = false;

        // Clear existing socket reference
        setSocket(null);

        // Attempt reconnect after 3 seconds if it wasn't a normal closure
        if (event.code !== 1000 && connectionAttemptsRef.current < 5) {
          console.log("🔄 Will attempt reconnect in 3 seconds...");
          reconnectTimeoutRef.current = setTimeout(() => {
            const token = localStorage.getItem("token");
            if (token) {
              connectWebSocket();
            }
          }, 3000);
        }
      };

      newSocket.onerror = (error) => {
        console.error("❌ WebSocket connection error:", error);
        setIsConnected(false);
        isConnectingRef.current = false;
      };

      setSocket(newSocket);
    } catch (error) {
      console.error("❌ Failed to create WebSocket:", error);
      isConnectingRef.current = false;
    }
  }, [socket]);

  // FIXED: Simplified message handler to prevent duplicate processing
  const handleWebSocketMessage = useCallback(
    (data) => {
      console.log("📨 WebSocket message received:", data);

      // Handle connection confirmation
      if (data.type === "connection_established") {
        console.log("✅ WebSocket connection confirmed:", data.message);
        return;
      }

      // Handle notification messages - ONLY process specific notification types
      if (data.type && data.message && !data.type.includes("connection")) {
        // Check if this is a duplicate message (based on timestamp and type)
        const isDuplicate = notifications.some(
          (notif) =>
            notif.data?.timestamp === data.timestamp && notif.type === data.type
        );

        if (!isDuplicate) {
          handleNewNotification({
            message: data.message,
            type: data.notification_type || "info",
            timestamp: data.timestamp || new Date().toISOString(),
            data: data.data || {},
          });
        } else {
          console.log("🔄 Duplicate notification skipped:", data.type);
        }
      }
    },
    [notifications]
  );

  // FIXED: Use useCallback to prevent recreation
  const handleNewNotification = useCallback((data) => {
    const newNotification = {
      id: `${data.timestamp}-${Math.random().toString(36).substr(2, 9)}`,
      message: data.message,
      type: data.type || "info",
      timestamp: data.timestamp,
      read: false,
      data: data.data || {},
    };

    setNotifications((prev) => {
      // Check for duplicates before adding
      const isDuplicate = prev.some(
        (notif) =>
          notif.id === newNotification.id ||
          (notif.data?.timestamp === newNotification.data?.timestamp &&
            notif.message === newNotification.message)
      );

      if (isDuplicate) {
        console.log("🔄 Duplicate notification prevented");
        return prev;
      }

      return [newNotification, ...prev.slice(0, 49)]; // Keep last 50
    });

    setUnreadCount((prev) => prev + 1);

    // Show browser notification if permitted
    showBrowserNotification(newNotification);
  }, []);

  // FIXED: Remove individual handlers to prevent multiple processing paths
  const showBrowserNotification = useCallback((notification) => {
    if (
      "Notification" in window &&
      Notification.permission === "granted" &&
      document.hidden
    ) {
      try {
        new Notification("HMS Notification", {
          body: notification.message,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          tag: notification.id, // Use unique ID to prevent duplicate browser notifications
          requireInteraction:
            notification.type === "warning" || notification.type === "error",
        });
      } catch (error) {
        console.log("Browser notification failed:", error);
      }
    }
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const sendMessage = useCallback(
    (type, data) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type, ...data }));
        return true;
      } else {
        console.warn("WebSocket not connected, cannot send message");
        return false;
      }
    },
    [socket]
  );

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  // FIXED: Improved connection management
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !socket && !isConnectingRef.current) {
      console.log("🔌 Initializing WebSocket connection...");
      connectWebSocket();
    }

    return () => {
      // Cleanup on unmount
      if (socket) {
        console.log("🧹 Cleaning up WebSocket connection");
        socket.close(1000, "Component unmounting");
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [socket, connectWebSocket]);

  // FIXED: Improved storage event listener
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (e.newValue) {
          // Token was added (login) - wait a bit then connect
          setTimeout(() => {
            if (!socket || socket.readyState !== WebSocket.OPEN) {
              connectWebSocket();
            }
          }, 1000);
        } else {
          // Token was removed (logout)
          if (socket) {
            socket.close(1000, "User logged out");
          }
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [socket, connectWebSocket]);

  // FIXED: Debug effect to log connection state
  useEffect(() => {
    console.log("🔌 WebSocket State:", {
      isConnected,
      socketState: socket?.readyState,
      connectionAttempts: connectionAttemptsRef.current,
      isConnecting: isConnectingRef.current,
      activeNotifications: notifications.length,
    });
  }, [isConnected, socket, notifications.length]);

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    sendMessage,
    reconnect: connectWebSocket,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
