import React from 'react';
import { ScrollView, Keyboard } from 'react-native';

const KeyboardDismisser = ({ children }) => {
  return (
    <ScrollView keyboardDismissMode='on-drag'>
      {children}
    </ScrollView>
  );
};

export default KeyboardDismisser;
