# Fairway Fleas - Golf Club Season App

A React Native mobile application built with Expo and Tamagui for managing golf club seasons, tracking player scores, and displaying leaderboards.

## 🏌️ Features

### Leaderboard & Statistics

- **Player Rankings**: View players sorted by net points and gross points
- **Player Cards**: Individual player cards showing:
  - Player avatar and name
  - Net points (primary ranking)
  - Average net score (with one decimal precision)
  - Best net score
  - Medal indicators for top 3 players (gold, silver, bronze)
- **League Statistics**: Comprehensive stats including:
  - Most wins (gross and net)
  - Best average scores
  - Most major wins (conditional display)
  - Course performance tracking
- **Horizontal Scrolling**: Smooth card navigation with snap-to-center

### Official Rounds & Score Management

- **Round History**: Display all official rounds with course images
- **Round Details**: Each round shows:
  - Course name and image
  - Round date
  - Player scores (sorted by net score)
  - Major tournament indicators (green banner)
- **Score Breakdown**: Gross, net, and handicap for each player
- **Recent Rounds**: View user's recent rounds across all leagues
- **Score Submission**: Multi-step process for adding new rounds
- **Course Management**: Automatic course creation and tracking

### League Management

- **Multiple Leagues**: Create and manage multiple golf leagues
- **League Switching**: Dropdown selector to switch between leagues
- **Player Management**: Add players to leagues with invite system
- **League Statistics**: Track performance across different leagues
- **Course Tracking**: Monitor course usage and times played
- **Role Management**: Commissioner and player roles with different permissions

### Add Scores Flow

- **Multi-step Process**:
  1. Select league
  2. Select golf course (with search functionality)
  3. Enter player scores (handicap and gross)
  4. Confirm and submit round details
- **Player Management**: Navigate through multiple players
- **Score Validation**: Input validation for handicap and gross scores
- **Course Search**: Real-time golf course search with secure API integration
- **Major Tournament Support**: Mark rounds as major tournaments with custom names

### User Management

- **Authentication**: Sign up, sign in, and password recovery
- **Profile Management**: Update name, email, and password
- **Invite System**: Claim pending league invites automatically
- **User Statistics**: Personal performance tracking across all leagues

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **UI Library**: Tamagui
- **Navigation**: Expo Router v3
- **Backend**: Supabase (PostgreSQL)
- **Edge Functions**: Supabase Edge Functions for secure API handling
- **Icons**: Lucide Icons
- **Language**: TypeScript
- **State Management**: React Context + Custom Hooks
- **Styling**: Tamagui with responsive design
- **Database**: PostgreSQL with Row Level Security (RLS)

## 🔒 Security Features

- **Secure API Integration**: Golf course API calls handled through Supabase Edge Functions
- **No Client-Side Secrets**: API keys stored securely on Supabase servers
- **Row Level Security**: Database-level security with Supabase RLS policies
- **Environment Variables**: Secure configuration management
- **User Authentication**: Supabase Auth with proper session management
- **Data Validation**: Server-side validation for all data operations

## 📱 Screenshots

### Home Screen

- League name and season display
- Leaderboard with player cards
- Official rounds with course images
- Recent rounds for current user
- User statistics card

### Add Scores Flow

- League and golf course selection
- Player score entry with handicap
- Round confirmation with major tournament options

### League Management

- League creation wizard
- Player invitation system
- League profile and statistics
- Course management

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
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
├── app/                           # Expo Router v3 app directory
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx             # Home screen
│   │   ├── AddScores.tsx         # Add scores tab
│   │   ├── MyLeagues.tsx         # League management
│   │   ├── Stats.tsx             # Statistics screen
│   │   ├── Settings.tsx          # Settings screen
│   │   └── _layout.tsx           # Tab navigation layout
│   ├── Profile/                  # Profile management screens
│   ├── CreateLeague.tsx          # League creation
│   ├── modal.tsx                 # Modal screens
│   └── _layout.tsx               # Root layout with providers
├── src/
│   ├── components/               # React components
│   │   ├── AddScores/            # Add scores flow components
│   │   ├── Auth/                 # Authentication components
│   │   ├── CreateLeague/         # League creation components
│   │   ├── Home/                 # Home screen components
│   │   ├── MyLeagues/            # League management components
│   │   ├── Profile/              # Profile components
│   │   ├── Settings/             # Settings components
│   │   ├── Stats/                # Statistics components
│   │   └── UI/                   # Reusable UI components
│   ├── api/                      # API functions and data fetching
│   │   ├── leagueCourses/        # Course management
│   │   ├── scoreSubmission/      # Score submission logic
│   │   └── ...                   # Other API functions
│   ├── context/                  # React Context providers
│   │   ├── LeaderboardContext.tsx
│   │   ├── OfficalRoundsContext.tsx
│   │   ├── SelectedLeagueContext.tsx
│   │   └── UserContext.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── useSubmitScores.ts    # Score submission logic
│   │   ├── useUserRecentRounds.ts
│   │   └── ...                   # Other custom hooks
│   ├── lib/                      # Library configurations
│   │   └── supabase.ts           # Supabase client
│   ├── types/                    # TypeScript type definitions
│   │   ├── player.ts
│   │   ├── round.ts
│   │   └── user.ts
│   └── utils/                    # Utility functions
│       ├── calculateGrossNetPoints.ts
│       └── playerNameUtils.ts
├── supabase/                     # Supabase configuration
│   └── functions/                # Edge Functions
│       └── search-courses/       # Golf course search
├── constants/                    # App constants
│   └── Colors.ts                 # Color definitions
├── assets/                       # Images, fonts, and static assets
├── tamagui.config.ts             # Tamagui configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

## 🎨 Design System

### Colors

- **Primary**: Blue theme (`$blue10`)
- **Success**: Green (`$green8`, `$green10`)
- **Background**: White/light theme
- **Text**: Dark theme with proper contrast
- **Accent**: Various colors for player identification

### Components

- **Cards**: Rounded corners, subtle shadows, consistent spacing
- **Buttons**: Consistent styling with proper states and feedback
- **Inputs**: Clean, minimal design with placeholders and validation
- **Avatars**: Circular design with fallback colors and player identification
- **Modals**: Clean overlay design with proper focus management

## 📊 Data Structure

### Player

```typescript
type Player = {
  id: string;
  user_id?: string;
  invite_email?: string;
  display_name: string;
  avatar_url?: string;
  player_color: string;
  league_id: string;
  created_at: string;
};
```

### Round

```typescript
type Round = {
  id: string;
  league_id: string;
  course_id: string;
  date: string;
  is_major: boolean;
  major_name?: string;
  created_at: string;
  scores: RoundScore[];
};
```

### Golf Course

```typescript
type GolfCourse = {
  id: number;
  name: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  tees: {
    male: TeeInfo[];
    female: TeeInfo[];
  };
  img_url?: string;
  times_played: number;
};
```

### League

```typescript
type League = {
  id: string;
  name: string;
  season: string;
  created_by: string;
  created_at: string;
  players: Player[];
  courses: GolfCourse[];
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

### Database Migrations

```bash
# Apply migrations
supabase db push

# Create new migration
supabase migration new migration_name

# Reset database (development only)
supabase db reset
```

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Proper error handling and user feedback
- Accessibility considerations
- React best practices and patterns

## 🚀 Deployment

### Expo Build

```bash
# Build for production
expo build:android
expo build:ios

# EAS Build (recommended)
eas build --platform ios
eas build --platform android
```

### Supabase Deployment

```bash
# Deploy Edge Functions
supabase functions deploy

# Deploy database migrations
supabase db push

# Deploy to production
supabase link --project-ref PROD_PROJECT_REF
```

### App Store Deployment

1. Configure `app.json` with proper metadata
2. Build production version with EAS
3. Submit to App Store/Google Play
4. Configure app signing and certificates

## 🔒 Security

- **API Keys**: Stored securely in Supabase Edge Functions
- **Database**: Row Level Security (RLS) enabled with proper policies
- **Authentication**: Supabase Auth with proper session management
- **Environment Variables**: No sensitive data in client-side code
- **Data Validation**: Server-side validation for all operations
- **User Permissions**: Role-based access control for league management

## 🧪 Testing

- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API and data flow testing
- **Error Handling**: Comprehensive error scenarios and user feedback
- **Performance**: Optimized rendering and data fetching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the established patterns
4. Add tests if applicable
5. Ensure all linting and type checks pass
6. Submit a pull request with a clear description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the existing documentation and issues
- Contact the development team

## 🚧 Known Issues & Limitations

- Splash screen configuration in `app.json`
- Some edge cases in score calculation for tied scores
- Course image loading may be slow on slower connections

## 🔮 Future Enhancements

- Push notifications for round updates
- Offline support for score entry
- Advanced statistics and analytics
- Social features and player interactions
- Course rating and review system

---

**Built with ❤️ for the Fairway Fleas Golf Club**

_Last updated: December 2024_
