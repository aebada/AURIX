import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

export function useThemeColors() {
  const scheme = useColorScheme();
  return Colors[scheme];
}
