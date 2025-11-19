# Twenty CRM Mobile App

React Native mobile application for Twenty CRM built with Expo and TypeScript.

## Features

- **Authentication**: Email/password sign in and sign up with JWT tokens
- **Companies**: Browse, search, and manage company records
- **People**: View and manage contacts with search functionality
- **Opportunities**: Track sales opportunities with stages and amounts
- **Testimonials**: Manage customer testimonials with approval workflow
- **Profile**: User profile and workspace management

## Tech Stack

- **Framework**: React Native with Expo (~50.0.0)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Apollo Client for GraphQL data
- **GraphQL Client**: @apollo/client with authentication and error handling
- **Secure Storage**: expo-secure-store for tokens, AsyncStorage for preferences
- **TypeScript**: Full type safety across the app

## Project Structure

```
packages/twenty-mobile/
├── app/                          # Expo Router app directory
│   ├── (auth)/                  # Authentication screens
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/                  # Main tab navigation
│   │   ├── companies.tsx        # Companies list
│   │   ├── people.tsx           # People/contacts list
│   │   ├── opportunities.tsx    # Opportunities list
│   │   ├── testimonials.tsx     # Testimonials management
│   │   └── profile.tsx          # User profile
│   └── _layout.tsx              # Root layout with auth protection
├── src/
│   ├── api/                     # GraphQL queries and Apollo setup
│   │   ├── apollo-client.ts     # Apollo client configuration
│   │   ├── auth.graphql.ts      # Authentication mutations
│   │   └── records.graphql.ts   # CRUD queries for all records
│   ├── hooks/                   # React hooks
│   │   ├── useCompanies.ts      # Company CRUD hooks
│   │   ├── usePeople.ts         # People CRUD hooks
│   │   └── useTestimonials.ts   # Testimonial CRUD hooks
│   ├── services/                # Business logic services
│   │   ├── auth.service.ts      # Authentication service
│   │   └── storage.service.ts   # Secure storage service
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.ts              # Auth-related types
│   │   └── records.ts           # CRM record types
│   ├── constants/
│   │   └── config.ts            # Environment configuration
│   └── utils/                   # Utility functions
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript configuration
```

## Setup and Installation

### Prerequisites

- Node.js 18+ and Yarn
- iOS Simulator (macOS) or Android Studio (for emulators)
- Expo CLI (installed automatically)

### 1. Install Dependencies

```bash
cd packages/twenty-mobile
yarn install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Update the API URL to point to your Twenty CRM backend:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_GRAPHQL_ENDPOINT=/graphql
EXPO_PUBLIC_METADATA_ENDPOINT=/metadata
EXPO_PUBLIC_REST_ENDPOINT=/rest
EXPO_PUBLIC_ENV=development
```

**Important for iOS Simulator**: Use `http://localhost:3000`
**Important for Android Emulator**: Use `http://10.0.2.2:3000`
**Important for Physical Devices**: Use your computer's local IP (e.g., `http://192.168.1.100:3000`)

### 3. Start Development Server

```bash
yarn start
```

This will open Expo DevTools. From here you can:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan QR code with Expo Go app on your phone

### 4. Run on Specific Platform

```bash
# iOS
yarn ios

# Android
yarn android

# Web (experimental)
yarn web
```

## Development

### Available Scripts

```bash
# Start Expo development server
yarn start

# Run on iOS simulator
yarn ios

# Run on Android emulator
yarn android

# Type checking
yarn typecheck

# Linting
yarn lint
yarn lint:fix

# Run tests (when configured)
yarn test

# Generate native projects
yarn prebuild

# Clean and regenerate native projects
yarn prebuild:clean
```

## Architecture

### GraphQL API Integration

The app connects to the Twenty CRM backend using two GraphQL endpoints:

1. **Metadata API** (`/metadata`): Authentication, user data, workspace info
2. **Workspace API** (`/graphql`): CRM data (companies, people, opportunities, etc.)

### Authentication Flow

```
1. User enters email/password
2. getLoginTokenFromCredentials mutation → loginToken
3. getAuthTokensFromLoginToken mutation → accessToken + refreshToken
4. getCurrentUser query → user data + workspace info
5. Store tokens in SecureStore
6. Navigate to main app
```

### Token Management

- **Access Token**: Stored in expo-secure-store, attached to all GraphQL requests
- **Refresh Token**: Automatically used to renew expired access tokens
- **Workspace ID**: Stored in AsyncStorage for API requests

### Data Fetching Pattern

Each record type (Company, Person, Opportunity, Testimonial) has dedicated hooks:

```typescript
// Example: Fetching companies
const { companies, loading, hasNextPage, loadMore, refetch } = useCompanies(
  { name: { ilike: '%search%' } }, // Filter
  [{ name: 'AscNullsFirst' }],     // Sort
  50                                // Page size
);
```

## API Reference

### Authentication Service

```typescript
import { AuthService } from './src/services/auth.service';

// Sign in
const result = await AuthService.signIn(email, password);

// Sign up
const result = await AuthService.signUp(email, password);

// Check if authenticated
const isAuth = await AuthService.isAuthenticated();

// Sign out
await AuthService.signOut();

// Renew token
const renewed = await AuthService.renewToken();
```

### Record Hooks

```typescript
import { useCompanies, useCreateCompany } from './src/hooks/useCompanies';

// Fetch companies
const { companies, loading, loadMore, refetch } = useCompanies(filter, orderBy, limit);

// Create company
const { createCompany, loading } = useCreateCompany();
await createCompany({ name: 'Acme Corp', domainName: 'acme.com' });

// Similar patterns for:
// - usePeople, useCreatePerson, useUpdatePerson, useDeletePerson
// - useTestimonials, useCreateTestimonial, useApproveTestimonial
```

## Backend Requirements

The mobile app requires a running Twenty CRM backend with:

- GraphQL API enabled on `/graphql` and `/metadata`
- CORS configured to allow requests from mobile app
- Authentication enabled
- Object metadata sync completed

To start the Twenty CRM backend:

```bash
# From repository root
yarn start
```

The backend should be accessible at `http://localhost:3000`.

## Building for Production

### iOS

1. Configure app signing in `app.json`
2. Build for TestFlight/App Store:

```bash
eas build --platform ios
```

### Android

1. Configure keystore in `app.json`
2. Build APK/AAB:

```bash
eas build --platform android
```

### Expo Application Services (EAS)

For production builds and OTA updates, configure EAS:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

## Testing

### Test Credentials

Use the Twenty CRM web app credentials:
- Email: `test@example.com`
- Password: Your configured password

### Manual Testing Checklist

- [ ] Sign in with valid credentials
- [ ] Sign up new account
- [ ] Browse companies list
- [ ] Search companies
- [ ] Browse people list
- [ ] Browse opportunities
- [ ] View testimonials by status
- [ ] Sign out
- [ ] Token auto-renewal on expired token

## Troubleshooting

### Cannot connect to backend

**Problem**: Network request failed

**Solutions**:
- Ensure backend is running: `yarn start` in repository root
- Check API URL in `.env` matches your setup
- For Android emulator, use `http://10.0.2.2:3000` instead of `localhost`
- For physical devices, use computer's local IP
- Check firewall settings

### Authentication fails

**Problem**: Sign in returns 401 Unauthorized

**Solutions**:
- Verify credentials work in web app
- Check backend logs for errors
- Clear app data: Delete app and reinstall
- Verify CORS settings in backend

### GraphQL errors

**Problem**: GraphQL queries fail

**Solutions**:
- Run metadata sync: `npx nx run twenty-server:command workspace:sync-metadata`
- Verify workspace exists and is active
- Check Apollo DevTools in Metro bundler for query details

### Build errors

**Problem**: Expo build fails

**Solutions**:
- Clear cache: `expo start -c`
- Delete `node_modules` and reinstall
- Update dependencies: `yarn install`
- Check Expo SDK compatibility

## Contributing

When contributing to the mobile app:

1. Follow existing code structure and patterns
2. Use TypeScript strict mode
3. Add proper error handling
4. Test on both iOS and Android
5. Update this README for new features

## Roadmap

### Planned Features

- [ ] Offline support with local caching
- [ ] Push notifications for updates
- [ ] Create/edit functionality for all records
- [ ] File attachments and image uploads
- [ ] Advanced filtering and sorting
- [ ] Activity timeline view
- [ ] Calendar integration
- [ ] Biometric authentication (Face ID/Touch ID)
- [ ] Dark mode theme
- [ ] Multi-workspace switching

### Future Enhancements

- [ ] Notes and tasks management
- [ ] Email integration
- [ ] Real-time updates with subscriptions
- [ ] Export/import functionality
- [ ] Analytics dashboard
- [ ] Voice notes and transcription

## License

Same as Twenty CRM - see repository root for license details.

## Support

For issues and questions:
- GitHub Issues: https://github.com/twentyhq/twenty/issues
- Documentation: https://docs.twenty.com
- Community: https://twenty.com/community
