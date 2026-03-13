# 🧠 Study Companion: Your AI-Powered Study Buddy

Acing your exams just got a whole lot easier. **Study Companion** is a modern, high-performance web application designed to help students streamline their learning process using the power of Artificial Intelligence.

Whether you're watching a 2-hour lecture or reading a dense research paper, our built-in **AI Study Assistant** (powered by Google's Gemini 1.5 Flash) is ready to turn chaos into clarity.

---

## ✨ Features

- **🪄 AI Magic Summarizer**: Paste a video transcript or long text, and let Gemini generate a structured study guide, a quick summary, or even a practice quiz in seconds.
- **📝 Integrated Note Editor**: Take notes right alongside your study materials. No more switching tabs!
- **🎬 Multimedia Focused**: Designed with a built-in video player so you can watch, learn, and summarize all in one place.
- **⚡ Lightning Fast**: Built with **Vite** and **React** for a sub-second response time and a smooth, modern UI.
- **🎨 Sleek Dark Mode**: Because late-night study sessions shouldn't hurt your eyes.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) (Functional Components + Hooks)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **AI Engine**: [Google Generative AI (Gemini 1.5 Flash)](https://aistudio.google.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start

Follow these steps to get your Study Companion up and running:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Fellarity/study-companion.git
   cd study-companion
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Get your Gemini API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Generate a free API Key.
   - You can enter this key directly into the app's settings once it's running.

4. **Launch the app**:
   ```bash
   npm run dev
   ```

5. **Start Learning**: Open `http://localhost:5173` in your browser.

---

## 📂 Project Structure

- `src/components/ai/`: The heart of the app—the AI Summarizer.
- `src/components/editor/`: A robust note-taking environment.
- `src/components/player/`: Video integration for lecture-based learning.
- `src/context/`: State management for a seamless experience.

---

## 🤝 Contributing

Have an idea to make studying even better? Fork the repo, add your features (maybe a Pomodoro timer?), and send a PR!

**Study smarter, not harder.** 🎓✨
