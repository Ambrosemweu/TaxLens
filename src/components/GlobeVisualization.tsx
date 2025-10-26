import React, { useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { useTaxData } from '../context/TaxDataContext';
import { getCountryColor, brightenColor } from '../utils/colorScale';
import { computeCentroidAndSpan, calculateZoomAltitude } from '../utils/dataProcessing';
import type { CountryFeature } from '../types';
import CountryPopup from './CountryPopup';
import Legend from './Legend';

const GlobeVisualization: React.FC = () => {
  const globeRef = useRef<any>();
  const {
    countries,
    hoveredCountry,
    setHoveredCountry,
    selectedCountry,
    setSelectedCountry,
    flagUrl,
    isZoomed,
    setIsZoomed,
    trendData,
  } = useTaxData();

  useEffect(() => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();
    if (!controls) return;

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    let resumeTimeout: NodeJS.Timeout | null = null;

    const pauseAutoRotate = () => {
      controls.autoRotate = false;
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        controls.autoRotate = true;
      }, 3000);
    };

    const canvasEl =
      globeRef.current.renderer()?.domElement || document.querySelector('canvas');

    const events = ['pointerdown', 'wheel', 'touchstart', 'mousedown'];
    events.forEach((ev) => canvasEl?.addEventListener(ev, pauseAutoRotate, { passive: true }));

    const onStart = () => {
      controls.autoRotate = false;
      if (resumeTimeout) clearTimeout(resumeTimeout);
    };

    const onEnd = () => {
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => (controls.autoRotate = true), 3000);
    };

    try {
      controls.addEventListener('start', onStart);
      controls.addEventListener('end', onEnd);
    } catch (e) {}

    return () => {
      events.forEach((ev) => canvasEl?.removeEventListener(ev, pauseAutoRotate));
      try {
        controls.removeEventListener('start', onStart);
        controls.removeEventListener('end', onEnd);
      } catch (e) {}
      if (resumeTimeout) clearTimeout(resumeTimeout);
    };
  }, [globeRef.current]);

  const handleCountryClick = (feature: CountryFeature) => {
    if (!feature) return;
    const props = feature.properties;

    if (selectedCountry && selectedCountry.name === props.name && isZoomed) {
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2 }, 800);
      setIsZoomed(false);
      setSelectedCountry(null);
      return;
    }

    const { lat, lng, latSpan, lngSpan } = computeCentroidAndSpan(feature);
    const altitude = calculateZoomAltitude(latSpan, lngSpan);

    setSelectedCountry(props);
    globeRef.current.pointOfView({ lat, lng, altitude }, 900);
    setIsZoomed(true);
  };

  return (
    <div className="relative w-full h-screen" style={{ background: '#F8FAFB' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={countries.features}
        polygonAltitude={(d: any) => (d === hoveredCountry ? 0.04 : 0.01)}
        polygonCapColor={(d: any) => {
          const base = getCountryColor(d.properties.taxRate);
          if (
            hoveredCountry &&
            hoveredCountry.properties &&
            hoveredCountry.properties.name ===
              (d.properties.name || d.properties.ADMIN || d.properties.NAME)
          ) {
            return brightenColor(base);
          }
          return base;
        }}
        polygonSideColor={() => 'rgba(75,103,117,0.18)'}
        polygonStrokeColor={() => '#ffffff'}
        onPolygonHover={setHoveredCountry}
        onPolygonClick={handleCountryClick}
        polygonsTransitionDuration={200}
        enableZoom={true}
        enablePointerInteraction={true}
      />

      <Legend />

      {hoveredCountry && (
        <div
          className="absolute text-[#2D3E50] text-sm bg-white rounded px-3 py-1 shadow pointer-events-none"
          style={{ left: '50%', top: 20, transform: 'translateX(-50%)' }}
        >
          {hoveredCountry.properties.name}
        </div>
      )}

      {selectedCountry && (
        <CountryPopup
          country={selectedCountry}
          flagUrl={flagUrl}
          trendData={trendData}
          onClose={() => handleCountryClick({ properties: selectedCountry } as CountryFeature)}
        />
      )}
    </div>
  );
};

export default GlobeVisualization;
