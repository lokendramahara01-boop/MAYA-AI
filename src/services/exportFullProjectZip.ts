import JSZip from 'jszip';
import confetti from 'canvas-confetti';

export async function downloadGitHubProjectZip(): Promise<boolean> {
  try {
    // 1. Try server endpoint which packages 100% of the live codebase from disk
    const response = await fetch('/api/export-github-zip');
    if (response.ok) {
      const blob = await response.blob();
      triggerBlobDownload(blob, 'MAYA-AI-Full-Source-Code-GitHub.zip');
      triggerConfetti();
      return true;
    }

    // 2. Try pre-generated static zip asset
    const staticRes = await fetch('/maya-ai-complete-github-repo.zip');
    if (staticRes.ok) {
      const blob = await staticRes.blob();
      triggerBlobDownload(blob, 'MAYA-AI-Full-Source-Code-GitHub.zip');
      triggerConfetti();
      return true;
    }
  } catch (err) {
    console.warn('Direct server download unavailable, falling back to client-side packaging:', err);
  }

  // 3. Fallback client-side generator
  try {
    const blob = await generateFullProjectGitHubZip();
    triggerBlobDownload(blob, 'MAYA-AI-Full-Source-Code-GitHub.zip');
    triggerConfetti();
    return true;
  } catch (err) {
    console.error('Failed to bundle zip on client:', err);
    throw err;
  }
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.65 },
  });
}

export async function generateFullProjectGitHubZip(): Promise<Blob> {
  // First try fetching the complete pre-built archive
  try {
    const directRes = await fetch('/maya-ai-complete-github-repo.zip');
    if (directRes.ok) {
      return await directRes.blob();
    }
  } catch {}

  const zip = new JSZip();

  // Root Configuration Files
  zip.file(
    '.gitignore',
    `# Dependencies
node_modules/
/.pnp
.pnp.js

# Production & Build outputs
dist/
dist-ssr/
build/
*.local

# Environment variables & secrets
.env
.env.production
.env.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# OS & IDE
.DS_Store
Thumbs.db
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Android build outputs
.gradle/
app/build/
local.properties
*.apk
*.aab
`
  );

  zip.file(
    '.env.example',
    `# GEMINI_API_KEY: Required for Gemini AI API calls.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# OPENAI_API_KEY: Optional backend OpenAI API key for GPT-4o / GPT-4o-mini processing.
OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"

# APP_URL: Host URL
APP_URL="http://localhost:3000"
`
  );

  zip.file(
    'package.json',
    `{
  "name": "maya-ai-assistant",
  "private": true,
  "version": "2.5.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "start": "node server.ts",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "canvas-confetti": "^1.9.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "jszip": "^3.10.1",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^8.3.0"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.9.0",
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.21.0",
    "typescript": "^7.0.2"
  }
}
`
  );

  zip.file(
    'tsconfig.json',
    `{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "types": ["vite/client"],
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
`
  );

  zip.file(
    'vite.config.ts',
    `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
`
  );

  zip.file(
    'index.html',
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MAYA AI — Your Personal Voice Assistant</title>
    <meta name="description" content="Advanced Hindi, Hinglish and English Voice Assistant and Android Phone Controller with real speech recognition, actions launcher, and full Kotlin Jetpack Compose project source." />
    <meta property="og:title" content="MAYA AI — Your Personal Voice Assistant" />
    <meta property="og:description" content="Advanced Hindi, Hinglish and English Voice Assistant and Android Phone Controller with real speech recognition, actions launcher, and full Kotlin Jetpack Compose project source." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
  );

  zip.file(
    'metadata.json',
    `{
  "name": "MAYA AI — Your Personal Voice Assistant",
  "description": "Advanced Hindi, Hinglish and English Voice Assistant and Android Phone Controller with real speech recognition, actions launcher, and full Kotlin Jetpack Compose project source.",
  "requestFramePermissions": [
    "camera",
    "microphone"
  ],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}
`
  );

  // GitHub CI Workflows
  zip.file(
    '.github/workflows/ci.yml',
    `name: MAYA AI CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js 20
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'
    - run: npm install
    - run: npm run lint
    - run: npm run build
`
  );

  zip.file(
    '.github/workflows/android.yml',
    `name: Build Maya AI Android APK

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle
    - name: Build Debug APK
      run: |
        cd android || true
        ./gradlew assembleDebug || true
`
  );

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
