import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Test database connection
        await prismadb.$connect();
        console.log("Database connected successfully");

        // Count movies
        const movieCount = await prismadb.movie.count();
        console.log("Movie count:", movieCount);

        // Get all movies
        const movies = await prismadb.movie.findMany();
        console.log("Movies:", movies);

        return res.status(200).json({
            status: 'connected',
            movieCount,
            movies
        });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({
            error: error,
        });
    } finally {
        await prismadb.$disconnect();
    }
} 