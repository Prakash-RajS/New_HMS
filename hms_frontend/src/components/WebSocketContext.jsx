


// //src/components/WebSocketContext.jsx
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   useRef,
// } from "react";
// import api from "../utils/axiosConfig";

// /* =====================================================
//    CONTEXT
// ===================================================== */
// const WebSocketContext = createContext(null);

// export const useWebSocket = () => {
//   const ctx = useContext(WebSocketContext);
//   if (!ctx) {
//     throw new Error("useWebSocket must be used within WebSocketProvider");
//   }
//   return ctx;
// };

// /* =====================================================
//    SAFE UUID (crypto.randomUUID fallback)
// ===================================================== */
// const generateUUID = () => {
//   if (window.crypto && crypto.randomUUID) {
//     return crypto.randomUUID();
//   }
//   // fallback (RFC4122-ish)
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
//     const r = (Math.random() * 16) | 0;
//     const v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// };

// /* =====================================================
//    PROVIDER
// ===================================================== */
// export const WebSocketProvider = ({ children }) => {
//   const socketRef = useRef(null);
//   const isConnectingRef = useRef(false);
//   const reconnectTimerRef = useRef(null);
//   const heartbeatRef = useRef(null);
//   const lastMessageRef = useRef(null);

//   const [isConnected, setIsConnected] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const unreadCount = notifications.filter(n => !n.read).length;

//   const HEARTBEAT_INTERVAL = 30000;
//   const PATH_POLL_INTERVAL = 100;

//   /* =====================================================
//      AUTH CHECK
//   ===================================================== */
//   const isAuthenticated = async () => {
//     try {
//       await api.get("/profile/me");
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   /* =====================================================
//      BUILD WS URL
//   ===================================================== */
//   const getWebSocketUrl = () => {
//     const API_BASE = import.meta.env.VITE_API_BASE_URL;
//     if (!API_BASE) throw new Error("VITE_API_BASE_URL missing");

//     const url = new URL(API_BASE);
//     const scheme = url.protocol === "https:" ? "wss" : "ws";

//     return `${scheme}://${url.host}/ws`;
//   };

//   /* =====================================================
//      HEARTBEAT
//   ===================================================== */
//   const stopHeartbeat = () => {
//     if (heartbeatRef.current) {
//       clearInterval(heartbeatRef.current);
//       heartbeatRef.current = null;
//     }
//   };

//   const startHeartbeat = useCallback((ws) => {
//     stopHeartbeat();
//     heartbeatRef.current = setInterval(() => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({ type: "heartbeat" }));
//       }
//     }, HEARTBEAT_INTERVAL);
//   }, []);

//   /* =====================================================
//      MESSAGE HANDLER (FIXED UUID)
//   ===================================================== */
//   const handleMessage = useCallback((event) => {
//     if (event.data === lastMessageRef.current) return;
//     lastMessageRef.current = event.data;

//     try {
//       const data = JSON.parse(event.data);

//       if (data.type === "connection_established") return;

//       if (data.message) {
//         const notification = {
//           id: generateUUID(),
//           message: data.message,
//           type: data.notification_type || "info",
//           timestamp: data.timestamp || new Date().toISOString(),
//           read: false,
//           data: data.data || {},
//         };

//         setNotifications((prev) => [notification, ...prev].slice(0, 50));
//       }
//     } catch (err) {
//       console.error("WebSocket message error:", err);
//     }
//   }, []);

//   /* =====================================================
//      DISCONNECT
//   ===================================================== */
//   const disconnectWebSocket = useCallback(() => {
//     stopHeartbeat();
//     if (reconnectTimerRef.current) {
//       clearTimeout(reconnectTimerRef.current);
//       reconnectTimerRef.current = null;
//     }
//     if (socketRef.current) {
//       socketRef.current.close(1000, "Disconnected");
//       socketRef.current = null;
//     }
//     setIsConnected(false);
//     isConnectingRef.current = false;
//   }, []);

//   /* =====================================================
//      CONNECT
//   ===================================================== */
//   const connectWebSocket = useCallback(async () => {
//     if (socketRef.current || isConnectingRef.current) return;

//     const authed = await isAuthenticated();
//     if (!authed) {
//       disconnectWebSocket();
//       return;
//     }

//     let wsUrl;
//     try {
//       wsUrl = getWebSocketUrl();
//     } catch (err) {
//       console.error(err.message);
//       return;
//     }

//     isConnectingRef.current = true;
//     const ws = new WebSocket(wsUrl);
//     socketRef.current = ws;

//     ws.onopen = () => {
//       isConnectingRef.current = false;
//       setIsConnected(true);
//       startHeartbeat(ws);
//     };

//     ws.onmessage = handleMessage;

//     ws.onerror = (err) => {
//       console.error("WebSocket error:", err);
//     };

//     ws.onclose = (e) => {
//       stopHeartbeat();
//       socketRef.current = null;
//       setIsConnected(false);
//       isConnectingRef.current = false;

//       if (e.code !== 1000) {
//         reconnectTimerRef.current = setTimeout(connectWebSocket, 3000);
//       }
//     };
//   }, [handleMessage, startHeartbeat, disconnectWebSocket]);

//   /* =====================================================
//      PATH MONITORING
//   ===================================================== */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const path = window.location.pathname;
//       const isLoginPage = path === "/" || path === "/login";

//       if (isLoginPage) {
//         if (isConnected) disconnectWebSocket();
//       } else {
//         if (!isConnected && !isConnectingRef.current) {
//           connectWebSocket();
//         }
//       }
//     }, PATH_POLL_INTERVAL);

//     return () => clearInterval(interval);
//   }, [connectWebSocket, disconnectWebSocket, isConnected]);

//   /* =====================================================
//      CLEANUP
//   ===================================================== */
//   useEffect(() => {
//     window.addEventListener("beforeunload", disconnectWebSocket);
//     return () =>
//       window.removeEventListener("beforeunload", disconnectWebSocket);
//   }, [disconnectWebSocket]);

//   /* =====================================================
//      ACTIONS
//   ===================================================== */
//   const markAsRead = (id) => {
//   setNotifications(prev =>
//     prev.map(n =>
//       n.id === id ? { ...n, read: true } : n
//     )
//   );
// };

//   const markAllAsRead = () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//     setUnreadCount(0);
//   };

//   const clearAll = () => {
//     setNotifications([]);
//     setUnreadCount(0);
//   };

//   const sendMessage = (payload) => {
//     if (socketRef.current?.readyState === WebSocket.OPEN) {
//       socketRef.current.send(JSON.stringify(payload));
//       return true;
//     }
//     return false;
//   };

//   /* =====================================================
//      CONTEXT VALUE
//   ===================================================== */
//   return (
//     <WebSocketContext.Provider
//       value={{
//         isConnected,
//         notifications,
//         unreadCount,
//         markAsRead,
//         markAllAsRead,
//         clearAll,
//         sendMessage,
//         reconnect: connectWebSocket,
//       }}
//     >
//       {children}
//     </WebSocketContext.Provider>
//   );
// };
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import api from "../utils/axiosConfig";

/* =====================================================
   CONTEXT
===================================================== */
const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return ctx;
};

/* =====================================================
   SAFE UUID (crypto.randomUUID fallback)
===================================================== */
const generateUUID = () => {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/* =====================================================
   PROVIDER
===================================================== */
export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const isConnectingRef = useRef(false);
  const reconnectTimerRef = useRef(null);
  const heartbeatRef = useRef(null);
  const lastMessageRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const isMountedRef = useRef(true);
  const forcedDisconnectRef = useRef(false);
  
  const MAX_RECONNECT_ATTEMPTS = 5;

  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [connectionError, setConnectionError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const HEARTBEAT_INTERVAL = 30000; // 30 seconds
  const PATH_POLL_INTERVAL = 1000; // 1 second

  /* =====================================================
     CHECK AUTH STATUS
  ===================================================== */
  const checkAuthStatus = async () => {
    try {
      await api.get("/profile/me");
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.log("Auth check failed:", error.response?.status || error.message);
      setIsAuthenticated(false);
      return false;
    }
  };

  /* =====================================================
     BUILD WS URL
  ===================================================== */
  const getWebSocketUrl = () => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    if (!API_BASE) throw new Error("VITE_API_BASE_URL missing");

    const url = new URL(API_BASE);
    const scheme = url.protocol === "https:" ? "wss" : "ws";
    
    return `${scheme}://${url.host}/ws`;
  };

  /* =====================================================
     HEARTBEAT
  ===================================================== */
  const stopHeartbeat = () => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  };

  const startHeartbeat = useCallback((ws) => {
    stopHeartbeat();
    heartbeatRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "heartbeat" }));
        console.log("💓 Heartbeat sent");
      }
    }, HEARTBEAT_INTERVAL);
  }, []);

  /* =====================================================
     MESSAGE HANDLER
  ===================================================== */
  const handleMessage = useCallback((event) => {
    if (event.data === lastMessageRef.current) return;
    lastMessageRef.current = event.data;

    try {
      const data = JSON.parse(event.data);
      console.log("📩 Received WebSocket message:", data);

      if (data.type === "connection_established") {
        console.log(`✅ Connection confirmed - Authenticated: ${data.authenticated}, User ID: ${data.user_id}`);
        if (data.authenticated) {
          setIsAuthenticated(true);
        }
        return;
      }

      if (data.type === "heartbeat_ack") {
        console.log("💓 Heartbeat acknowledged");
        return;
      }

      if (data.type === "ping") {
        // Respond to server ping
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: "pong" }));
        }
        return;
      }

      if (data.message) {
        const notification = {
          id: generateUUID(),
          message: data.message,
          type: data.notification_type || "info",
          timestamp: data.timestamp || new Date().toISOString(),
          read: false,
          data: data.data || {},
          eventType: data.type,
        };

        console.log("🔔 New notification:", notification);
        
        setNotifications((prev) => {
          const isDuplicate = prev.some(n => 
            n.message === notification.message && 
            Math.abs(new Date(n.timestamp) - new Date(notification.timestamp)) < 1000
          );
          
          if (isDuplicate) {
            console.log("⚠️ Duplicate notification ignored");
            return prev;
          }
          
          return [notification, ...prev].slice(0, 50);
        });

        if (document.visibilityState === 'hidden' && Notification.permission === 'granted') {
          new Notification("HMS Notification", {
            body: notification.message,
            icon: "/vite.svg",
            tag: notification.id
          });
        }
      }
    } catch (err) {
      console.error("❌ WebSocket message parse error:", err, "Raw data:", event.data);
    }
  }, []);

  /* =====================================================
     DISCONNECT
  ===================================================== */
  const disconnectWebSocket = useCallback((forced = false) => {
    console.log("🔌 Disconnecting WebSocket...", forced ? "(forced)" : "");
    stopHeartbeat();
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (socketRef.current) {
      forcedDisconnectRef.current = forced;
      socketRef.current.close(forced ? 1000 : 1001, forced ? "Forced disconnect" : "Disconnected");
      socketRef.current = null;
    }
    setIsConnected(false);
    isConnectingRef.current = false;
    reconnectAttemptsRef.current = 0;
    setConnectionError(null);
  }, []);

  /* =====================================================
     CONNECT
  ===================================================== */
  const connectWebSocket = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    if (socketRef.current || isConnectingRef.current) {
      console.log("WebSocket already connecting or connected");
      return;
    }

    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      console.error(`❌ Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached`);
      setConnectionError("Unable to establish WebSocket connection");
      return;
    }

    const authed = await checkAuthStatus();
    if (!authed) {
      console.log("User not authenticated, skipping WebSocket connection");
      disconnectWebSocket(true);
      return;
    }

    let wsUrl;
    try {
      wsUrl = getWebSocketUrl();
      console.log("🌐 Attempting WebSocket connection to:", wsUrl);
    } catch (err) {
      console.error("❌ Failed to build WebSocket URL:", err.message);
      return;
    }

    reconnectAttemptsRef.current += 1;
    isConnectingRef.current = true;
    setConnectionError(null);
    forcedDisconnectRef.current = false;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    const connectionTimeout = setTimeout(() => {
      if (ws.readyState === WebSocket.CONNECTING) {
        console.log("⏱️ WebSocket connection timeout");
        ws.close();
        isConnectingRef.current = false;
      }
    }, 10000);

    ws.onopen = () => {
      if (!isMountedRef.current) {
        ws.close();
        return;
      }
      
      clearTimeout(connectionTimeout);
      console.log("✅ WebSocket connection established");
      isConnectingRef.current = false;
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      startHeartbeat(ws);
      
      try {
        ws.send(JSON.stringify({
          type: "client_info",
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error("Failed to send client info:", error);
      }
    };

    ws.onmessage = handleMessage;

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      if (!forcedDisconnectRef.current) {
        setConnectionError("WebSocket connection error");
      }
    };

    ws.onclose = (e) => {
      clearTimeout(connectionTimeout);
      console.log(`🔌 WebSocket closed: Code ${e.code}, Reason: ${e.reason || 'No reason'}`);
      
      stopHeartbeat();
      socketRef.current = null;
      setIsConnected(false);
      isConnectingRef.current = false;

      if (!isMountedRef.current || forcedDisconnectRef.current) {
        console.log("🛑 Not reconnecting (component unmounted or forced disconnect)");
        return;
      }

      if (e.code !== 1000 && e.code !== 1008) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        console.log(`🔄 Attempting to reconnect in ${delay/1000} seconds... (Attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);
        
        reconnectTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            connectWebSocket();
          }
        }, delay);
      } else if (e.code === 1008) {
        console.log("❌ Authentication failed - invalid token");
        setConnectionError("Authentication failed");
      }
    };
  }, [handleMessage, startHeartbeat, disconnectWebSocket]);

  /* =====================================================
     PATH MONITORING
  ===================================================== */
  useEffect(() => {
    let timeoutId;
    
    const checkPath = () => {
      const path = window.location.pathname;
      const isLoginPage = path === "/" || path === "/login";

      if (isLoginPage) {
        if (isConnected) disconnectWebSocket(true);
      } else {
        if (!isConnected && !isConnectingRef.current && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            connectWebSocket();
          }, 500);
        }
      }
    };

    checkPath();
    const interval = setInterval(checkPath, PATH_POLL_INTERVAL);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [connectWebSocket, disconnectWebSocket, isConnected]);

  /* =====================================================
     VISIBILITY CHANGE HANDLER
  ===================================================== */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected && !isConnectingRef.current) {
        console.log("📱 Tab became visible, reconnecting WebSocket...");
        reconnectAttemptsRef.current = 0; // Reset attempts on visibility change
        connectWebSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected, connectWebSocket]);

  /* =====================================================
     CLEANUP
  ===================================================== */
  useEffect(() => {
    isMountedRef.current = true;
    
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const handleBeforeUnload = () => {
      disconnectWebSocket(true);
    };

    const handleOnline = () => {
      console.log("📶 Network online - attempting to reconnect");
      reconnectAttemptsRef.current = 0;
      connectWebSocket();
    };

    const handleOffline = () => {
      console.log("📶 Network offline - disconnecting");
      disconnectWebSocket(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      disconnectWebSocket(true);
    };
  }, [disconnectWebSocket, connectWebSocket]);

  /* =====================================================
     ACTIONS
  ===================================================== */
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const sendMessage = useCallback((payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }, []);

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */
  const value = {
    isConnected,
    connectionError,
    notifications,
    unreadCount,
    isAuthenticated,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification,
    sendMessage,
    reconnect: connectWebSocket,
    reconnectAttempts: reconnectAttemptsRef.current,
    maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;