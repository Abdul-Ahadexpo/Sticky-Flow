import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, MapPin, Globe, Monitor, Smartphone } from 'lucide-react';
import { VisitorData } from '../types';

interface VisitorCardProps {
  visitor: VisitorData;
  onDelete: (id: string) => void;
}

export default function VisitorCard({ visitor, onDelete }: VisitorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete visitor record for "${visitor.name}"? This action is permanent.`)) {
      onDelete(visitor.id);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden hover:border-yellow-400 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-gray-900 font-bold text-lg">
                {getInitials(visitor.name)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{visitor.name}</h3>
              <p className="text-xs text-gray-400 font-date-text">
                {formatTimestamp(visitor.timestamp)}
              </p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete visitor"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {visitor.isMobile ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
              <Smartphone className="w-3 h-3" />
              Mobile
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs">
              <Monitor className="w-3 h-3" />
              Desktop
            </span>
          )}

          {visitor.geo && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">
              <MapPin className="w-3 h-3" />
              Location Shared
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
            <Globe className="w-3 h-3" />
            {visitor.browserName}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show Details
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-700 p-4 bg-gray-900/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <DataRow label="User Agent" value={visitor.userAgent} />
            <DataRow label="Platform" value={visitor.platform} />
            <DataRow label="Device Info" value={visitor.deviceInfo} />
            <DataRow label="Screen Size" value={`${visitor.screen.w} × ${visitor.screen.h}`} />
            <DataRow label="Viewport Size" value={`${visitor.viewport.w} × ${visitor.viewport.h}`} />
            <DataRow label="Language" value={visitor.language} />
            <DataRow label="Timezone" value={visitor.timezone} />
            <DataRow label="IP Address" value={visitor.ipAddress || 'N/A'} />
            <DataRow label="Referrer" value={visitor.pageReferrer} />
            <DataRow label="Cookies Enabled" value={visitor.cookiesEnabled ? 'Yes' : 'No'} />

            {visitor.deviceMemory && (
              <DataRow label="Device Memory" value={`${visitor.deviceMemory} GB`} />
            )}

            {visitor.hardwareConcurrency && (
              <DataRow label="CPU Cores" value={visitor.hardwareConcurrency.toString()} />
            )}

            <DataRow label="Touch Support" value={visitor.touchSupport ? 'Yes' : 'No'} />

            {visitor.connection && (
              <DataRow
                label="Connection"
                value={`${visitor.connection.type}${
                  visitor.connection.downlink ? ` (${visitor.connection.downlink} Mbps)` : ''
                }`}
              />
            )}

            {visitor.battery && (
              <DataRow
                label="Battery"
                value={`${Math.round(visitor.battery.level * 100)}% ${
                  visitor.battery.charging ? '(Charging)' : ''
                }`}
              />
            )}

            {visitor.geo ? (
              <DataRow
                label="Geolocation"
                value={`${visitor.geo.lat.toFixed(4)}, ${visitor.geo.lng.toFixed(4)}`}
              />
            ) : (
              <DataRow label="Geolocation" value={`Not shared (${visitor.geoPermission})`} />
            )}

            <div className="col-span-1 md:col-span-2">
              <DataRow
                label="Consent"
                value={`Data: ${visitor.consent.deviceData ? 'Yes' : 'No'} | Geo: ${
                  visitor.consent.geo ? 'Yes' : 'No'
                }`}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <DataRow label="Visitor ID" value={visitor.id} mono />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DataRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <span className="text-gray-400 text-xs">{label}:</span>
      <p className={`text-white mt-1 ${mono ? 'font-mono text-xs' : ''} break-words`}>{value}</p>
    </div>
  );
}
