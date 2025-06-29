
import type { jsPDF } from 'jspdf';
import type html2canvas from 'html2canvas';
import type L from 'leaflet';

declare global {
  interface Window {
    jspdf: { jsPDF: typeof jsPDF };
    html2canvas: typeof html2canvas;
    L: typeof L;
  }
}

// This empty export statement is needed to make this file a module.
export {};
