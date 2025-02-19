import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { currentUser } = await serverAuth(req, res);

    if (!currentUser?.favoriteIds) {
      return res.status(200).json([]);
    }

    const favoriteMovies = await prismadb.movie.findMany({
      where: {
        id: {
          in: currentUser.favoriteIds,
        }
      }
    });

    return res.status(200).json(favoriteMovies);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
}
