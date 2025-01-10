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
    <div className="h-screen w-screen bg-black">
      <nav className="fixed w-full p-4 z-10 flex flex-row items-center gap-8 bg-black bg-opacity-70">
        <ArrowLeftIcon onClick={() => router.push('/')} className="w-4 md:w-10 text-white cursor-pointer hover:opacity-80 transition" />
        <p className="text-white text-1xl md:text-3xl font-bold">
          <span className="font-light">Watching:</span> {data?.title}
        </p>
      </nav>
      <div className="relative h-full w-full">
        <iframe
          className="w-full h-full"
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
