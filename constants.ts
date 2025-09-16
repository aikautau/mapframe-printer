
import type { PrintSize } from './types';

export const PRINT_SIZES: PrintSize[] = [
  { id: '15x15', name: '15cm × 15cm', width: 15, height: 15, aspectRatio: 'aspect-square' },
  { id: '7.5x7.5', name: '7.5cm × 7.5cm', width: 7.5, height: 7.5, aspectRatio: 'aspect-square' },
  { id: '11x11', name: '11cm × 11cm', width: 11, height: 11, aspectRatio: 'aspect-square' },
  { id: '12x12', name: '12cm × 12cm', width: 12, height: 12, aspectRatio: 'aspect-square' },
  { id: '22.3x15.2', name: '22.3cm × 15.2cm (横長)', width: 22.3, height: 15.2, aspectRatio: 'aspect-[223/152]' },
  { id: '17.4x11.3', name: '17.4cm × 11.3cm (横長)', width: 17.4, height: 11.3, aspectRatio: 'aspect-[174/113]' },
  { id: '23x17', name: '23cm × 17cm (横長)', width: 23, height: 17, aspectRatio: 'aspect-[23/17]' },
  { id: '33.2x20', name: '33.2cm × 20cm (横長)', width: 33.2, height: 20, aspectRatio: 'aspect-[332/200]' },
];

export const A4_DIMENSIONS_MM = {
  width: 210,
  height: 297,
};

export const INITIAL_MAP_CONFIG = {
  center: [35.681236, 139.767125] as [number, number], // Tokyo Station
  zoom: 15,
};
