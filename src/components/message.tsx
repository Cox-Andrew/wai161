// a message bubble component that displays a message
// and a timestamp
import type { Message, User } from "@prisma/client";
import Avatar from "./avatar";

const MessageBubble = ({
  text,
  user,
  createdAt,
  ai,
}: Message & { user: User | null }) => {
  return (
    // align AI messages left
    // TODO: align messages based on current user
    <div
      className={`w-3/4 rounded-lg bg-slate-500 p-3 text-white ${
        ai ? "" : "ml-8"
      }`}
    >
      <div className="flex w-full flex-row justify-between">
        {/* profile picture */}
        <p>
          <Avatar user={user} />
        </p>
        {/* name */}
        <p>{ai ? "AI" : user?.name}</p>
        {/* timestamp */}
        <p>{createdAt.toLocaleTimeString()}</p>
      </div>
      <p>{text}</p>
    </div>
  );
};

export default MessageBubble;
