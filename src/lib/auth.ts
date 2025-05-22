import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const getSessionServer = async () => {
  return await getServerSession(authOptions);
};
