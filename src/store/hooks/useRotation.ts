import { useShallow } from 'zustand/react/shallow';
import { useGlobalStore } from '../global-store';

export const useRotation = () => {
  const { rotation, setRotation } = useGlobalStore(
    useShallow((state) => ({
      rotation: state.rotation,
      setRotation: state.setRotation,
    }))
  );

  return {
    rotation,
    setRotation,
  };
};
