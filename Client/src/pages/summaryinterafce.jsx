import React, { useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./summaryinterface.css";

function summaryinterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: `msg-${messages.length + 1}`, sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            Authorization: `Bearer YOUR_OPENAI_API_KEY`,
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage = {
        id: `msg-${messages.length + 2}`,
        sender: "bot",
        text: response.data.choices[0].message.content,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setInput("");
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedMessages = [...messages];
    const [movedItem] = reorderedMessages.splice(result.source.index, 1);
    reorderedMessages.splice(result.destination.index, 0, movedItem);
    setMessages(reorderedMessages);
  };

  return (
    <div className="chat-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="messages">
          {(provided) => (
            <div className="chat-box" {...provided.droppableProps} ref={provided.innerRef}>
              {messages.map((msg, index) => (
                <Draggable key={msg.id} draggableId={msg.id} index={index}>
                  {(provided) => (
                    <div
                      className={msg.sender === "user" ? "user-message" : "bot-message"}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {msg.text}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default summaryinterface;
