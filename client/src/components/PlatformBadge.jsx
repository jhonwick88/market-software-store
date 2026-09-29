import React from 'react';
import { Monitor, Smartphone, Globe, Laptop } from 'lucide-react';

export default function PlatformBadge({ platform, className = '' }) {
  switch (platform.toLowerCase()) {
    case 'windows':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 ${className}`}>
          <Monitor className="w-3.5 h-3.5" />
          Windows PC
        </span>
      );
    case 'android':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}>
          <Smartphone className="w-3.5 h-3.5" />
          Android APK
        </span>
      );
    case 'web-cloud':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 ${className}`}>
          <Globe className="w-3.5 h-3.5" />
          Cloud / Web
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 ${className}`}>
          <Laptop className="w-3.5 h-3.5" />
          {platform}
        </span>
      );
  }
}
