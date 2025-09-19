import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PrintSize } from './types';
import { PRINT_SIZES, A4_DIMENSIONS_MM, INITIAL_MAP_CONFIG } from './constants';
import type { Map, Marker } from 'leaflet';
import { convertDdToDms } from './utils';

const SpinnerIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const SearchIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

const HamburgerIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const App: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<PrintSize>(PRINT_SIZES[0]);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [mapLocation, setMapLocation] = useState<string>('日本の東京駅');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const selectionFrameRef = useRef<HTMLDivElement | null>(null);
  
  // Initialize map
  useEffect(() => {
    if (mapRef.current) return; // Initialize map only once

    if (mapContainerRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        center: INITIAL_MAP_CONFIG.center,
        zoom: INITIAL_MAP_CONFIG.zoom,
        zoomControl: false, // We will add it in a different position
        zoomSnap: 0, // Enable fractional zoom
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        detectRetina: true,
        maxZoom: 19,
        maxNativeZoom: 19,
      }).addTo(map);

      window.L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add initial marker for Tokyo Station
      const initialMarker = window.L.marker(INITIAL_MAP_CONFIG.center).addTo(map);
      markerRef.current = initialMarker;

      mapRef.current = map;
    }
    
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    
  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapRef.current) return;

    setIsSearching(true);
    setSearchError(null);

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&accept-language=ja`;

    try {
      const response = await fetch(nominatimUrl);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
        
        if (mapRef.current) {
            // Remove old marker if it exists
            if (markerRef.current) {
                markerRef.current.remove();
            }
            // Add new marker
            const newMarker = window.L.marker(newCenter).addTo(mapRef.current);
            markerRef.current = newMarker;

            mapRef.current.setView(newCenter, 15); // Zoom to a reasonable level
        }
        setMapLocation(display_name);
        setSearchQuery(''); // Clear input on success
        
        // Close sidebar on mobile after successful search
        if (isMobile) {
          setTimeout(() => setSidebarOpen(false), 1000);
        }
      } else {
        setSearchError("場所が見つかりませんでした。");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError("検索中にエラーが発生しました。");
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, isMobile]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Check if device is mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handlePrint = useCallback(async () => {
    if (!mapRef.current || !mapContainerRef.current || !selectionFrameRef.current) {
      alert("エラー: マップ要素が見つかりません。");
      return;
    }
    
    setIsPrinting(true);
    document.body.classList.add('printing-mode');

    // Get map center coordinates before capturing
    const mapCenter = mapRef.current.getCenter();
    const creditText = "© OpenStreetMap Contributors.";
    const latitudeDMS = convertDdToDms(mapCenter.lat, true);
    const longitudeDMS = convertDdToDms(mapCenter.lng, false);
    const coordinatesText = `Lat: ${latitudeDMS}, Lng: ${longitudeDMS}`;

    // Hide marker for printing
    if (markerRef.current) {
        markerRef.current.setOpacity(0);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const { jsPDF } = window.jspdf;
      const mapElem = mapContainerRef.current;
      const frameElem = selectionFrameRef.current;

      const mapRect = mapElem.getBoundingClientRect();
      const frameRect = frameElem.getBoundingClientRect();

      // 1.5mm余白
      const MARGIN_MM = 1.5;
      // 地図画像サイズ（mm）: 選択サイズから余白×2を引く
      const mapImgWidthMM = selectedSize.width * 10 - 2 * MARGIN_MM;
      const mapImgHeightMM = selectedSize.height * 10 - 2 * MARGIN_MM;

      // html2canvasでキャプチャ（枠内いっぱいでOK）
      const areaCm2 = selectedSize.width * selectedSize.height;
      const captureScale = areaCm2 >= 400 ? 6 : 4; // 大きいサイズは解像度を上げる
      const canvas = await window.html2canvas(mapElem, {
        useCORS: true,
        logging: false,
        width: frameRect.width,
        height: frameRect.height,
        x: frameRect.left - mapRect.left,
        y: frameRect.top - mapRect.top,
        scale: captureScale,
      });
      const imgData = canvas.toDataURL('image/png');

      const isLargeLandscape = selectedSize.id === '28.0x20';
      const pdf = new jsPDF({
        orientation: isLargeLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: isLargeLandscape ? [350, 216] : 'a4',
      });

      const pageWidthMM = isLargeLandscape ? 350 : A4_DIMENSIONS_MM.width;
      const pageHeightMM = isLargeLandscape ? 216 : A4_DIMENSIONS_MM.height;

      // PDF上の印刷枠（選択サイズ）をページ中央に配置
      const printWidthMM = selectedSize.width * 10;
      const printHeightMM = selectedSize.height * 10;
      const printX = (pageWidthMM - printWidthMM) / 2;
      const printY = (pageHeightMM - printHeightMM) / 2;

      // 地図画像の左上座標（余白分内側）
      const imgX = printX + MARGIN_MM;
      const imgY = printY + MARGIN_MM;

      // 地図画像を貼り付け
      pdf.addImage(imgData, 'PNG', imgX, imgY, mapImgWidthMM, mapImgHeightMM);

      // 枠線（地図画像の外周）
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.2);
      pdf.rect(imgX, imgY, mapImgWidthMM, mapImgHeightMM, 'S');

      // トンボ（切り取り線）
      const cropMarkLen = 5; // トンボの長さmm
      const bleed = 3; // トンボの外側へのはみ出しmm
      // 上左
      pdf.line(printX - bleed, printY, printX + cropMarkLen, printY);
      pdf.line(printX, printY - bleed, printX, printY + cropMarkLen);
      // 上右
      pdf.line(printX + printWidthMM - cropMarkLen, printY, printX + printWidthMM + bleed, printY);
      pdf.line(printX + printWidthMM, printY - bleed, printX + printWidthMM, printY + cropMarkLen);
      // 下左
      pdf.line(printX - bleed, printY + printHeightMM, printX + cropMarkLen, printY + printHeightMM);
      pdf.line(printX, printY + printHeightMM - cropMarkLen, printX, printY + printHeightMM + bleed);
      // 下右
      pdf.line(printX + printWidthMM - cropMarkLen, printY + printHeightMM, printX + printWidthMM + bleed, printY + printHeightMM);
      pdf.line(printX + printWidthMM, printY + printHeightMM - cropMarkLen, printX + printWidthMM, printY + printHeightMM + bleed);

      // クレジット・座標（34x21の時は省略）
      if (!isLargeLandscape) {
        pdf.setFontSize(8);
        pdf.setTextColor(128);
        const creditY = printY + printHeightMM + 5;
        pdf.text(creditText, pageWidthMM / 2, creditY, { align: 'center' });
        const coordinatesY = creditY + 3;
        pdf.text(coordinatesText, pageWidthMM / 2, coordinatesY, { align: 'center' });
      }

      pdf.save(`map-${selectedSize.id}.pdf`);
      
    } catch (error) {
      console.error("PDFの生成に失敗しました:", error);
      alert("PDFの生成中にエラーが発生しました。コンソールを確認してください。");
    } finally {
      // Restore marker after printing
      if (markerRef.current) {
          markerRef.current.setOpacity(1);
      }
      setIsPrinting(false);
      document.body.classList.remove('printing-mode');
    }
  }, [selectedSize]);

  const handleDownloadImage = useCallback(async () => {
    if (!mapRef.current || !mapContainerRef.current || !selectionFrameRef.current) {
      alert("エラー: マップ要素が見つかりません。");
      return;
    }

    setIsPrinting(true);
    document.body.classList.add('printing-mode');

    // Hide marker for image download
    if (markerRef.current) {
        markerRef.current.setOpacity(0);
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const mapElem = mapContainerRef.current;
      const frameElem = selectionFrameRef.current;

      const mapRect = mapElem.getBoundingClientRect();
      const frameRect = frameElem.getBoundingClientRect();

      // html2canvasでキャプチャ（枠内いっぱいでOK）
      const areaCm2Img = selectedSize.width * selectedSize.height;
      const captureScaleImg = areaCm2Img >= 400 ? 6 : 4; // 大きいサイズは解像度を上げる
      const canvas = await window.html2canvas(mapElem, {
        useCORS: true,
        logging: false,
        width: frameRect.width,
        height: frameRect.height,
        x: frameRect.left - mapRect.left,
        y: frameRect.top - mapRect.top,
        scale: captureScaleImg,
      });
      const imgData = canvas.toDataURL('image/png');

      // Use different download methods for mobile vs desktop
      if (isMobile) {
        // On mobile, open image in new tab/window for user to save manually
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>Map Download</title></head>
              <body style="margin:0;text-align:center;background:#f0f0f0;">
                <p style="padding:20px;">長押しして画像を保存してください</p>
                <img src="${imgData}" style="max-width:100%;height:auto;" alt="Map Image" />
              </body>
            </html>
          `);
          newWindow.document.close();
        } else {
          // Fallback: try blob download
          try {
            const blob = await fetch(imgData).then(res => res.blob());
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `map-${selectedSize.id}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Fallback download failed:', error);
            alert('ダウンロードできませんでした。デスクトップ版をお試しください。');
          }
        }
      } else {
        // Desktop download
        const a = document.createElement('a');
        a.href = imgData;
        a.download = `map-${selectedSize.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

    } catch (error) {
      console.error("画像のダウンロードに失敗しました:", error);
      alert("画像のダウンロード中にエラーが発生しました。コンソールを確認してください。");
    } finally {
      // Restore marker after image download
      if (markerRef.current) {
          markerRef.current.setOpacity(1);
      }
      setIsPrinting(false);
      document.body.classList.remove('printing-mode');
    }
  }, [selectedSize, isMobile]);

  return (
    <div className="relative w-full h-full font-sans">
      <div ref={mapContainerRef} id="map" className="w-full h-full bg-gray-200" />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[999]">
        <div
          ref={selectionFrameRef}
          className={`
            w-[90vw] h-auto max-w-[500px] max-h-[90vh]
            border-2 border-dashed border-red-500 bg-black bg-opacity-10
            shadow-2xl transition-all duration-300 ease-in-out
            ${selectedSize.aspectRatio}
          `}
        />
      </div>

      {/* Mobile hamburger button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1002] hide-for-print"
          aria-label="メニューを開く"
        >
          {sidebarOpen ? <CloseIcon className="h-6 w-6 text-gray-700" /> : <HamburgerIcon className="h-6 w-6 text-gray-700" />}
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        absolute z-[1001] hide-for-print transition-all duration-300 ease-in-out
        ${isMobile 
          ? `top-4 inset-x-4 max-h-[85vh] overflow-y-auto ${sidebarOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`
          : 'top-4 right-4 w-72'
        }
      `}>
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-800">地図印刷設定</h1>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-1 text-gray-500 hover:text-gray-700"
                aria-label="メニューを閉じる"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <form onSubmit={handleSearch} className="mb-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">1. 場所を検索</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="例: 東京タワー"
                className="w-full p-2 border border-gray-300 rounded-l-md text-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isSearching}
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-200 flex-shrink-0"
                aria-label="検索"
              >
                {isSearching ? <SpinnerIcon className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
              </button>
            </div>
            {searchError && <p className="text-red-500 text-xs mt-1">{searchError}</p>}
          </form>

          <div className="space-y-2 mb-4">
            <h2 className="text-sm font-semibold text-gray-700">2. 印刷サイズを選択</h2>
            <p className="text-xs text-gray-500 -mt-1 mb-2">地図を動かして枠に合わせます。</p>
            {PRINT_SIZES.map(size => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={`
                  w-full text-left p-2 rounded-md border text-sm
                  transition-colors duration-200
                  ${selectedSize.id === size.id 
                    ? 'bg-blue-500 text-white border-blue-600 shadow' 
                    : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'
                  }
                `}
              >
                {size.name}
              </button>
            ))}
          </div>
            
          <h2 className="text-sm font-semibold text-gray-700 mb-1">3. PDFで印刷</h2>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200 shadow-md mb-2"
          >
            {isPrinting ? (
              <>
                <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                生成中...
              </>
            ) : (
              "PDFを生成"
            )}
          </button>

          <h2 className="text-sm font-semibold text-gray-700 mb-1">4. 地図画像をダウンロード</h2>
          <button
            onClick={handleDownloadImage}
            disabled={isPrinting}
            className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors duration-200 shadow-md"
          >
            {isPrinting ? (
              <>
                <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                {isMobile ? "生成中..." : "画像生成中..."}
              </>
            ) : (
              isMobile ? "画像ダウンロード" : "画像をダウンロード"
            )}
          </button>
        </div>
      </div>
       <div className="absolute bottom-0 left-0 p-2 bg-white/50 backdrop-blur-sm text-xs text-gray-600 rounded-tr-lg hide-for-print z-[1001] max-w-sm truncate">
        {mapLocation}
       </div>
    </div>
  );
};

export default App;
