
import type { PrintSize } from './types';

export const PRINT_SIZES: PrintSize[] = [
  { id: '7.5x7.5', name: '7.5cm × 7.5cm', width: 7.5, height: 7.5, aspectRatio: 'aspect-square' },
  { id: '12x12', name: '12cm × 12cm', width: 12, height: 12, aspectRatio: 'aspect-square' },
  { id: '17.4x11.3', name: '17.4cm × 11.3cm (横長)', width: 17.4, height: 11.3, aspectRatio: 'aspect-[174/113]' },
  { id: '12.3x16.4', name: '12.3cm × 16.4cm (縦長)', width: 12.3, height: 16.4, aspectRatio: 'aspect-[123/164]' },
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
