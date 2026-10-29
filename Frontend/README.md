# Careerly — Job-Seeker Platform for Cambodia

> *"Delivering innovative digital solutions that help unemployed to be hired."*  
> **Student project by Group 3, Phnom Penh, Cambodia** · [careerly.com](https://careerly.com)

Careerly is a streamlined web platform built for Cambodian university students, fresh graduates, and career switchers. It bridges the gap between local talent and hiring companies with three connected pillars:
1. **Smart CV Builder**: Professional English CV templates, real-time AI phrasing assistance, and a post-completion audit.
2. **Local Job Matching**: Direct connection to verified Cambodian employers and 1-click applications.
3. **Interview Preparation**: Practice question library and AI mock interviews (Premium at $2.99/mo).

---

## 🛠️ Tech Stack & Design Direction

- **Core**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 with bespoke editorial tokens
- **Typography**: `Fraunces` (Editorial Serif) & `Plus Jakarta Sans` / `Montserrat` (Clean Sans)
- **Icons**: `lucide-react` (clean line icons)
- **Palette**:
  - Canvas Cream: `#FAF8F4`
  - Charcoal Dark: `#2D2D2D`
  - Accent Orange: `#F46200`
  - Logo Red: `#D4111A` (strictly reserved for the brand mark)

---

## 📂 Project Structure

```
Frontend/
├── public/
│   ├── logo.svg              # Careerly SVG brand mark
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Sticky navigation, language toggle, primary action
│   │   ├── Hero.jsx          # Hero headline & live HTML/CSS CV preview with AI tooltip
│   │   ├── Problem.jsx       # 01 counter: 3 human problem statements
│   │   ├── Features.jsx      # 02 counter: Asymmetric bento grid of the 3 pillars
│   │   ├── WhoItIsFor.jsx    # 03 counter: Students, grads, and career switchers
│   │   ├── Pricing.jsx       # 04 counter: Free ($0) vs Premium ($2.99/mo)
│   │   ├── CTA.jsx           # Final call to action
│   │   └── Footer.jsx        # Attribution (Group 3, Phnom Penh), domain & links
│   ├── App.jsx               # Page assembly in exact pitch-deck order
│   ├── index.css             # Tailwind v4 theme configuration & base resets
│   └── main.jsx              # Application entry point
├── index.html                # Google Fonts, meta tags & page title
└── vite.config.js            # Vite configuration with Tailwind CSS plugin
```

---

## 🚀 Getting Started Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Start the local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```bash
npm run build
```
The optimized bundle will be generated in `dist/`.

---

## 🌐 How to Deploy

### Option 1: Vercel (Recommended)

1. Push this repository to GitHub or GitLab.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and set the **Root Directory** to `Frontend`.
4. Ensure the build settings are:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. Vercel will build and assign a production URL.

### Option 2: Netlify

1. Log in to [Netlify](https://netlify.com) and click **"Add new site"** → **"Import an existing project"**.
2. Select your Git provider and repository.
3. Configure the build parameters:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `Frontend/dist`
4. Click **Deploy Careerly**.
