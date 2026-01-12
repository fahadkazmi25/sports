# 🏆 ApexSports | Premium Cinematic Match Experience

ApexSports is a high-performance sports platform built with **Next.js 15**, **TypeScript**, and **Framer Motion**. It provides a premium, visually engaging interface for exploring global match data with real-time intelligence.

---

## 🚀 Requirement Status & Implementation Map

Below is a detailed breakdown of the project requirements, their fulfillment status, and where they have been applied in the codebase.

### **1. Core Data Handling**
| Requirement | Status | Location |
| :--- | :---: | :--- |
| Consume cached JSON response | ✅ | `response.json` & `app/api/matches/route.ts` |
| Read-only Production API simulation | ✅ | `app/api/matches/route.ts` |
| Handle non-normalized league names | ✅ | Logic in `route.ts` using slugification & normalization |
| Graceful missing data handling | ✅ | `components/match-card.tsx` (Default values e.g., "TBD") |

### **2. Homepage Experience**
| Requirement | Status | Location |
| :--- | :---: | :--- |
| Hero Section (Headline & Description) | ✅ | `components/hero.tsx` |
| Today's Matches Filter | ✅ | `app/page.tsx` (Toggle) & `route.ts` (API logic) |
| Dynamic League Filter Buttons | ✅ | `app/page.tsx` (Matches Section) |
| Top Leagues (Elite) Selection | ✅ | `app/page.tsx` (Bento Grid Section) |
| Animated Elements | ✅ | `components/match-card.tsx` & `components/hero.tsx` |
| Basic Footer Navigation | ✅ | `app/layout.tsx` (Footer section) |

### **3. League Detail Pages (/league/name)**
| Requirement | Status | Location |
| :--- | :---: | :--- |
| Dynamic League Routes | ✅ | `app/league/[slug]/page.tsx` |
| List Matches (Home vs Away + Time) | ✅ | `app/league/[slug]/page.tsx` using `MatchCard` |
| Sorting (Kickoff Time/Status/Alphabetical) | ✅ | `app/league/[slug]/page.tsx` (Sidebar Component) |
| Item-level entry animations | ✅ | `components/match-card.tsx` |
| Mobile-optimized Hero Section | ✅ | `app/league/[slug]/page.tsx` (Responsive Hero logic) |

### **4. Global Match Search**
| Requirement | Status | Location |
| :--- | :---: | :--- |
| Search by Team Name (Home/Away/League) | ✅ | `components/search-overlay.tsx` |
| Instant Filtering | ✅ | `components/search-overlay.tsx` |
| Debounced Input (400ms) | ✅ | `components/search-overlay.tsx` |
| Matched Text Highlighting | ✅ | `components/match-card.tsx` (`highlight` prop) |
| URL Synchronization (`?q=query`) | ✅ | `components/search-overlay.tsx` |
| Keyboard Accessibility (Esc to close) | ✅ | `components/search-overlay.tsx` |

### **5. UI / UX & Technical Expectations**
| Requirement | Status | Location |
| :--- | :---: | :--- |
| Sporty Look & Premium Feel | ✅ | `globals.css` (Glassmorphism, Sporty Gradients) |
| Dark Mode Support | ✅ | `app/layout.tsx` (ThemeProvider) |
| Responsive Layouts (Mobile/Tablet/PC) | ✅ | All components (Tailwind CSS breakpoints) |
| Loading States (Skeletons) | ✅ | `components/match-card.tsx` (`MatchSkeleton`) |
| Empty & Error States | ✅ | `app/page.tsx`, `not-found.tsx`, & `error.tsx` |
| High-performance rendering | ✅ | `app/page.tsx` (Infinite scroll/Intersection Observer) |

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Vanilla CSS approach for flexibility)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** 
  - `Tourney` (Sporty Display)
  - `Outfit` (Modern Body Text)
- **Theming:** Next-Themes (Dark Mode prioritized)

---

## 🏃‍♂️ Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📌 Notable Technical Features

- **SEO Optimized:** Page-level metadata is dynamically generated for league pages.
- **Efficient API:** The backend API handles complex normalization of the `response.json` to ensure clean slugs regardless of special characters in the raw data.
- **Glassmorphism UI:** A custom glassmorphism design system is implemented via Tailwind utilities for a futuristic, arcade-like sports feel.
- **Refined Navigation:** A "pill" shaped sticky navbar that separates its mobile menu for better UX on smaller screens.

---

## 🔌 Diagnostic & Error Pages

To ensure maximum resilience and a polished user experience, the application includes custom-designed error states:

- **Cinematic 404 Page (`app/not-found.tsx`):** A custom "Off Target" experience featuring construction-themed glass cards and high-contrast typography to guide lost users back to the home pitch.
- **Global Error Boundary (`app/error.tsx`):** A "Match Interrupted" interface that captures runtime errors. It features a themed VAR (Video Assistant Referee) message and a "Replay Query" button to attempt a component reset without refreshing the page.
- **Test Error Route (`app/test-error/page.tsx`):** A dedicated diagnostic route used during development to verify the appearance and functionality of the global error boundary.
