/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {Button, SafeAreaView, View} from 'react-native';
import {testApp} from './src/test';

const App = () => {
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={{height: 30}} />
      <Button title="Test full flow" onPress={testApp} />
      <View style={{height: 30}} />
    </SafeAreaView>
  );
};

export default App;
