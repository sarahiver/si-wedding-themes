// core/editors/AddressSearch.js
// Reusable Address Autocomplete für Admin-Editoren
// Google Places API – kein OSM/Photon Fallback mehr
//
// Usage:
//   <AddressSearch
//     components={C}
//     address="Musterstraße 1, Hamburg"
//     onSelect={({ address, lat, lng }) => { ... }}
//   />

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { loadGoogleMaps, isGoogleMapsAvailable } from '../../../../lib/googleMaps';

// ============================================
// COMPONENT
// ============================================

export default function AddressSearch({ components: C, address, onSelect, label, placeholder }) {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  // Google Maps laden
  useEffect(() => {
    if (!isGoogleMapsAvailable()) return;
    loadGoogleMaps()
      .then((maps) => {
        autocompleteService.current = new maps.places.AutocompleteService();
        placesService.current = new maps.places.PlacesService(document.createElement('div'));
        setIsReady(true);
      })
      .catch(() => {
        console.warn('Google Places nicht verfügbar');
      });
  }, []);

  // Klick außerhalb
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Google-Suche
  const fetchSuggestions = useCallback((input) => {
    if (!isReady || !autocompleteService.current || input.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    autocompleteService.current.getPlacePredictions(
      { input, types: ['address'], componentRestrictions: { country: ['de', 'at', 'ch'] } },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.slice(0, 5).map(p => ({
            id: p.place_id,
            mainText: p.structured_formatting?.main_text || '',
            subText: p.structured_formatting?.secondary_text || '',
            placeId: p.place_id,
          })));
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      }
    );
  }, [isReady]);

  const handleInput = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleSelect = async (suggestion) => {
    if (!placesService.current) return;

    setShowDropdown(false);
    setSearchValue('');
    setActiveIndex(-1);
    setIsLoading(true);

    placesService.current.getDetails(
      { placeId: suggestion.placeId, fields: ['geometry', 'formatted_address', 'address_components'] },
      (place, status) => {
        setIsLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const loc = place.geometry?.location;
          onSelect({
            address: place.formatted_address || suggestion.mainText,
            lat: loc?.lat() || null,
            lng: loc?.lng() || null,
          });
        }
      }
    );
  };

  // Keyboard
  const handleKeyDown = (e) => {
    if (!showDropdown || !suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(p => (p < suggestions.length - 1 ? p + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(p => (p > 0 ? p - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  useEffect(() => { setActiveIndex(-1); }, [suggestions]);

  const apiAvailable = isGoogleMapsAvailable();

  // Inline Styles (kompatibel mit allen Admin-Themes)
  const styles = {
    wrapper: { position: 'relative', marginBottom: '0.5rem' },
    labelRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' },
    badge: {
      fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: apiAvailable ? '#10B981' : '#F59E0B',
      background: apiAvailable ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
      padding: '0.15rem 0.4rem', borderRadius: '2px',
    },
    inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: {
      position: 'absolute', left: '0.75rem', color: 'rgba(255,255,255,0.3)',
      pointerEvents: 'none', display: 'flex', alignItems: 'center', zIndex: 1,
    },
    input: {
      width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.25rem',
      background: apiAvailable ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
      border: '1px dashed rgba(255,255,255,0.15)',
      borderRadius: '4px', color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem',
      fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
      opacity: apiAvailable ? 1 : 0.5,
      cursor: apiAvailable ? 'text' : 'not-allowed',
    },
    loading: {
      position: 'absolute', right: '0.75rem', color: 'rgba(255,255,255,0.3)',
      display: 'flex', alignItems: 'center',
      animation: 'spin 1s linear infinite',
    },
    dropdown: {
      position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
      background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: '6px', zIndex: 100, maxHeight: '240px', overflowY: 'auto',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    },
    item: (active) => ({
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.6rem 0.75rem', cursor: 'pointer', transition: 'background 0.15s',
      background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }),
    itemIcon: { color: 'rgba(255,255,255,0.3)', flexShrink: 0, display: 'flex' },
    mainText: { fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)' },
    subText: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    hint: {
      fontSize: '0.7rem', color: 'rgba(245,158,11,0.7)', fontStyle: 'italic', marginTop: '0.3rem',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.labelRow}>
        <C.Label style={{ marginBottom: 0 }}>{label || 'Adresse suchen'}</C.Label>
        <span style={styles.badge}>{apiAvailable ? 'Google Maps' : 'API-Key fehlt'}</span>
      </div>

      <div style={styles.inputWrap}>
        <span style={styles.icon}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length) setShowDropdown(true); }}
          placeholder={apiAvailable ? (placeholder || 'z.B. Schlossstraße 1, Heidelberg') : 'Google Maps API-Key in Vercel hinterlegen'}
          style={styles.input}
          disabled={!apiAvailable}
        />
        {isLoading && (
          <span style={styles.loading}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
            </svg>
          </span>
        )}
      </div>

      {!apiAvailable && (
        <div style={styles.hint}>
          REACT_APP_GOOGLE_MAPS_API_KEY in Vercel setzen für Autocomplete + Karten
        </div>
      )}

      {showDropdown && suggestions.length > 0 && (
        <div ref={dropdownRef} style={styles.dropdown}>
          {suggestions.map((s, idx) => (
            <div
              key={s.id}
              style={styles.item(idx === activeIndex)}
              onClick={() => handleSelect(s)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <span style={styles.itemIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={styles.mainText}>{s.mainText}</div>
                {s.subText && <div style={styles.subText}>{s.subText}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
