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

### Add Scores

- **Multi-step Process**:
  1. Select golf course
  2. Enter player scores (handicap and gross)
  3. Confirm and submit round details
- **Player Management**: Navigate through multiple players
- **Score Validation**: Input validation for handicap and gross scores

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **UI Library**: Tamagui
- **Navigation**: Expo Router
- **Backend**: Supabase
- **Icons**: Lucide Icons
- **Language**: TypeScript

## 📱 Screenshots

### Home Screen

- League name and season display
- Leaderboard with player cards
- Official rounds with course images

### Add Scores Flow

- Golf course selection
- Player score entry
- Round confirmation

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Expo CLI
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

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   yarn start
   ```

5. **Run on device/simulator**
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
│   │   └── _layout.tsx            # Tab navigation
│   ├── components/
│   │   ├── Leaderboard/
│   │   │   └── index.tsx          # Leaderboard component
│   │   ├── PlayerCard/
│   │   │   └── index.tsx          # Individual player card
│   │   ├── OfficialRounds/
│   │   │   └── index.tsx          # Rounds display
│   │   ├── RoundCard/
│   │   │   └── index.tsx          # Individual round card
│   │   └── AddScores/
│   │       ├── index.tsx          # Main add scores component
│   │       ├── SelectGolfCourse/
│   │       ├── EnterPlayerScores/
│   │       └── ConfirmRoundSubmit/
│   ├── api/
│   │   ├── getPlayersByLeague.ts  # Player data API
│   │   └── getLeagueRounds.ts     # Rounds data API
│   └── _layout.tsx                # Root layout
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

## 🔧 Development

### Available Scripts

- `yarn start` - Start Expo development server
- `yarn android` - Run on Android
- `yarn ios` - Run on iOS
- `yarn web` - Run on web
- `yarn tamagui check` - Check Tamagui configuration

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

### App Store Deployment

1. Configure app.json with proper metadata
2. Build production version
3. Submit to App Store/Google Play

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
