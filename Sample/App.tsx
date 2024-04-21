import React, {useState, useEffect, useCallback} from 'react';
import {
  AppState,
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
} from 'react-native';

import {AppLifecycle, useAppLifecycle} from 'react-native-applifecycle';

function App(): React.JSX.Element {
  const currentLifecycle = useAppLifecycle();

  const [lifecycleHistory, setLifecycleHistory] = useState<string[]>([
    currentLifecycle,
  ]);
  const [appStateHistory, setAppStateHistory] = useState<string[]>([
    AppState.currentState,
  ]);

  useEffect(() => {
    const listener = AppLifecycle.addEventListener('change', state => {
      setLifecycleHistory(prevState => [...prevState, state]);
    });

    return () => listener.remove();
  }, []);

  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      setAppStateHistory(prevState => [...prevState, state]);
    });

    return () => listener.remove();
  }, []);

  const handleOpenSecondActivity = useCallback(async () => {
    try {
      await Linking.openURL('sampleapp://second');
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return (
    <SafeAreaView style={{padding: 24}}>
      <StatusBar translucent={false} />
      <ScrollView>
        <Button
          title="Open second activity"
          onPress={handleOpenSecondActivity}
        />
        <Text>Current Lifecycle: {currentLifecycle}</Text>
        <Text style={{marginBottom: 12, marginTop: 24}}>
          Lifecycle History:
        </Text>
        {lifecycleHistory.map((state, index) => (
          <Text key={index}>
            {index} {'->'} {state}
          </Text>
        ))}
        <Text style={{marginBottom: 12, marginTop: 24}}>AppState History:</Text>
        {appStateHistory.map((state, index) => (
          <Text key={index}>
            {index} {'->'} {state}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
