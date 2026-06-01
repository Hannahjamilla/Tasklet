# Tasklet

> **Turning ‘I’ll do it later’ into ‘done’**

## 📖 Project Overview
Tasklet is a Student Productivity Hub, a purely frontend static web application designed to help students stay organized, focused, and motivated. This platform is built with performance and simplicity in mind, requiring no backend or database, and focuses on delivering an excellent user experience. 

## 🚀 Core Features

### 1. Study Tips & Time Management
- Highlights effective study techniques such as active recall and spaced repetition.
- Guides on time management strategies (e.g., Pomodoro technique, block scheduling).
- Clear, visual card-based layout to navigate content easily.

### 2. Pomodoro Timer
- A JavaScript-based visual timer for focused study sessions.
- Adjustable focus and break times (e.g., 25 focus / 5 break).
- Play, pause, and reset controls with a sleek UI.

### 3. Downloadable Planners & To-Do Lists
- Access to daily planners, weekly planners, and to-do list templates.
- Preview images before downloading static planner files.
- Delivered securely as pure static files.

### 4. Motivational Quotes Section
- Dedicated section that loops or randomly displays motivational quotes.
- Rotating quotes powered by local data arrays.

### 5. Additional Enhancements
- Daily routine and study environment guides.
- Fully responsive for mobile, tablet, and desktop views.
- Smooth component transitions and hover animations.

## 🧱 Technical Requirements

### Tech Stack
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Vite**

### Setup & Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### 📁 Project Structure

```text
src/
├── assets/                  # Static assets
│   ├── images/              # General graphics and icons
│   └── planners/            # Downloadable planner resources (PDF/images)
├── components/              # Reusable React UI Components
│   ├── study-tips/          # Components related to study techniques
│   ├── pomodoro/            # Pomodoro timer components
│   ├── planners/            # Planner cards and download buttons
│   ├── quotes/              # Rotating motivational quotes components
│   └── ui/                  # Generic UI components (buttons, cards, etc.)
├── data/                    # Static mock data arrays for content
├── hooks/                   # Custom reusable React hooks
├── utils/                   # Helper functions
├── App.tsx                  # Main application structure
├── main.tsx                 # React DOM mapping
└── index.css                # Global Tailwind styles
```

## 📐 Coding Standards & Conventions
- **Naming Conventions**: Files and folders use `kebab-case` (e.g., `pomodoro-timer.tsx`), while variables and functions use `snake_case` (e.g., `timer_state`).
- **Modularity**: Components follow a strict separation of concerns, heavily prioritizing reusability through props instead of building monolithic blocks.
- **State and Logic**: Application state resets natively on page refresh (no database, no localStorage).

## 🎨 UI/UX Philosophy
Tasklet embraces a modern, distraction-free aesthetic. It utilizes soft colors, abundant white space, smooth micro-animations, and clean typography via Tailwind CSS to ensure readability and focus.
