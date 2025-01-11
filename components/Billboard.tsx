import React, { useCallback } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

import PlayButton from '@/components/PlayButton';
import useBillboard from '@/hooks/useBillboard';
import useInfoModalStore from '@/hooks/useInfoModalStore';

const Billboard: React.FC = () => {
  const { openModal } = useInfoModalStore();
  const { data } = useBillboard();

  const handleOpenModal = useCallback(() => {
    openModal(data?.id);
  }, [openModal, data?.id]);

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
    <div className="relative h-[40vh] sm:h-[50vh] lg:h-[56.25vw]">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
      <iframe
        className="w-full h-full object-cover"
        src={`${getEmbedUrl(data?.videoUrl)}?autoplay=1&mute=1&loop=1&controls=0&playlist=${getEmbedUrl(data?.videoUrl)?.split('/').pop()}&modestbranding=1`}
        title={data?.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="absolute top-[20%] sm:top-[30%] md:top-[40%] ml-4 md:ml-16 z-20">
        <p className="text-white text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl max-w-[90%] md:max-w-[80%] lg:max-w-[50%]">
          {data?.title}
        </p>
        <p className="text-white text-[10px] sm:text-sm md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl line-clamp-3">
          {data?.description}
        </p>
        <div className="flex flex-row items-center mt-3 md:mt-4 gap-2 md:gap-3">
          <PlayButton movieId={data?.id} />
          <button
            onClick={handleOpenModal}
            className="
              bg-white
              text-white
              bg-opacity-30 
              rounded-md 
              py-1 md:py-2 
              px-2 md:px-4
              w-auto 
              text-xs lg:text-lg 
              font-semibold
              flex
              flex-row
              items-center
              hover:bg-opacity-20
              transition
              duration-300
            "
          >
            <InformationCircleIcon className="w-4 md:w-7 mr-1" />
            More Info
          </button>
        </div>
      </div>
    </div>
  )
}

export default Billboard;
