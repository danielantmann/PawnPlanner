import { useRouter } from 'expo-router';
import { useUIStore } from '@/src/store/ui.store';

export const useDrawerNavigation = () => {
  const router = useRouter();
  const closeDrawer = useUIStore((s) => s.closeDrawer);

  const go = (path: string) => {
    closeDrawer();
    router.push(path as any);
  };

  return { go };
};
