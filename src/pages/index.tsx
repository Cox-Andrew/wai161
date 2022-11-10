import type { NextPage } from "next";
import { useState } from "react";
import Message from "../components/message";
import type {MessageDetails} from "../components/message";

const Home: NextPage = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageDetails[]>([]);

  const sendMessage = async (text: string) => {
    // create new message and update state
    const newMessage: MessageDetails = {
      text: text,
      timestamp: new Date(),
      user: "John",
    }
    
    // send message to API to get response
    const requestInit: RequestInit = {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ inputs: text }),
    };
    const response = await fetch(API_URL, requestInit);
    const json = await response.json();
    const emotion = json[0].generated_text;
    console.log(emotion);
    
    const aiMessage: MessageDetails = {
      text: `Damn u sure are feeling ${emotion} imo`,
      timestamp: new Date(),
      user: "ai",
    }

    setMessages([...messages, newMessage, aiMessage]);

    // clear message
    setMessage("");
  }

  const API_URL = "https://api-inference.huggingface.co/models/mrm8488/t5-base-finetuned-emotion";
  const HEADERS = new Headers();
  HEADERS.append("Authorization", "Bearer " + process.env.NEXT_PUBLIC_HFACE_TOKEN);

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <h1
        className="
        text-5xl font-extrabold leading-normal 
        text-gray-700 md:text-[5rem]
      "
      >
        Welcome to WAI161
      </h1>

      <p className="mt-4 text-2xl text-gray-600">
        A Warwick AI course creating a web app
      </p>

      <div id="chat-window">
        <div id="messages" className="m-4 w-80 space-y-2 overflow-y-scroll">
          {messages.map((message) => (
            <Message
              key={message.timestamp.getTime()}
              {...message}
            />
          ))}
        </div>

        {/* text box for chat */}
        <div className="flex flex-row space-x-4">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-10 input input-sm bg-gray-200"
            type="text"
            placeholder="Type a message..."
          />
          <button
            className="btn-sm btn bg-slate-500 text-white"
            onClick={() => sendMessage(message)}
          >
            Click me!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
