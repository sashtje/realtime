import React, { useState, useRef, useCallback } from "react";

export const WebSockets = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const socket = useRef();
  const [connected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");

  const connect = useCallback(() => {
    socket.current = new WebSocket("ws://localhost:5000");

    socket.current.onopen = () => {
      setIsConnected(true);
      const message = {
        event: "connection",
        username,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
      console.log("Connection established");
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };

    socket.current.onclose = () => {
      console.log("Socket was closed");
    };

    socket.current.onerror = () => {
      console.log("There is a error in Socket");
    };
  }, [username]);

  const onChangeMessage = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const onChangeUsername = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const onSendMessage = useCallback(async () => {
    const message = {
      event: "message",
      username,
      text: value,
      id: Date.now(),
    };

    socket.current.send(JSON.stringify(message));

    setValue("");
  }, [value, username]);

  if (!connected) {
    return (
      <main className="container">
        <div className="form">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={onChangeUsername}
            className="username"
          />

          <button onClick={connect} className="send-btn">
            Sign In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className="title">Welcome to our chat!</h1>

      <div className="form">
        <textarea
          value={value}
          onChange={onChangeMessage}
          className="message-textarea"
          type="text"
        />
        <button type="button" onClick={onSendMessage} className="send-btn">
          Send
        </button>
      </div>

      <div className="messages">
        <h2 className="messages-title">Your messages:</h2>

        {messages.map((message) =>
          message.event === "connection" ? (
            <div key={message.id} className="message-connection">
              User {message.username} has connected
            </div>
          ) : (
            <div key={message.id} className="message-item">
              {message.username}: {message.text}
            </div>
          )
        )}
      </div>
    </main>
  );
};
