# YouTube Notes AI

## 📖 Overview

**YouTube Notes AI** is a powerful Next.js application that automatically generates comprehensive, structured study notes from YouTube video transcripts. Utilizing cutting-edge AI via the Groq API, it transforms lengthy video content into easy-to-read, actionable insights for students, professionals, and lifelong learners.

---

## ✨ Features

- **Automated YouTube Transcription:** Seamlessly extracts transcripts directly from YouTube videos.
- **AI-Powered Summarization:** Leverages blazing-fast LLMs (via Groq API) to generate smart, contextual study notes.
- **Customizable Output:** Tailor notes formats to your exact preference (e.g., bullet points, summaries, in-depth paragraphs).
- **Real-Time Streaming:** Enjoy ultra-fast AI response streaming directly into a beautiful, interactive user interface.
- **Modern Architecture:** Built on highly-optimized edge infrastructure utilizing Next.js 14 and React 19.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), React 19, TailwindCSS v4, Framer Motion
- **UI Components:** shadcn/ui, base-ui, Lucide React
- **Backend / API:** Next.js API Routes, OpenAI SDK (Groq compatibility target)
- **AI Models:** Groq Cloud (`openai/gpt-oss-120b` or equivalent)

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your local development machine:

- **Node.js**: v18.x or higher
- **npm**, **yarn**, or **pnpm**
- **Git**
- A **Groq API Key** (or compatible OpenAI API key)

---

## 🚀 Installation & Setup

Follow these steps to get your development environment up and running:

### 1. Clone the Repository

```bash
git clone https://github.com/pmaheshwari1903/Youtube-notes-ai.git
cd Youtube-notes-ai
```

### 2. Install Dependencies

Install all the necessary NPM packages:

```bash
npm install
```

### 3. Configure Environment Variables

Create a new file named `.env.local` in the root of the project:

```bash
# On Windows (Command Prompt)
copy .env.example .env.local

# On Mac/Linux
cp .env.example .env.local
```

Open `.env.local` and add your required API keys:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Start the Development Server

Start the local server in development mode:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the application.

---

## 🧑‍💻 Usage Guide

1. **Launch the App:** Open the application in your local browser window.
2. **Input Video URL:** Paste any valid YouTube video URL into the main input field on the dashboard.
3. **Configure Options:** Select your preferred note-taking style and depth.
4. **Generate Notes:** Click **Generate** and watch as the AI streams the parsed and categorized notes directly onto your screen.
5. **Review & Save:** Copy the styled Markdown notes into your favorite notes app!

---

## 📂 Project Structure

```text
Youtube-notes-ai/
├── src/
│   ├── app/           # Next.js App Router (Pages, Layouts, & API Routes)
│   ├── components/    # Reusable React UI components (shadcn & Framer Motion)
│   ├── lib/           # Utility functions (prompts, formatting, etc.)
│   └── types/         # TypeScript interfaces 
├── public/            # Static assets
├── .env.example       # Environment variables template
├── tailwind.config.ts # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies and npm scripts
```

---

## 🤝 Contributing

We welcome contributions to make YouTube Notes AI even better! 

1. **Fork** the repository.
2. **Create a new branch** (`git checkout -b feature/amazing-feature`).
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`).
4. **Push to the branch** (`git push origin feature/amazing-feature`).
5. Open a **Pull Request**.

Please ensure your code adheres to standard linting rules by running `npm run lint` before committing.

---

## 📄 License

This project is proprietary. All rights reserved.
