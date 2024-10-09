import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Calculator from './src/Calculator';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.app}>
        <Text>App</Text>
        <Calculator/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4EB075',
  },
  app: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4EB075',
  },
});
