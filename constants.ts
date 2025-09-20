
import type { PrintSize } from './types';

export const PRINT_SIZES: PrintSize[] = [
  { id: '7.5x7.5', name: '7.5cm × 7.5cm', width: 7.5, height: 7.5, aspectRatio: 'aspect-square' },
  { id: '12x12', name: '12cm × 12cm', width: 12, height: 12, aspectRatio: 'aspect-square' },
  { id: '17.4x11.4', name: '17.4cm × 11.4cm (横長)', width: 17.4, height: 11.4, aspectRatio: 'aspect-[174/114]' },
  { id: '12.4x16.4', name: '12.4cm × 16.4cm (縦長)', width: 12.4, height: 16.4, aspectRatio: 'aspect-[124/164]' },
  { id: '20.4x28.4', name: '20.4cm × 28.4cm (横長)', width: 20.4, height: 28.4, aspectRatio: 'aspect-[204/284]' },
];

export const A4_DIMENSIONS_MM = {
  width: 210,
  height: 297,
};

export const INITIAL_MAP_CONFIG = {
  center: [35.681236, 139.767125] as [number, number], // Tokyo Station
  zoom: 15,
};
