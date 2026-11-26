/**
 * @format
 */

import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-applifecycle', () => {
  const AppLifecycle =
    require('react-native-applifecycle/jest/AppLifecycleMock').default;
  return {
    AppLifecycle,
    useAppLifecycle: () => AppLifecycle.currentState,
  };
});

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
