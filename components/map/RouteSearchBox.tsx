"use client";

import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { fetchGeocode, type GeocodeResult } from "@/lib/map/routing";

export function RouteSearchBox({
  onSelect,
}: {
  onSelect: (result: GeocodeResult) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebouncedValue(query.trim(), 400);

  useEffect(() => {
    if (!debouncedQuery) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setIsSearching(true);
      fetchGeocode(debouncedQuery, controller.signal)
        .then((found) => setResults(found))
        .catch((err) => {
          if (err.name !== "AbortError") setResults([]);
        })
        .finally(() => setIsSearching(false));
    }, 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [debouncedQuery]);

  function handleInputChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setIsSearching(false);
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="地名・住所で検索(例: 山中湖、箱根)"
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
      />
      {isSearching && (
        <p className="mt-1 text-xs text-gray-500">検索中...</p>
      )}
      {results.length > 0 && (
        <ul className="absolute z-[1000] mt-1 w-full rounded border border-gray-300 bg-white shadow-md">
          {results.map((result, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  onSelect(result);
                  setQuery(result.label);
                  setResults([]);
                }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                {result.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
