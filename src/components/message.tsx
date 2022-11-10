// a message bubble component that displays a message
// and a timestamp

export interface Message {
  text: string;
  timestamp: Date;
  user: string;
}

const MessageBubble = ({text, timestamp, user}: Message) => {
  return (
    <div className={`rounded-lg bg-slate-500 text-white p-3 w-3/4
      ${user === "ai" ? "" : "ml-8"}`}>
      <div className="flex flex-row w-full justify-between">
        <p>{user}</p>
        <p>{timestamp.toLocaleTimeString()}</p>
      </div>
      <p>{text}</p>
    </div>
  );
};

export default MessageBubble;