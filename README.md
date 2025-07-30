# Fairway Fleas - Golf Club Season App

A React Native mobile application built with Expo and Tamagui for managing golf club seasons, tracking player scores, and displaying leaderboards.

## 🏌️ Features

### Leaderboard

- **Player Rankings**: View players sorted by net points and gross points
- **Player Cards**: Individual player cards showing:
  - Player avatar and name
  - Net points (primary ranking)
  - Average net score (with one decimal precision)
  - Best net score
  - Medal indicators for top 3 players (gold, silver, bronze)
- **Horizontal Scrolling**: Smooth card navigation with snap-to-center

### Official Rounds

- **Round History**: Display all official rounds with course images
- **Round Details**: Each round shows:
  - Course name and image
  - Round date
  - Player scores (sorted by net score)
  - Major tournament indicators (green banner)
- **Score Breakdown**: Gross, net, and handicap for each player
- **Recent Rounds**: View user's recent rounds across all leagues

### Add Scores

- **Multi-step Process**:
  1. Select golf course (with search functionality)
  2. Enter player scores (handicap and gross)
  3. Confirm and submit round details
- **Player Management**: Navigate through multiple players
- **Score Validation**: Input validation for handicap and gross scores
- **Course Search**: Real-time golf course search with secure API integration

### League Management

- **Multiple Leagues**: Create and manage multiple golf leagues
- **League Switching**: Dropdown selector to switch between leagues
- **Player Management**: Add players to leagues
- **League Statistics**: Track performance across different leagues

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **UI Library**: Tamagui
- **Navigation**: Expo Router
- **Backend**: Supabase (PostgreSQL)
- **Edge Functions**: Supabase Edge Functions for secure API handling
- **Icons**: Lucide Icons
- **Language**: TypeScript
- **State Management**: React Context + Custom Hooks

## 🔒 Security Features

- **Secure API Integration**: Golf course API calls handled through Supabase Edge Functions
- **No Client-Side Secrets**: API keys stored securely on Supabase servers
- **Row Level Security**: Database-level security with Supabase RLS
- **Environment Variables**: Secure configuration management

## 📱 Screenshots

### Home Screen

- League name and season display
- Leaderboard with player cards
- Official rounds with course images
- Recent rounds for current user

### Add Scores Flow

- Golf course selection with search
- Player score entry
- Round confirmation

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Expo CLI
- Supabase CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd club-season
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up Supabase**

   ```bash
   # Install Supabase CLI (if not already installed)
   brew install supabase/tap/supabase

   # Link to your Supabase project
   supabase link --project-ref YOUR_PROJECT_REF

   # Set up Edge Function secrets
   supabase secrets set GOLF_API_KEY=YOUR_GOLF_API_KEY

   # Deploy Edge Functions
   supabase functions deploy search-courses
   ```

4. **Configure Supabase**

   Create a `src/lib/supabase.ts` file with your project credentials:

   ```typescript
   import { createClient } from "@supabase/supabase-js";

   const supabaseUrl = "YOUR_SUPABASE_URL";
   const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

5. **Start the development server**

   ```bash
   yarn start
   ```

6. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## 📁 Project Structure

```
club-season/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx              # Home screen
│   │   ├── AddScores.tsx          # Add scores tab
│   │   ├── MyLeagues.tsx          # League management
│   │   ├── Stats.tsx              # Statistics screen
│   │   ├── Settings.tsx           # Settings screen
│   │   └── _layout.tsx            # Tab navigation
│   ├── Profile/                   # Profile management
│   ├── CreateLeague.tsx           # League creation
│   └── _layout.tsx                # Root layout
├── src/
│   ├── components/
│   │   ├── AddScores/             # Add scores flow components
│   │   ├── Auth/                  # Authentication components
│   │   ├── CreateLeague/          # League creation components
│   │   ├── Home/                  # Home screen components
│   │   ├── MyLeagues/             # League management components
│   │   ├── Profile/               # Profile components
│   │   ├── Settings/              # Settings components
│   │   └── UI/                    # Reusable UI components
│   ├── api/                       # API functions
│   ├── context/                   # React Context providers
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Library configurations
│   ├── types/                     # TypeScript type definitions
│   └── utils/                     # Utility functions
├── supabase/
│   └── functions/
│       └── search-courses/        # Edge Function for golf course search
├── constants/
│   └── Colors.ts                  # Color definitions
├── tamagui.config.ts              # Tamagui configuration
└── package.json
```

## 🎨 Design System

### Colors

- **Primary**: Blue theme (`$blue10`)
- **Success**: Green (`$green8`, `$green10`)
- **Background**: White/light theme
- **Text**: Dark theme with proper contrast

### Components

- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Consistent styling with proper states
- **Inputs**: Clean, minimal design with placeholders
- **Avatars**: Circular design with fallback colors

## 📊 Data Structure

### Player

```typescript
type Player = {
  avatar_url: string;
  avg_gross_score: number;
  avg_net_score: number;
  best_gross_score: number;
  best_net_score: number;
  gross_points: number;
  name: string;
  net_points: number;
  player_id: string;
};
```

### Round

```typescript
type Round = {
  _id: string;
  course: string;
  course_img: string;
  date: string;
  isMajor?: boolean;
  majorName?: string;
  scores: Score[];
};
```

### Golf Course

```typescript
type GolfCourse = {
  id: number;
  name: string;
  location: string;
  tees: TeeInfo[];
  img_url?: string;
};
```

## 🔧 Development

### Available Scripts

- `yarn start` - Start Expo development server
- `yarn android` - Run on Android
- `yarn ios` - Run on iOS
- `yarn web` - Run on web
- `yarn tamagui check` - Check Tamagui configuration

### Edge Functions

```bash
# Deploy Edge Functions
supabase functions deploy search-courses

# Set secrets
supabase secrets set GOLF_API_KEY=YOUR_API_KEY

# Test locally (requires Docker)
supabase functions serve search-courses
```

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Proper error handling
- Accessibility considerations

## 🚀 Deployment

### Expo Build

```bash
# Build for production
expo build:android
expo build:ios
```

### Supabase Deployment

```bash
# Deploy Edge Functions
supabase functions deploy

# Deploy database migrations
supabase db push
```

### App Store Deployment

1. Configure app.json with proper metadata
2. Build production version
3. Submit to App Store/Google Play

## 🔒 Security

- **API Keys**: Stored securely in Supabase Edge Functions
- **Database**: Row Level Security (RLS) enabled
- **Authentication**: Supabase Auth with proper session management
- **Environment Variables**: No sensitive data in client-side code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Fairway Fleas Golf Club**
