import { useShallow } from 'zustand/react/shallow';
import { useGlobalStore } from '../global-store';

export const useCrop = () => {
  const { crop, setCrop } = useGlobalStore(
    useShallow((state) => ({
      crop: state.crop,
      setCrop: state.setCrop,
    }))
  );

  return {
    crop,
    setCrop,
  };
};
