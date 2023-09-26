import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

export const LongPolling = () => {
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
    try {
      const { data } = await axios.get("http://localhost:5000/get-messages");

      setMessages((prev) => [data, ...prev]);
      await subscribe();
    } catch (error) {
      setTimeout(() => {
        subscribe();
      }, 500);
    }
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
