
import type { PrintSize } from './types';

export const PRINT_SIZES: PrintSize[] = [
  { id: '15x15', name: '15cm × 15cm', width: 15, height: 15, aspectRatio: 'aspect-square' },
  { id: '15x10', name: '15cm × 10cm', width: 15, height: 10, aspectRatio: 'aspect-[3/2]' },
  { id: '7.5x7.5', name: '7.5cm × 7.5cm', width: 7.5, height: 7.5, aspectRatio: 'aspect-square' },
];

export const A4_DIMENSIONS_MM = {
  width: 210,
  height: 297,
};

export const INITIAL_MAP_CONFIG = {
  center: [35.681236, 139.767125] as [number, number], // Tokyo Station
  zoom: 15,
};
