import { registerRootComponent } from 'expo';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppWithAuth);
