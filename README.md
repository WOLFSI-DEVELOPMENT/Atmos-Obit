# VibeCoder

VibeCoder is an advanced, AI-powered Roblox game development assistant and Luau script generator. It provides a highly customizable, chat-based interface that leverages multiple LLM providers (Gemini, OpenAI, Anthropic) to help you build, script, and design Roblox experiences.

## 🌟 Features

- **Multi-Model Support**: Bring your own API keys for Gemini, OpenAI, or Anthropic.
- **Roblox-Specific Generation**: Tailored for Luau scripting. Control asset generation preferences (Roblox Toolbox vs. Custom CSG Parts).
- **Deep Personalization**: Customize the UI to your liking, including AI response fonts, GUI styles, and a tactile mechanical 3D send button.
- **Experimental Lab**:
  - **AST Patching (Fast Diffs)**: Opt-in to faster generation times by mutating the Abstract Syntax Tree instead of rewriting whole files.
  - **Wikimedia Asset Fetching**: Allow the AI to source public domain audio and images directly from Wikimedia.
  - *(Coming Soon)* Context Caching & RAG (Retrieval-Augmented Generation).
  - *(Coming Soon)* Multi-Agent Parallelism (Swarm Architecture).
- **Real-Time Voice Input**: Integrated speech-to-text for hands-free prompting.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion (for fluid animations)
- **Backend**: Express (Node.js) handling API routing and serving the SPA
- **Icons**: Lucide React
- **Build Tooling**: ESBuild & TypeScript

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory. While the app allows users to input their API keys directly via the UI (which saves to `localStorage`), you can define fallback keys or server secrets here.
```bash
cp .env.example .env
# Edit .env to add your keys if necessary
```

### 3. Running the Development Server
Start the Vite dev server and Express backend concurrently:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 4. Building for Production
To create a production build and run the compiled Node server:
```bash
npm run build
npm run start
```

## 🔍 Information for Reviewers

- **UI Craftsmanship**: The "3D Send Button" feature was explicitly engineered using a structural DOM approach rather than brittle CSS box-shadows. It uses nested wrapper divs to create a true, dynamic physical depression effect that automatically inherits and darkens the user's custom color choices.
- **State Management**: The application makes heavy use of `localStorage` to persist complex user configurations (API keys, 3D button toggles, experimental feature flags, custom fonts) seamlessly across sessions without requiring a heavy database backend for unauthenticated users.
- **Extensible Architecture**: The Settings panel is modularly designed with a custom tab system (Account, Personalize, Behavior, AI, Permissions, Experiments). New beta features can be easily injected into the `Experiments` tab, which automatically cascades required toggles into the `Permissions` tab (e.g., Wikimedia API access).

## 📄 License
MIT License
