import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { currentUser } = await serverAuth(req, res);
    console.log("Auth successful:", currentUser);

    console.log("Fetching movies...");
    const moviesCount = await prismadb.movie.count();
    console.log("Total movies in DB:", moviesCount);

    const movies = await prismadb.movie.findMany();
    console.log("Fetched movies:", JSON.stringify(movies, null, 2));

    return res.status(200).json(movies);
  } catch (error) {
    console.log({ error })
    return res.status(500).end();
  }
}
