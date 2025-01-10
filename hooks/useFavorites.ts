import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const useFavorites = () => {
  const { data, error, isLoading, mutate } = useSwr('/api/favorites', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onSuccess: (data) => {
      console.log('Favorites fetched:', data);
    },
    onError: (error) => {
      console.error('Error fetching favorites:', error);
    }
  });
  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useFavorites;
