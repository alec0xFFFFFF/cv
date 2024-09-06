import { useShallow } from 'zustand/react/shallow';
import { useGlobalStore } from '../global-store';

export const useZoom = () => {
  const { zoom, setZoom } = useGlobalStore(
    useShallow((state) => ({
      zoom: state.zoom,
      setZoom: state.setZoom,
    }))
  );

  return {
    zoom,
    setZoom,
  };
};
