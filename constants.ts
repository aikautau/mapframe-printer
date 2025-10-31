
import type { PrintSize } from './types';

export const PRINT_SIZES: PrintSize[] = [
  { id: '7.5x7.5', name: '7.5cm × 7.5cm（20角額）', width: 7.5, height: 7.5, aspectRatio: 'aspect-square' },
  { id: '12x12', name: '12cm × 12cm（20角額）', width: 12, height: 12, aspectRatio: 'aspect-square' },
  { id: '16.4x12.4', name: '16cm × 12cm（横・インチ額）', width: 16.4, height: 12.4, aspectRatio: 'aspect-[164/124]' },
  { id: '12.4x16.4', name: '12cm × 16cm（縦・インチ額）', width: 12.4, height: 16.4, aspectRatio: 'aspect-[124/164]' },
  { id: '27.8x19.8', name: '28cm × 20cm（太子額）', width: 27.8, height: 19.8, aspectRatio: 'aspect-[278/198]' },
];

export const A4_DIMENSIONS_MM = {
  width: 210,
  height: 297,
};

export const INITIAL_MAP_CONFIG = {
  center: [35.681236, 139.767125] as [number, number], // Tokyo Station
  zoom: 15,
};
