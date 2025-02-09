# Voyage Genius - Smart Travel Planning Platform 🌍✈️

## Overview
Voyage Genius is a comprehensive travel planning platform that helps users discover, compare, and book multi-modal travel routes. It combines intelligent search capabilities with real-time data to provide optimized travel solutions.

## Features 🚀
- **Smart Route Search**: Find optimal travel routes combining different modes of transport
- **Multi-modal Transportation**: Compare and combine trains, buses, flights, and more
- **Dynamic Pricing**: Real-time pricing based on class selection and number of passengers
- **Flexible Dates**: Search within a range of dates for better deals
- **Connection Preferences**: Choose between direct routes or those with connections
- **Interactive UI**: User-friendly interface with real-time updates
- **AI-Powered Suggestions**: Get intelligent travel recommendations (Coming Soon)

## Tech Stack 💻
- **Frontend**:
  - React.js with TypeScript
  - Tailwind CSS for styling
  - shadcn/ui components
  - TanStack Query for data fetching
  - Framer Motion for animations

- **Backend**:
  - Node.js with Express
  - TypeScript
  - PostgreSQL with Drizzle ORM
  - OpenAI integration

- **APIs & Services**:
  - Google Maps API for location autocomplete
  - Firebase Authentication
  - OpenAI GPT for travel suggestions

## Getting Started 🚀

### Prerequisites
- Node.js (v20 or later)
- PostgreSQL database
- Google Maps API key
- OpenAI API key (for AI features)

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
DATABASE_URL=your_postgresql_url
GOOGLE_MAPS_API_KEY=your_google_maps_key
OPENAI_API_KEY=your_openai_key
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure 📁
```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                 # Backend Express application
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage interface
│   └── openai.ts          # OpenAI integration
└── shared/                # Shared types and schemas
    └── schema.ts          # Database and API schemas
```

## Usage Examples 🌟

### Searching for Routes
1. Enter origin and destination
2. Select travel dates
3. Choose number of passengers and class
4. Use advanced options for more specific preferences
5. View and compare different route options

### Advanced Features
- **Flexible Dates**: Toggle the "Flexible dates" option to search within ±3 days
- **Connection Preferences**: Choose between shorter connections, longer connections, or no preference
- **Class Selection**: Choose between Economy, Business, or First class
- **Multi-passenger Pricing**: Automatically calculates total price for multiple passengers

## Contributing 🤝
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝
This project is licensed under the MIT License - see the LICENSE file for details
