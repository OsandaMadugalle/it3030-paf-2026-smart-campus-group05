import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.connected = false;
    this.onConnectCallbacks = [];
  }

  connect() {
    if (this.client && this.client.active) return;

    const token = localStorage.getItem('token');
    const baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:8081/api').replace('/api', '');
    
    this.client = new Client({
      // brokerURL is overridden by webSocketFactory below (SockJS); kept for reference only
      connectHeaders: {
        'Authorization': `Bearer ${token}`
      },
      reconnectDelay: 10000,   // back off 10s between reconnect attempts
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    // Use SockJS for transport — token passed via STOMP connectHeaders, NOT URL
    this.client.webSocketFactory = () => new SockJS(`${baseUrl}/ws`);

    this.client.onConnect = (frame) => {
      this.connected = true;
      console.log('Connected to WebSocket');
      this.onConnectCallbacks.forEach(callback => callback(frame));
      // Re-subscribe to existing topics
      this.subscriptions.forEach((callback, topic) => {
        this._subscribe(topic, callback);
      });
    };

    this.client.onDisconnect = () => {
      this.connected = false;
      console.log('Disconnected from WebSocket');
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error', frame);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connected = false;
    }
  }

  subscribe(topic, callback) {
    this.subscriptions.set(topic, callback);
    if (this.connected) {
      return this._subscribe(topic, callback);
    }
  }

  _subscribe(topic, callback) {
    return this.client.subscribe(topic, (message) => {
      if (message.body) {
        callback(JSON.parse(message.body));
      }
    });
  }

  unsubscribe(topic) {
    // Note: This logic is simple and assumes one sub per topic
    this.subscriptions.delete(topic);
  }

  onConnect(callback) {
    this.onConnectCallbacks.push(callback);
    if (this.connected) {
      callback();
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
