import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

export const EventSourcing = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  const onChangeMessage = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const onSendMessage = useCallback(async () => {
    try {
      await axios.post("http://localhost:5000/new-messages", {
        text: value,
        id: Date.now(),
      });

      setValue("");
    } catch (error) {
      console.log("error");
      onSendMessage();
    }
  }, [value, setValue]);

  const subscribe = useCallback(async () => {
    const eventSource = new EventSource("http://localhost:5000/connect");
    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
  }, []);

  useEffect(() => {
    subscribe();
  }, [subscribe]);

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
        {messages.map((message) => (
          <div key={message.id} className="message-item">
            {message.text}
          </div>
        ))}
      </div>
    </main>
  );
};
