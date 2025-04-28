# Binpar Pokédex

A beautiful, fast and interactive Pokédex built with **T3 Stack**, **TypeScript**, **Next.js** and **TailwindCSS**, following minimal aesthetics.  
Designed for a smooth user experience with rich filtering, animated transitions, and clean UI components.

https://binpar-pokedex.vercel.app/

---

## 🛠️ Technologies Used

- **T3 Stack** 
- **Next.js 14** 
- **TypeScript**
- **TailwindCSS**
- **TanStack Query (React Query)**
- **PokéAPI**
- **p-limit** 

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/sergiokano/binpar-pokedex.git
cd binpar-pokedex

# Install dependencies
pnpm install

# Run the app
pnpm dev
```

---

## ✅ Technical Features

### 1⃣ Pokémon List: Name, Generation, Types...
- Main view displays all Pokémon, sorted by ID.
- Each card shows:
  - ✅ Name
  - ✅ Generation (translated)
  - ✅ Types (with emoji and color)
  - ✅ Official artwork

### 2⃣ Filters: Type & Generation
- Select dropdowns allow filtering by:
  - ✅ Type (styled & emoji)
  - ✅ Generation (user-friendly labels)

### 3⃣ Real-time Search (with evolutions)
- Real-time filtering as you type.
- Matches:
  - Pokémon names
  - Their **evolution chains** (e.g., searching `Pikachu` shows Pichu & Raichu).

### 4⃣ Pokémon Detail Page
- Full detail page with:
  - ✅ Name
  - ✅ Official image
  - ✅ Generation
  - ✅ Types
  - ✅ Evolutions

### 🐽 Navigation
- Clicking a Pokémon card opens its detail page **instantly**, with a **skeleton loading** fallback.
- Returning to list preserves **search and filters**.

---

## 🎨 UI & UX Highlights

- ⚡ Smooth staggered loading of cards
- 🧳 Skeleton screens on list and detail view
- 💅 Animated stat bars
- 🎯 Color-coded badges per Pokémon type
- 📱 Fully responsive layout
- 🎈 Clean design system

---

## 📂 Project Structure

```
/components
  /PokemonCard
  /Skeleton
  /FilterBar

/hooks
  useInfiniteQuery.ts
  useFullPokemonIndex.ts

/lib
  api.ts
  translations.ts
  pokemonStyles.ts

/server
  loadFullPokedex.ts
```

---

## 🧑‍💻 Author

**Sergio**  
[LinkedIn →](https://www.linkedin.com/in/sergiocano-fullstack)  
[GitHub →](https://github.com/sergiokano)

---

Made by Sergio for Binpar ✨

