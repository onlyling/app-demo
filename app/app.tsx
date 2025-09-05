import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationStack } from './routes';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationStack />
    </SafeAreaProvider>
  );
}
