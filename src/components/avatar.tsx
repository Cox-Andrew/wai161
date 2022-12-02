import Image from "next/image";
import type { User } from "@prisma/client";
import CryptoJS from "crypto-js";

const Avatar = ({ user }: { user: User | null }) => {
  const emailHash = user ? CryptoJS.MD5(user?.email || "").toString() : "";

  return (
    <Image
      className="h-5 w-5 rounded-full"
      src={user ? `https://www.gravatar.com/avatar/${emailHash}` : "/robot.png"}
      alt={user?.name || "A picture of a robot"}
    />
  );
};

export default Avatar;
