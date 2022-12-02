import Image from "next/image";
import type { User } from "@prisma/client";
import CryptoJS from "crypto-js";

const Avatar = ({ user, size=20 }: { user: User | null, size?: number }) => {
  const emailHash = user ? CryptoJS.MD5(user?.email || "").toString() : "";

  return (
    <Image
      className={`rounded-full`}
      src={user ? `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=identicon` : "/robot.png"}
      alt={user?.name || "A picture of a robot"}
      width={size}
      height={size}
    />
  );
};

export default Avatar;
