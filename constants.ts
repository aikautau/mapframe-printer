
import type { PrintSize } from './types';

export const PRINT_SIZES: PrintSize[] = [
  { id: '7.5x7.5', name: '7.5cm × 7.5cm', width: 7.5, height: 7.5, aspectRatio: 'aspect-square' },
  { id: '12x12', name: '12cm × 12cm', width: 12, height: 12, aspectRatio: 'aspect-square' },
  { id: '17.0x11.4', name: '17.0cm × 11.4cm (横長)', width: 17.0, height: 11.4, aspectRatio: 'aspect-[170/114]' },
  { id: '12.0x16.4', name: '12.0cm × 16.4cm (縦長)', width: 12.0, height: 16.4, aspectRatio: 'aspect-[120/164]' },
  { id: '28.0x20', name: '28.0cm × 20cm (横長)', width: 28.0, height: 20, aspectRatio: 'aspect-[280/200]' },
];

export const A4_DIMENSIONS_MM = {
  width: 210,
  height: 297,
};

export const INITIAL_MAP_CONFIG = {
  center: [35.681236, 139.767125] as [number, number], // Tokyo Station
  zoom: 15,
};
