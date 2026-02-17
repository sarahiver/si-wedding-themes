# S&I Wedding Themes - Multi-Theme Platform

Ein React-Projekt, das alle 6 Wedding-Themes in einer Anwendung vereint. Das Theme wird dynamisch basierend auf dem `project.theme` Feld in der Supabase-Datenbank gewählt.

## 🎨 Verfügbare Themes

| Theme | Stil | URL Pattern |
|-------|------|-------------|
| **Editorial** | Zeitlose Magazin-Ästhetik | `/demo?theme=editorial` |
| **Botanical** | Organisch & Natürlich | `/demo?theme=botanical` |
| **Contemporary** | Modern & Playful | `/demo?theme=contemporary` |
| **Luxe** | Opulent & Glamourös | `/demo?theme=luxe` |
| **Neon** | Bold & Digital | `/demo?theme=neon` |
| **Video** | Cineastisch & Dramatisch | `/demo?theme=video` |

## 🏗️ Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                     si-wedding-themes                        │
│                    (siwedding.de)                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  URL Request                                                │
│      │                                                      │
│      ▼                                                      │
│  ┌─────────────────┐                                        │
│  │   App.js        │ ← Routing                              │
│  └────────┬────────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐     ┌─────────────────┐                │
│  │ WeddingProvider │ ──▶ │    Supabase     │                │
│  │ (Context)       │     │  projects table │                │
│  └────────┬────────┘     └─────────────────┘                │
│           │                                                 │
│           │ project.theme = "luxe"                          │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │ ThemeRenderer   │ ← Wählt Theme-Komponenten              │
│  └────────┬────────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌────────────────────────────────────────────┐             │
│  │           themes/                          │             │
│  │  ┌────────┐ ┌────────┐ ┌────────┐         │             │
│  │  │editorial│ │botanical│ │  luxe  │ ...    │             │
│  │  │ Hero   │ │  Hero  │ │  Hero  │         │             │
│  │  │ Footer │ │ Footer │ │ Footer │         │             │
│  │  │  ...   │ │  ...   │ │  ...   │         │             │
│  │  └────────┘ └────────┘ └────────┘         │             │
│  └────────────────────────────────────────────┘             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Projektstruktur

```
si-wedding-themes/
├── public/
│   └── index.html          # Alle Theme-Fonts geladen
├── src/
│   ├── App.js              # Haupt-Routing
│   ├── index.js            # Entry Point
│   ├── components/
│   │   └── ThemeRenderer.js # Dynamischer Theme-Switcher
│   ├── context/
│   │   └── WeddingContext.js
│   ├── hooks/
│   │   ├── useWeddingData.js
│   │   └── useCloudinaryUpload.js
│   ├── lib/
│   │   └── supabase.js
│   └── themes/
│       ├── editorial/      # 23 Komponenten
│       ├── botanical/      # 22 Komponenten
│       ├── contemporary/   # 22 Komponenten
│       ├── luxe/          # 24 Komponenten
│       ├── neon/          # 24 Komponenten
│       └── video/         # 19 Komponenten
├── package.json
├── vercel.json
└── README.md
```

## 🔗 URL-Routing

### Standard-Routing (siwedding.de)
```
/                       → Landing Page (Demo)
/demo?theme=luxe        → Theme Demo
/:slug                  → Projekt laden (z.B. /pauli-mo)
/:slug/admin            → Kunden-Admin Dashboard
/:slug/std              → Save-the-Date Ansicht
/:slug/archiv           → Archiv-Ansicht (nach Hochzeit)
/:slug/preview          → Live-Vorschau
```

### Custom Domain Routing (z.B. pauliundmo.de)
```
/                       → Projekt mit custom_domain='pauliundmo.de'
/admin                  → Kunden-Admin Dashboard
/std                    → Save-the-Date
/archiv                 → Archiv
```

## 🗄️ Supabase Schema

### projects Tabelle
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR UNIQUE NOT NULL,
  custom_domain VARCHAR,
  couple_names VARCHAR NOT NULL,
  wedding_date DATE,
  theme VARCHAR DEFAULT 'editorial',  -- ← Theme-Auswahl
  status VARCHAR DEFAULT 'live',       -- live, std, archiv
  active_components TEXT[],            -- ['hero', 'countdown', 'rsvp', ...]
  package VARCHAR,                     -- klassik, signature, couture
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### project_content Tabelle
```sql
CREATE TABLE project_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  component_name VARCHAR NOT NULL,     -- 'hero', 'countdown', etc.
  content JSONB NOT NULL,              -- Komponentendaten
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Vercel
```bash
# Installieren
npm install -g vercel

# Deployen
vercel

# Production
vercel --prod
```

### Environment Variables
```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

### Custom Domain Setup
1. In Vercel: Settings → Domains → Add Domain
2. DNS bei Strato/Cloudflare: CNAME → cname.vercel-dns.com
3. In Supabase: `UPDATE projects SET custom_domain = 'pauliundmo.de' WHERE slug = 'pauli-mo'`

## 🔄 Workflow

### 1. SuperAdmin erstellt Projekt
```
si-superadmin.vercel.app
  ↓
  Neues Projekt anlegen
  - Slug: pauli-mo
  - Theme: luxe
  - Paket: Signature
  - Komponenten auswählen
  ↓
  → Speichert in Supabase
```

### 2. Kunden-Admin befüllt Content
```
siwedding.de/pauli-mo/admin
  ↓
  - Hero-Bild hochladen (Cloudinary)
  - Timeline befüllen
  - RSVP konfigurieren
  ↓
  → Speichert in project_content
```

### 3. Website geht live
```
siwedding.de/pauli-mo
  oder
pauliundmo.de
  ↓
  ThemeRenderer lädt "luxe" Theme
  ↓
  Zeigt personalisierte Hochzeitswebsite
```

## 🛠️ Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Development Server starten
npm start

# Build erstellen
npm run build
```

## 📝 Anpassungen an Themes

Die Theme-Komponenten wurden so angepasst, dass sie:

1. **Daten aus Supabase** akzeptieren (via `config` oder `data` prop)
2. **Fallback-Werte** haben für fehlende Daten
3. **isComponentActive()** respektieren für bedingte Anzeige

### Props für Komponenten
```jsx
// Jede Komponente erhält:
<Hero 
  config={config}        // Komplett-Objekt
  data={config}          // Alias für Legacy-Kompatibilität
  name1="Pauli"          // Einzelne Props (Editorial)
  content={content.hero} // Content-Objekt (für einige Themes)
/>
```

## 🎯 Nächste Schritte

- [ ] Marketing Site iframes auf `/demo?theme=X` umstellen
- [ ] Theme-Komponenten vollständig auf Supabase-Daten anpassen
- [ ] AdminDashboard für alle Themes vereinheitlichen
- [ ] Cloudinary Upload in alle Themes integrieren
- [ ] Tests für Theme-Switching

---

© 2025 S&I Wedding by IverLasting
