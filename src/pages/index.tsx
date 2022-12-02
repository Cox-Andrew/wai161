import type { NextPage } from "next";
import { useEffect, useState } from "react";
import MessageBubble from "../components/message";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  // Initialize the state for current message text and the list of messages
  const [messageText, setMessageText] = useState<string>("");

  const messageData = trpc.message.getAll.useQuery();
  const createMessage = trpc.message.create.useMutation();


  // Load discord session data
  const {data: sessionData} = useSession();

  useEffect(() => {
    const chatRefresh = setInterval(() => {
      messageData.refetch();
    }, 1000);

    return () => {
      clearInterval(chatRefresh);
    }
  }, [messageData]);

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

      
      <button
        className="mt-4 btn"
        onClick= {() => (sessionData ? signOut() : signIn("discord"))}
      >
        {sessionData ? "Sign out of " + sessionData.user?.email : "Sign in with Discord"}
      </button>

      <div id="chat-window">
        <div id="messages" className="m-4 w-80 space-y-2 overflow-y-scroll">
          {messageData.data?.map((message) => (
            <MessageBubble key={message.id} {...message} />
          ))}
        </div>

        {/* text box for chat */}
        <div id="message-box" className="flex flex-row space-x-4">
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="border-10 input input-sm bg-gray-200"
            type="text"
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createMessage.mutate(messageText);
              }
            }}
          />
          <button
            className="btn-sm btn bg-slate-500 text-white"
            onClick={() => createMessage.mutate(messageText)}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
