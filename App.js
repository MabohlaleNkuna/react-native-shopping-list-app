import React from 'react';
import { Provider } from 'react-redux';
import { View, Text } from 'react-native';
import store from './redux/store';
import HomeScreen from './screens/HomeScreen';

const App = () => {
  return (
    <Provider store={store}>
      <HomeScreen />
    </Provider>
  );
};

export default App;
