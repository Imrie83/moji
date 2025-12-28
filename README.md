# Moji - Japanese Character Practice 🇯🇵

A modern, interactive application for mastering Japanese Kanji and Kana. Designed with a focus on aesthetics, smooth interactions, and granular control over your study session.

## ✨ Key Features

### 📚 Comprehensive Study Modes

-   **Kanji Practice**:
    -   Full support for **JLPT N5, N4, and N3** Kanji.
    -   **Level Selection**: Toggle entire JLPT levels on or off.
    -   **Granular Selection**: Click any level to open a modal and select/deselect specific characters to focus on your weak points.
-   **Kana Practice**:
    -   Complete **Hiragana** and **Katakana** charts.
    -   Includes Dakuon (voiced), Handakuon (semi-voiced), and Yōon (combination) characters.
    -   Like Kanji, you can select specific rows or individual characters to practice.

### 🎮 Game Mechanics

-   **Smart Input**: Simply type the reading in Romaji — the app automatically converts it to Kana as you type (powered by `wanakana`).
-   **Flexible Reading Modes**: Configure how the app validates Kanji answers:
    -   **Onyomi & Kunyomi**: Accepts either reading (standard).
    -   **Onyomi Only**: Strict mode for focusing on Chinese readings.
    -   **Kunyomi Only**: Strict mode for focusing on Japanese readings.
-   **Practice Limits**: Set a fixed number of items (e.g., 10, 25, 50) for a quick session, or choose **∞** for endless practice.
-   **Retry Logic**: Incorrectly answered characters are automatically re-queued so you can try them again before the session ends.

### 🎨 Customization & Aesthetics

-   **Theme Support**: Fully responsive Light and Dark modes.
-   **Accessibility**: High-contrast text options and clear visual feedback for correct/incorrect states.

## 🛠️ Technical Highlights

-   **Performance**: Optimized rendering with `React.memo` and virtualization strategies for character grids.
-   **Build Optimization**: Implements advanced chunk splitting (`manualChunks`) to separate vendor libraries from application code, ensuring fast load times and efficient caching.
-   **State Management**: Powered by **Zustand** for persistent settings and fluid game state control.
-   **Stack**: Built with **React 19**, **TypeScript**, **Vite**, and **Material UI**.

## 🚀 Getting Started

1.  **Install dependencies**

    ```bash
    npm install
    ```

2.  **Run locally**

    ```bash
    npm run dev
    ```

3.  **Build for production**
    ```bash
    npm run build
    ```
    _Note: The build pipeline includes automatic type checking and chunk optimization._

## 📄 License

MIT License
