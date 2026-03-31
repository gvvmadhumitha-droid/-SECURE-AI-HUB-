# 🛡️ Secure AI Hub: The Resilience OS

**Secure AI Hub** is a revolutionary, enterprise-grade educational platform designed to inoculate users against AI-weaponized cyber threats. Moving beyond simple quizzes and "phishing detection," this application employs a **Behavioral Transformation Engine** to build true digital resilience.

---

## 🎯 The Core Innovation
Traditional security training fails because it treats cybersecurity as a knowledge problem. We recognize it as a **Psychological Problem**. Secure AI Hub breaks down scams into 4 distinct *Psychological Vectors* (Urgency, Authority, Greed, Social manipulation) and dynamically measures a user's *Confidence Delta* to force genuine behavioral change.

### Key Features:
*   **The Adversarial Simulator:** Play as a scam victim *or* the scammer themselves (Mirror POV) to map deceptive strategies.
*   **Phish-Eye Visual Forensics:** A clean browser mock-up designed to train users in spotting deepfake artifacts and malicious web clones.
*   **Mimicry Lab:** Analyzes linguistic structures to generate a "Shadow Self," demonstrating how easily AI can clone the user's vocal and writing patterns.
*   **Family Protocol Integration:** Automatically generates a personalized out-of-band "Safe-Word" system to thwart AI voice-cloning attacks.
*   **Scientific Validation Dashboard:** A comprehensive analytical engine providing mathematical proof of learning via vector mastery radars and active resilience stats.

---

## 🏗️ Technical Architecture 

We built **Secure AI Hub** focusing on ultra-low latency, robust test-driven reliability, and cross-device persistence.

### Top-Tier Tech Stack:
1.  **React (v19) & Vite (v8)**: For lightning-fast Hot Module Replacement and highly optimized build bundling.
2.  **Tailwind CSS (v4)**: Complete utility-first styling mapped perfectly to a unified design system.
3.  **Framer Motion**: Delivering smooth page transitions and responsive UX data-visualization.
4.  **Meta LLaMA 3.1 & Groq API**: Running hyper-fast inference models to power the dynamic AI Simulator chatbots and response algorithms.
5.  **Firebase Firestore**: Serverless, multi-device cloud synchronization mapping user profiles anonymously.

### Engineering Reliability Protocols:
*   **Playwright (E2E Integration Testing)**: Fully automated headless browser validation mathematically certifying that all core user flows survive hydration and interaction without breaking.
*   **Vitest (Unit Integrity)**: Headless evaluation of complex state configurations and derived analytics generation.
*   **React Error Boundaries**: Active "Glitch-Recovery" fallback states protecting the user from unpredictable LLM API timeouts.
*   **React.lazy Code Splitting**: Route-level chunking preserving device memory and maximizing initial load speeds.

---

## ⚙️ Local Development Guide

### 1. Installation
Clone the repository and install the NPM dependencies:
```bash
git clone https://github.com/gvvmadhumitha-droid/-SECURE-AI-HUB-.git
cd -SECURE-AI-HUB-
npm install
```

### 2. Environment Configuration
We prioritize keeping API keys out of client builds using native `.env` abstraction. Copy the example template into an active `.env` file:
```bash
cp .env.example .env
```
Inside the new `.env`, populate your `VITE_GROQ_API_KEY` (required) and your `VITE_FIREBASE` keys (optional: if omitted, the architecture gracefully degrades to `localStorage` functionality securely).

### 3. Spin Up Development Server
```bash
npm run dev
# Server boots up on http://localhost:5173
```

---

## 🧪 Testing Suites

Run unit test calculations:
```bash
npm run test
```

Execute headless End-to-End browser workflows:
```bash
npm run test:e2e
```

---

*Secure AI Hub: Defending the Digital Citizen.*
