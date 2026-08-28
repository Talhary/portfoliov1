"use client";

import React, { useState, useRef, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Phone, 
  Globe, 
  Star, 
  Download, 
  Radio, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  FileSpreadsheet,
  FileJson,
  ExternalLink,
  Layers,
  Copy,
  Check,
  Table as TableIcon,
  LayoutGrid,
  Clock,
  Tag,
  DollarSign,
  Navigation,
  Eye,
  X,
  Mail,
  Compass
} from 'lucide-react';

export function GooglePlacesStreamWidget() {
  const [query, setQuery] = useState('dentists in new york');
  const [limit, setLimit] = useState<number>(20);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cards, setCards] = useState<Record<string, any>[]>([]);
  const [streamStatus, setStreamStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCard, setSelectedCard] = useState<Record<string, any> | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Helper resolvers for field variants
  const getPhone = (c: Record<string, any>) => c.phone || c.phoneNumber || c.telephone || c.tel || '';
  const getWebsite = (c: Record<string, any>) => c.website || c.site || c.domain || c.link || c.web || '';
  const getAddress = (c: Record<string, any>) => c.address || c.formattedAddress || c.fullAddress || c.location || '';
  const getRating = (c: Record<string, any>) => c.rating ?? c.stars ?? null;
  const getReviewCount = (c: Record<string, any>) => c.reviewCount ?? c.reviewsCount ?? c.reviews ?? c.totalReviews ?? c.user_ratings_total ?? null;
  const getCategory = (c: Record<string, any>) => c.category || c.type || (Array.isArray(c.categories) ? c.categories.join(', ') : '') || '';
  const getHours = (c: Record<string, any>) => c.hours || c.status || c.openingHours || (c.openNow === true ? 'Open now' : c.openNow === false ? 'Closed' : '') || '';
  const getPrice = (c: Record<string, any>) => c.price || c.priceRange || c.priceLevel || '';
  const getEmail = (c: Record<string, any>) => c.email || (Array.isArray(c.emails) ? c.emails.join(', ') : '') || '';
  const getCoordinates = (c: Record<string, any>) => {
    if (c.latitude && c.longitude) return `${c.latitude}, ${c.longitude}`;
    if (c.lat && c.lng) return `${c.lat}, ${c.lng}`;
    if (c.coordinates) return typeof c.coordinates === 'object' ? JSON.stringify(c.coordinates) : c.coordinates;
    return '';
  };
  const getMapsUrl = (c: Record<string, any>) => {
    if (c.googleMapsUrl || c.mapsUrl || c.googleUrl || c.placeUrl) {
      return c.googleMapsUrl || c.mapsUrl || c.googleUrl || c.placeUrl;
    }
    if (c.placeId) {
      return `https://www.google.com/maps/place/?q=place_id:${c.placeId}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((c.name || '') + ' ' + getAddress(c))}`;
  };

  // Start Real-Time SSE Stream
  const startStream = () => {
    if (!query.trim()) {
      setError('Please provide a Google Maps search query.');
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setCards([]);
    setError(null);
    setIsStreaming(true);
    setStreamStatus('Initializing headless browser pool...');

    const params = new URLSearchParams({
      query: query.trim(),
      limit: limit.toString(),
    });

    const es = new EventSource(`/api/portfolio/places/stream?${params.toString()}`);
    eventSourceRef.current = es;

    es.onopen = () => {
      setStreamStatus('Connected. Scrolling Google Maps in headless Chromium session...');
    };

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'batch' && Array.isArray(payload.cards)) {
          setCards((prev) => [...prev, ...payload.cards]);
          setStreamStatus(`Harvested ${payload.total || payload.cards.length} leads in real time...`);
        } else if (payload.type === 'done') {
          setStreamStatus(`Stream completed. Extracted ${payload.total || 'all'} leads.`);
          setIsStreaming(false);
          es.close();
        } else if (payload.error) {
          setError(payload.error);
          setIsStreaming(false);
          es.close();
        }
      } catch (e) {
        console.error('Error parsing SSE event data:', e);
      }
    };

    es.onerror = (err) => {
      console.error('SSE Stream error:', err);
      setError('Stream disconnected or completed.');
      setIsStreaming(false);
      es.close();
    };
  };

  const stopStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
    setStreamStatus('Stream stopped by user.');
  };

  // Collect all unique keys dynamically across all received card objects for complete CSV export
  const allKeys = useMemo(() => {
    const keySet = new Set<string>();
    cards.forEach((c) => Object.keys(c).forEach((k) => keySet.add(k)));
    return Array.from(keySet);
  }, [cards]);

  // Export to Comprehensive CSV
  const exportCsv = () => {
    if (cards.length === 0) return;
    const headers = allKeys;
    const rows = cards.map((c) =>
      headers.map((h) => {
        const val = c[h];
        if (val === undefined || val === null) return '""';
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      })
    );
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `google_places_${query.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export to JSON
  const exportJson = () => {
    if (cards.length === 0) return;
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `google_places_${query.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full space-y-8">
      {/* Stream Control Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <Radio size={14} className={isStreaming ? 'animate-pulse text-red-500' : ''} /> Real-Time SSE Streamer
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Google Places Real-Time Lead Scraper
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
                Stream verified B2B leads live over Server-Sent Events with full attributes (Phone, Category, Reviews, Hours, Website, Address, Maps Link) with instant CSV & JSON export.
              </p>
            </div>

            {/* Export & View Mode Actions */}
            {cards.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      viewMode === 'grid'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                    title="Grid Card View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      viewMode === 'table'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                    title="Data Table View"
                  >
                    <TableIcon size={15} />
                  </button>
                </div>

                <button
                  onClick={exportCsv}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition shadow-xs"
                >
                  <FileSpreadsheet size={15} /> Export CSV ({cards.length})
                </button>
                <button
                  onClick={exportJson}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-bold transition shadow-xs"
                >
                  <FileJson size={15} /> JSON
                </button>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-1.5">
                  Search Query & Location
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isStreaming}
                    placeholder="e.g. software companies in Austin TX, dentists in Miami..."
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-1.5">
                  Lead Limit ({limit})
                </label>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  disabled={isStreaming}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                >
                  <option value={10} className="dark:bg-zinc-900">10 Leads</option>
                  <option value={20} className="dark:bg-zinc-900">20 Leads</option>
                  <option value={50} className="dark:bg-zinc-900">50 Leads</option>
                  <option value={100} className="dark:bg-zinc-900">100 Leads</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isStreaming ? (
                <button
                  onClick={startStream}
                  className="w-full sm:w-auto h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl px-8 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.35)] active:scale-98 transition duration-200"
                >
                  <Radio size={18} />
                  <span>Start Real-Time Lead Stream</span>
                </button>
              ) : (
                <button
                  onClick={stopStream}
                  className="w-full sm:w-auto h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl px-8 flex items-center justify-center gap-2 shadow-lg active:scale-98 transition duration-200"
                >
                  <Loader2 size={18} className="animate-spin" />
                  <span>Stop Stream ({cards.length} harvested)</span>
                </button>
              )}
            </div>
          </div>

          {/* Status Bar */}
          {streamStatus && (
            <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-300 font-mono">
              {isStreaming && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />}
              <span>{streamStatus}</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start gap-3 text-xs sm:text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Results Grid / Table Display */}
          {cards.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Harvested Places ({cards.length})
                </h3>
              </div>

              {viewMode === 'grid' ? (
                /* Rich Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cards.map((card, idx) => {
                    const phone = getPhone(card);
                    const website = getWebsite(card);
                    const address = getAddress(card);
                    const rating = getRating(card);
                    const reviews = getReviewCount(card);
                    const category = getCategory(card);
                    const hours = getHours(card);
                    const price = getPrice(card);
                    const email = getEmail(card);
                    const mapsUrl = getMapsUrl(card);
                    const coords = getCoordinates(card);

                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/90 flex flex-col justify-between gap-4 transition-all duration-200 hover:border-primary/50 shadow-xs group"
                      >
                        <div className="space-y-3">
                          {/* Header: Category & Rating & Price */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {category && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                                  <Tag size={10} /> {category}
                                </span>
                              )}
                              {price && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                  {price}
                                </span>
                              )}
                              {hours && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  hours.toLowerCase().includes('open')
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                }`}>
                                  <Clock size={10} className="inline mr-1" />
                                  {hours}
                                </span>
                              )}
                            </div>

                            {rating !== null && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md shrink-0 border border-amber-500/20">
                                <Star size={12} className="fill-amber-500 text-amber-500" />
                                <span>{rating}</span>
                                {reviews !== null && <span className="text-zinc-400 font-normal">({reviews})</span>}
                              </span>
                            )}
                          </div>

                          {/* Business Name */}
                          <h4 className="font-extrabold text-base text-zinc-900 dark:text-white leading-snug group-hover:text-primary transition-colors">
                            {card.name}
                          </h4>

                          {/* Address */}
                          {address && (
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-start gap-1.5 font-light">
                              <MapPin size={14} className="shrink-0 text-zinc-400 mt-0.5" />
                              <span className="line-clamp-2">{address}</span>
                            </div>
                          )}

                          {/* Details Metadata Rows */}
                          <div className="space-y-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs">
                            {phone && (
                              <div className="flex items-center justify-between gap-2 text-zinc-700 dark:text-zinc-300">
                                <div className="flex items-center gap-1.5 truncate">
                                  <Phone size={13} className="text-emerald-500 shrink-0" />
                                  <a href={`tel:${phone}`} className="hover:underline font-mono">
                                    {phone}
                                  </a>
                                </div>
                                <button
                                  onClick={() => copyText(phone, `phone-${idx}`)}
                                  className="text-zinc-400 hover:text-primary transition p-1"
                                  title="Copy phone"
                                >
                                  {copiedKey === `phone-${idx}` ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                                </button>
                              </div>
                            )}

                            {email && (
                              <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 truncate">
                                <Mail size={13} className="text-blue-500 shrink-0" />
                                <a href={`mailto:${email}`} className="hover:underline font-mono truncate">
                                  {email}
                                </a>
                              </div>
                            )}

                            {website && (
                              <div className="flex items-center gap-1.5 text-primary truncate">
                                <Globe size={13} className="shrink-0" />
                                <a
                                  href={website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline truncate font-mono text-[11px]"
                                >
                                  {website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                </a>
                              </div>
                            )}

                            {coords && (
                              <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono">
                                <Compass size={12} className="shrink-0" />
                                <span>{coords}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs">
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline font-semibold text-xs"
                          >
                            <Navigation size={13} />
                            <span>Google Maps</span>
                            <ExternalLink size={11} />
                          </a>

                          <button
                            onClick={() => setSelectedCard(card)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 hover:bg-primary hover:text-white text-zinc-700 dark:text-zinc-300 font-bold text-[11px] transition flex items-center gap-1"
                          >
                            <Eye size={12} />
                            <span>All Data</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Full Spreadsheet-like Table View */
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto bg-white dark:bg-zinc-950 shadow-md">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3">Reviews</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Website</th>
                        <th className="p-3">Address</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                      {cards.map((card, idx) => {
                        const phone = getPhone(card);
                        const website = getWebsite(card);
                        const address = getAddress(card);
                        const rating = getRating(card);
                        const reviews = getReviewCount(card);
                        const category = getCategory(card);
                        const mapsUrl = getMapsUrl(card);

                        return (
                          <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                            <td className="p-3 font-mono text-zinc-400">{idx + 1}</td>
                            <td className="p-3 font-bold text-zinc-900 dark:text-white whitespace-nowrap">
                              {card.name}
                            </td>
                            <td className="p-3">
                              {rating !== null ? (
                                <span className="inline-flex items-center gap-1 text-amber-500 font-bold font-mono">
                                  <Star size={11} className="fill-amber-500" /> {rating}
                                </span>
                              ) : '-'}
                            </td>
                            <td className="p-3 font-mono text-zinc-500">{reviews ?? '-'}</td>
                            <td className="p-3 font-mono text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                              {phone ? (
                                <a href={`tel:${phone}`} className="hover:underline">
                                  {phone}
                                </a>
                              ) : '-'}
                            </td>
                            <td className="p-3 text-zinc-500 whitespace-nowrap">{category || '-'}</td>
                            <td className="p-3 max-w-[160px] truncate">
                              {website ? (
                                <a
                                  href={website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-mono"
                                >
                                  {website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                </a>
                              ) : '-'}
                            </td>
                            <td className="p-3 max-w-[220px] truncate text-zinc-500">
                              {address || '-'}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <a
                                  href={mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:text-primary text-zinc-600 dark:text-zinc-300"
                                  title="View on Google Maps"
                                >
                                  <Navigation size={13} />
                                </a>
                                <button
                                  onClick={() => setSelectedCard(card)}
                                  className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:text-primary text-zinc-600 dark:text-zinc-300"
                                  title="Inspect Full JSON"
                                >
                                  <Eye size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Full Data Raw JSON Inspector Modal */}
          {selectedCard && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
                      {selectedCard.name || 'Lead Attributes Inspector'}
                    </h3>
                    <p className="text-xs text-zinc-400 font-light">Complete raw data attributes extracted by headless crawler.</p>
                  </div>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-500 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                  {Object.entries(selectedCard).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <span className="font-mono font-bold text-primary">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-zinc-700 dark:text-zinc-300 break-all">
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </span>
                        <button
                          onClick={() => copyText(typeof val === 'object' ? JSON.stringify(val) : String(val), key)}
                          className="text-zinc-400 hover:text-primary transition shrink-0 p-1"
                          title="Copy field value"
                        >
                          {copiedKey === key ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Close Inspector
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
