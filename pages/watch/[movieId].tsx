import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import useMovie from '@/hooks/useMovie';

const Watch = () => {
  const router = useRouter();
  const { movieId } = router.query;
  const { data } = useMovie(movieId as string);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';

    // Handle youtu.be format
    if (url.includes('youtu.be')) {
      const id = url.split('/').pop()?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // Handle youtube.com format
    if (url.includes('youtube.com/watch')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // Already an embed URL
    return url;
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <nav className="fixed w-full p-4 z-10 flex flex-row items-center gap-4 sm:gap-8 bg-black bg-opacity-70">
        <ArrowLeftIcon
          onClick={() => router.push('/')}
          className="w-6 sm:w-8 md:w-10 text-white cursor-pointer hover:opacity-80 transition"
        />
        <p className="text-white text-base sm:text-2xl md:text-3xl font-bold">
          <span className="font-light">Watching:</span> {data?.title}
        </p>
      </nav>
      <div className="relative pt-[56.25%] w-full">
        <iframe
          className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
          src={`${getEmbedUrl(data?.videoUrl)}?autoplay=1&controls=1`}
          title={data?.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default Watch;
