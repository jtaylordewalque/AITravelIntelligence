git clone https://github.com/your-username/voyage-genius.git
cd voyage-genius
npm install
```

2. Set up environment variables:
```env
VITE_GOOGLE_PLACES_API_KEY=your_google_places_key
VITE_FIREBASE_CONFIG=your_firebase_config
VITE_OPENAI_API_KEY=your_openai_key
```

3. Start the development server:
```bash
npm run dev
```

The server will start on port 5000 and the client will be available through Vite's development server.

## Project Structure 📁

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utility functions
│   │   ├── hooks/       # Custom React hooks
│   │   └── types/       # TypeScript type definitions
├── server/           # Express backend
│   ├── routes/      # API route handlers
│   ├── services/    # Business logic
│   └── utils/       # Helper functions
└── shared/          # Shared TypeScript types
    └── schema.ts    # Data models and validation