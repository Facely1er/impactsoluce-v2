import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';

interface GeographicMapProps {
  locations: {
    id: string;
    name: string;
    country: string;
    coordinates?: { lat: number; lng: number };
    riskScore?: number;
    esgScore?: number;
    tier?: number;
  }[];
  onLocationClick?: (location: any) => void;
}

// Simplified country coordinates for visualization (centroid approximations)
const COUNTRY_COORDINATES: Record<string, { x: number; y: number }> = {
  'Bangladesh': { x: 75, y: 45 },
  'China': { x: 85, y: 35 },
  'Brazil': { x: 35, y: 65 },
  'India': { x: 78, y: 30 },
  'Vietnam': { x: 88, y: 25 },
  'Thailand': { x: 85, y: 20 },
  'Indonesia': { x: 95, y: 15 },
  'Cambodia': { x: 87, y: 18 },
  'Ghana': { x: 48, y: 30 },
  'Côte d\'Ivoire': { x: 45, y: 28 },
  'Colombia': { x: 30, y: 50 },
  'Malaysia': { x: 90, y: 12 },
};

export default function GeographicMap({ locations, onLocationClick }: GeographicMapProps) {
  const { t } = useTranslation();

  const locationGroups = useMemo(() => {
    const groups: Record<string, typeof locations> = {};
    locations.forEach(loc => {
      if (!groups[loc.country]) {
        groups[loc.country] = [];
      }
      groups[loc.country].push(loc);
    });
    return groups;
  }, [locations]);

  const getRiskColor = (score?: number) => {
    if (!score) return '#9ca3af';
    if (score >= 70) return '#ef4444'; // red
    if (score >= 50) return '#f59e0b'; // yellow
    return '#10b981'; // green
  };

  const getTierColor = (tier?: number) => {
    switch (tier) {
      case 1: return '#3b82f6'; // blue
      case 2: return '#8b5cf6'; // purple
      case 3: return '#ec4899'; // pink
      default: return '#6b7280'; // gray
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] relative bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      {/* Simplified World Map Visualization */}
      <svg
        viewBox="0 0 200 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simplified continent outlines */}
        <g opacity="0.2">
          {/* Asia */}
          <path
            d="M 60 20 L 100 15 L 110 25 L 105 40 L 95 45 L 80 40 L 70 30 Z"
            fill="#3b82f6"
            stroke="#1e40af"
            strokeWidth="0.5"
          />
          {/* Africa */}
          <path
            d="M 45 25 L 55 20 L 58 35 L 55 50 L 50 55 L 45 50 L 42 40 Z"
            fill="#10b981"
            stroke="#047857"
            strokeWidth="0.5"
          />
          {/* Americas */}
          <path
            d="M 20 30 L 40 25 L 35 50 L 30 65 L 25 70 L 20 65 L 18 50 Z"
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="0.5"
          />
        </g>

        {/* Location markers */}
        {Object.entries(locationGroups).map(([country, locs]) => {
          const coords = COUNTRY_COORDINATES[country] || { x: 50, y: 50 };
          const avgRisk = locs.reduce((sum, l) => sum + (l.riskScore || 0), 0) / locs.length;
          const tier = locs[0]?.tier || 1;

          return (
            <g key={country}>
              {/* Marker circle */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={Math.max(3, Math.min(8, locs.length * 1.5))}
                fill={getRiskColor(avgRisk)}
                stroke={getTierColor(tier)}
                strokeWidth="1.5"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onLocationClick?.(locs[0])}
              />
              {/* Country label */}
              <text
                x={coords.x}
                y={coords.y - 5}
                textAnchor="middle"
                fontSize="2"
                fill="#374151"
                className="pointer-events-none"
                fontWeight="500"
              >
                {country}
              </text>
              {/* Count badge */}
              {locs.length > 1 && (
                <text
                  x={coords.x}
                  y={coords.y + 1}
                  textAnchor="middle"
                  fontSize="1.5"
                  fill="white"
                  className="pointer-events-none"
                  fontWeight="bold"
                >
                  {locs.length}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold mb-2 text-gray-900 dark:text-white">{t('Risk Level')}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600 dark:text-gray-400">{t('High (70+)')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600 dark:text-gray-400">{t('Medium (50-69)')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">{t('Low (<50)')}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-2 text-gray-900 dark:text-white">{t('Tier')}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">{t('Tier 1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-purple-500"></div>
                <span className="text-gray-600 dark:text-gray-400">{t('Tier 2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-pink-500"></div>
                <span className="text-gray-600 dark:text-gray-400">{t('Tier 3')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="absolute top-4 right-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-2 text-xs text-blue-800 dark:text-blue-200">
        <MapPin className="h-3 w-3 inline mr-1" />
        {t('Click markers to view supplier details')}
      </div>
    </div>
  );
}

