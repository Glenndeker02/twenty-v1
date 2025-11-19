# Twenty Mobile - Development Guide

## Quick Start

### 1. Install Dependencies

From the mobile package directory:
```bash
cd packages/twenty-mobile
yarn install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` to configure your API endpoint:
- **iOS Simulator**: `EXPO_PUBLIC_API_URL=http://localhost:3000`
- **Android Emulator**: `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`
- **Physical Device**: `EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000`

### 3. Start Twenty CRM Backend

From the repository root:
```bash
yarn start
```

This starts:
- Backend API on `http://localhost:3000`
- Frontend on `http://localhost:3001`
- Worker process

### 4. Start Mobile App

```bash
yarn start
```

Then:
- Press `i` for iOS
- Press `a` for Android
- Scan QR code for Expo Go

## Development Workflow

### File Structure Best Practices

- **Screens**: Place in `app/` directory following Expo Router conventions
- **Components**: Place reusable components in `src/components/`
- **Hooks**: Custom hooks go in `src/hooks/`
- **Services**: Business logic in `src/services/`
- **Types**: TypeScript types in `src/types/`

### Adding New Features

1. **Define Types** (`src/types/`)
```typescript
export type NewRecord = {
  id: string;
  name: string;
  // ...
};
```

2. **Create GraphQL Queries** (`src/api/records.graphql.ts`)
```typescript
export const GET_NEW_RECORDS = gql`
  query GetNewRecords($filter: NewRecordFilterInput) {
    newRecords(filter: $filter) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
```

3. **Create Hooks** (`src/hooks/useNewRecords.ts`)
```typescript
export const useNewRecords = (filter?: any) => {
  const { data, loading, error } = useQuery(GET_NEW_RECORDS, {
    variables: { filter },
  });
  // ...
};
```

4. **Create Screen** (`app/(tabs)/new-records.tsx`)
```typescript
export default function NewRecordsScreen() {
  const { records, loading } = useNewRecords();
  // ...
}
```

## GraphQL Development

### Testing GraphQL Queries

Use the GraphQL Playground at `http://localhost:3000/graphql`:

```graphql
query GetCompanies {
  companies(first: 10) {
    edges {
      node {
        id
        name
        domainName
      }
    }
  }
}
```

### Adding New Queries

1. Add query to `src/api/records.graphql.ts`
2. Create corresponding hook
3. Use in component

## Authentication Testing

### Test Accounts

Create a test account via the web app or sign up in mobile app.

### Token Debugging

```typescript
import { StorageService } from '../src/services/storage.service';

// Get tokens
const tokens = await StorageService.getAuthTokens();
console.log('Access Token:', tokens?.accessOrWorkspaceAgnosticToken.token);
```

## Common Development Tasks

### Clear Cache and Reset

```bash
# Clear Metro bundler cache
yarn start -c

# Clear all storage
# In app: Profile → Sign Out → Clear app data
```

### Update Dependencies

```bash
yarn upgrade-interactive
```

### Generate Icons/Splash

```bash
npx expo prebuild --clean
```

## Debugging

### React Native Debugger

1. Install React Native Debugger
2. Start app with `yarn start`
3. Open debugger at `http://localhost:19000`

### Console Logging

```typescript
console.log('Debug:', variable);
console.warn('Warning:', error);
console.error('Error:', error);
```

### Network Debugging

Use React Native Debugger Network tab or Flipper for network inspection.

## Performance Optimization

### List Performance

Use `FlatList` with proper optimizations:

```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### Image Optimization

```typescript
<Image
  source={{ uri: url }}
  style={styles.image}
  resizeMode="cover"
  defaultSource={require('./placeholder.png')}
/>
```

### Memoization

```typescript
const MemoizedComponent = React.memo(Component);

const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

## Testing

### Unit Tests (Jest)

```bash
yarn test
```

Example test:
```typescript
import { AuthService } from '../services/auth.service';

describe('AuthService', () => {
  it('should sign in with valid credentials', async () => {
    const result = await AuthService.signIn('test@example.com', 'password');
    expect(result.success).toBe(true);
  });
});
```

### E2E Tests (Detox - Future)

To be implemented.

## Build and Deploy

### Local Development Build

```bash
# iOS
yarn ios

# Android
yarn android
```

### Production Build with EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### OTA Updates

```bash
# Publish update
eas update --branch production --message "Bug fixes"
```

## Troubleshooting

### Metro Bundler Issues

```bash
# Kill metro
pkill -f "react-native"

# Start fresh
yarn start -c
```

### iOS Simulator Issues

```bash
# Reset simulator
xcrun simctl shutdown all
xcrun simctl erase all
```

### Android Emulator Issues

```bash
# List devices
adb devices

# Restart ADB
adb kill-server
adb start-server

# Clear app data
adb shell pm clear com.twenty.crm
```

### Dependency Issues

```bash
# Clean install
rm -rf node_modules yarn.lock
yarn install

# Rebuild native modules (if using bare workflow)
cd ios && pod install && cd ..
```

## Code Style

### Linting

```bash
yarn lint
yarn lint:fix
```

### Formatting (Prettier)

Code is automatically formatted on save if configured in your editor.

### TypeScript

- Use strict mode
- Avoid `any` types
- Define proper interfaces/types for all data structures

### Naming Conventions

- Components: PascalCase (`CompanyCard.tsx`)
- Hooks: camelCase with `use` prefix (`useCompanies.ts`)
- Services: PascalCase with Service suffix (`AuthService.ts`)
- Types: PascalCase (`Company`, `Person`)
- Constants: UPPER_SNAKE_CASE (`API_CONFIG`)

## Git Workflow

### Branch Naming

- `feature/mobile-company-detail`
- `fix/mobile-auth-error`
- `chore/mobile-update-deps`

### Commit Messages

```
feat(mobile): add company detail screen
fix(mobile): resolve authentication token expiry
chore(mobile): update dependencies
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [React Native](https://reactnative.dev/)
- [Twenty CRM Docs](https://docs.twenty.com/)
