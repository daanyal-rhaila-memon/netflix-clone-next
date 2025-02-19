import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prismadb from '@/libs/prismadb';

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!res) {
    throw new Error('Response object is required');
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    throw new Error('Not signed in');
  }

  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    }
  });

  if (!currentUser) {
    throw new Error('Not signed in');
  }

  return { currentUser };
}

export default serverAuth;
