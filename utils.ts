export const convertDdToDms = (dd: number, isLatitude: boolean): string => {
  const absoluteDd = Math.abs(dd);
  const degrees = Math.floor(absoluteDd);
  const minutesFloat = (absoluteDd - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = ((minutesFloat - minutes) * 60).toFixed(2);

  let direction = '';
  if (isLatitude) {
    direction = dd >= 0 ? 'N' : 'S';
  } else {
    direction = dd >= 0 ? 'E' : 'W';
  }

  return `${degrees}°${minutes}'${seconds}''${direction}`;
}; 