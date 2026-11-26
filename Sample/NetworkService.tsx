import {AppState} from 'react-native';
import {AppLifecycle} from 'react-native-applifecycle';

const networkService = async (taskData: unknown) => {
  const listener = AppLifecycle.addEventListener('change', state => {
    console.log('NetworkService:AppLifecycle:change:' + state);
  });

  console.log(
    'NetworkService:start',
    JSON.stringify({
      taskData,
      appLifecycle: AppLifecycle.currentState,
      appState: AppState.currentState,
    }),
  );

  await new Promise<void>(resolve => setTimeout(resolve, 1500));
  listener.remove();
};

export default networkService;
