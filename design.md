# Local Mart — Design Spec (Home Screen)

A hyperlocal shopping app: groceries, vegetables & livestock, local shops, medicines and services from sellers near the user. This file is the source of truth for the home screen's look and layout. Follow it exactly; where something is marked `[PLACEHOLDER]`, wire it to real data or config.

---

## 1. Design tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| `brand` | `#1E4D3A` | Header background, active nav icon/text, primary icon color |
| `brand-tint` | `#E6F0E1` | Active nav pill, vegetable tiles, icon chips |
| `accent` | `#F4B23E` | Festive banner bg, selected category underline, "Local Mart" eyebrow |
| `accent-ink` | `#2A1A04` | Text + button on accent banner |
| `bg` | `#F6F4EE` | App background (warm off-white) |
| `surface` | `#FFFFFF` | Search bar, cards, bottom nav, delivery bar |
| `text` | `#1B1D1A` | Primary text |
| `text-muted` | `#4D514B` | Secondary text |
| `text-nav` | `#3E423C` | Inactive nav labels/icons |
| `on-brand` | `#FFFFFF` | Text on header (selected chip) |
| `on-brand-muted` | `#E4EEE8` | Unselected category chips on header |
| `border` | `#DEDCD5` | Hairlines, dismiss button border |
| `divider` | `#D9D7D0` | Divider inside search bar |
| `badge` | `#D9412B` | "NEW" badge |
| `ink-dark` | `#141613` | Wallet balance pill |

Service-card tints (bg / title / subtitle):
- Vegetables & Livestock: `#DDEFD9` / `#173B12` / `#2E5527`
- Local Shops: `#FBE5C8` / `#4A2A05` / `#6A4512`
- Medicines: `#D8E7F5` / `#0F2E4C` / `#24476A`
- Services: `#E8DFF3` / `#34184F` / `#50316E`

Product-tile tints (bg / icon):
- Vegetables: `#E6F0E1` / `#3F6B35`
- Livestock, Meat & Fish: `#F5E3DC` / `#8A3B22`
- Snacks & Drinks: `#FBEBC9` / `#8A5A0B`

Shadow (floating bars): `0 4px 18px rgba(20,30,20,0.12)`

### Typography
- Font: **Plus Jakarta Sans** (Google Fonts, weights 400/500/600/700/800). Fallback: system sans.
- Scale:
  - Hero line ("From shops near you"): 26 / 800 / line-height 1.15
  - Section heading (h2): 20 / 800
  - Banner title: 22 / 800 / 1.15
  - Service card title: 17 / 800 / 1.2
  - Body / location / search: 15–16 / 500
  - Delivery bar title: 15 / 800; subtitle 13 / 400
  - "See all" link: 14 / 700, color `brand`
  - Tile label, chip label, nav label: 12 / 600 (selected chip 700, active nav 800)
  - Eyebrow ("LOCAL MART", "FESTIVE SPECIAL"): 12–13 / 800, uppercase, letter-spacing 0.08em
  - Badge: 9–11 / 700–800

### Spacing & shape
- Screen side padding: 16px. Section gap: 26px. Header top padding: 22px; header internal gap 14px.
- Radii: search 14, cards/banner 18, product tiles 16, bottom nav 26 (items 20), round buttons = full circle.
- Touch targets ≥ 44px. Search bar height 52. Header icon buttons 48×48.
- Icons: outline/stroke style, 1.6–2px stroke, rounded caps & joins (e.g. Lucide). No emoji.
- Reference frame: 390px wide phone.

---

## 2. Screen structure (top → bottom)

### 2.1 Header (bg `brand`, white text)
1. **Top row** — left column, right buttons:
   - Eyebrow `LOCAL MART` (accent color).
   - Hero line `From shops near you`.
   - **Location console** button: pin icon + `Home · Ulubari, Guwahati` [PLACEHOLDER: user's saved address] + chevron-down. Opens address picker.
   - Right: **Wallet** button (48px circle, translucent white bg `rgba(255,255,255,0.12)`, 1.5px border `rgba(255,255,255,0.35)`, wallet icon) with a dark pill `₹0` [PLACEHOLDER: wallet balance] overlapping its bottom edge. Then **Profile** button (48px white circle, user icon in `brand`).
2. **Search bar** — white, radius 14, height 52: search icon, input with rotating placeholder (e.g. `Search "fresh rohu fish"`), 1px divider, mic button (voice search). Must have an accessible label.
3. **Category strip** — horizontal scroll, no scrollbar, bleeds to screen edges. Each chip: 24px icon above a 12px label, ~72–80px wide. Selected chip: white, bold, 44×4px accent underline at the bottom (rounded top corners). Unselected: `on-brand-muted`.
   - Chips (store-wide, regardless of seller): **All**, **Durga Puja** (red `NEW` badge), **Offers**, **Electronics**, **Beauty**, **Decor**, **Kids**, **Local Made**. Make this list data-driven — festive chips change by season.

### 2.2 Festive banner (bg `accent`, radius 18, padding 18)
- Eyebrow `FESTIVE SPECIAL`, title `Durga Puja picks from local sellers`, subtitle `Puja samagri, new clothes, mishti`.
- Right: dark pill button `Shop` (bg `accent-ink`, white text, height 44). Banner content should be CMS/config-driven.

### 2.3 "What do you need today?" — 4 service cards
2×2 grid, gap 12. Each card: radius 18, padding 16, min-height 128, icon (34px) top, title + one-line subtitle bottom. Each is a link to its section.
- **Vegetables & Livestock** — "Fresh from local farms"
- **Local Shops** — "Kirana, bakeries & more"
- **Medicines** — "From nearby pharmacies"
- **Services** — "Electricians, tailors, repairs"

### 2.4 Product category rails (repeat per section)
Header row: h2 left, `See all` link right. Below: **4-column grid, 2 rows (8 items)**, gap 14 vertical / 10 horizontal. Each tile: square image box (radius 16, tinted bg) + centered 12px label underneath (wraps to 2 lines max).
Product images replace the placeholder icons — use real product photos (transparent PNG / object-fit: contain) on the tinted bg.
- **Vegetables:** Onion, Potato, Tomato, Leafy Greens, Brinjal, Green Chilli, Cauliflower, Fresh Fruits
- **Livestock, Meat & Fish:** Desi Chicken, Duck, Farm Eggs, Rohu Fish, Goat Meat, Pork, Pigeon, Dry Fish
- **Snacks & Drinks:** Chips & Namkeen, Biscuits, Cold Drinks, Juices, Tea & Coffee, Mishti, Pitha, Ice Cream
Sections and their items should come from the backend/category API, not be hard-coded.

### 2.5 Floating bottom area (sticky, 12px side margin, 10px gap)
1. **Free-delivery bar** — white, radius 18, shadow. Left: 40px `brand-tint` circle with scooter icon. Text: `Get FREE delivery` / `on orders above ₹[AMOUNT]` [PLACEHOLDER: config]. Right: 44px round dismiss (×) button; dismissal persists for the session.
2. **Bottom nav** — white pill, radius 26, shadow, 4 equal columns: **Home** (active: `brand-tint` pill, `brand` color, 800), **Order Again**, **Categories**, **Cart**. Icon 24px above 12px label. Cart should show an item-count badge when non-empty.
Add bottom padding to the scroll content so the last rail isn't hidden behind these bars; respect safe-area insets.

---

## 3. Behavior
- Header scrolls away with content; consider keeping the search bar sticky once header leaves view.
- Category chip tap → filters/navigates to that category feed; selected state moves underline.
- Location tap → address sheet; wallet → wallet screen; profile → profile screen.
- All tappable cards/tiles are real buttons/links with focus states and accessible names; icon-only buttons need `aria-label` / accessibility labels.
- Text contrast ≥ 4.5:1 (all token pairs above meet it).
- Loading state: skeleton tiles in the same grid shapes.

## 4. Don'ts
- No gradients, emoji icons, or Inter/Roboto/Arial.
- Don't copy Blinkit branding or assets — layout pattern only.
- Don't hard-code prices, balances, or addresses.