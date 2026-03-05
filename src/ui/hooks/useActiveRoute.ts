import { useSegments } from 'expo-router';

export const useActiveRoute = () => {
  const segments = useSegments();
  return segments[2] ?? 'home';
};
