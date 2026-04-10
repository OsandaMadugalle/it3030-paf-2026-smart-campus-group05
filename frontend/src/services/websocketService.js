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
      brokerURL: `${baseUrl.replace('http', 'ws')}/ws`,
      connectHeaders: {
        'Authorization': `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.webSocketFactory = () => {
      const url = `${baseUrl}/ws?access_token=${token}`;
      return new SockJS(url);
    };

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
