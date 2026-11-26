import React, {useState, useEffect, useCallback} from 'react';
import {
  AppState,
  Button,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import {AppLifecycle, useAppLifecycle} from 'react-native-applifecycle';

function App(): React.JSX.Element {
  const currentLifecycle = useAppLifecycle();

  const [lifecycleHistory, setLifecycleHistory] = useState<string[]>([
    currentLifecycle,
  ]);
  const [appStateHistory, setAppStateHistory] = useState<string[]>([
    AppState.currentState ?? 'unknown',
  ]);

  useEffect(() => {
    console.log('useAppLifecycle:' + currentLifecycle);
  }, [currentLifecycle]);

  useEffect(() => {
    const listener = AppLifecycle.addEventListener('change', state => {
      console.log('AppLifecycle:change:' + state);
      setLifecycleHistory(prevState => [...prevState, state]);
    });

    return () => listener.remove();
  }, []);

  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      console.log('AppState:change:' + state);
      setAppStateHistory(prevState => [...prevState, state]);
    });

    return () => listener.remove();
  }, []);

  const handleOpenSecondActivity = useCallback(async () => {
    try {
      /**
       * Opens a second Android activity to demonstrate the difference between AppState and Lifecycle events.
       */
      await Linking.openURL('sampleapp://second');
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <ScrollView>
          <Button
            title="Open second activity"
            onPress={handleOpenSecondActivity}
          />
          <Text>Current Lifecycle: {currentLifecycle}</Text>
          <Text style={styles.sectionTitle}>Lifecycle History:</Text>
          {lifecycleHistory.map((state, index) => (
            <Text key={index}>
              {index} {'->'} {state}
            </Text>
          ))}
          <Text style={styles.sectionTitle}>AppState History:</Text>
          {appStateHistory.map((state, index) => (
            <Text key={index}>
              {index} {'->'} {state}
            </Text>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 24,
  },
});

export default App;
