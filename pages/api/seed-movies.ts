import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ error: 'Forbidden in production' });
    }

    try {
        const sampleMovies = [
            {
                title: 'Sample Movie 1',
                description: 'This is a sample movie',
                videoUrl: 'https://example.com/video1.mp4',
                thumbnailUrl: 'https://example.com/thumb1.jpg',
                genre: 'Action',
                duration: '2h 30m'
            },
            {
                title: 'Sample Movie 2',
                description: 'Another sample movie',
                videoUrl: 'https://example.com/video2.mp4',
                thumbnailUrl: 'https://example.com/thumb2.jpg',
                genre: 'Drama',
                duration: '1h 45m'
            }
        ];

        const result = await prismadb.movie.createMany({
            data: sampleMovies,
        });

        return res.status(200).json({ message: 'Movies seeded', count: result.count });
    } catch (error) {
        console.error("Seeding error:", error);
        return res.status(500).json({ error: error });
    }
} 