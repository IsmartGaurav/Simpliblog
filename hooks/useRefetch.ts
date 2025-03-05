import { useCallback } from 'react';
import { api } from '@/utils/api';

export const useRefetch = () => {
  const utils = api.useContext();

  return useCallback(() => {
    utils.blog.getBlogs.invalidate();
  }, [utils]);
};