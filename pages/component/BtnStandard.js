import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default props => {
  return (
    <View style={[styles.buttonContainer, props.style]}>
      <Text style={styles.buttonText}>{props.name}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: 48,
    borderRadius: 15,
    backgroundColor: '#f59e0b',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'TitilliumWeb-Regular',

    textAlign: 'center',
    color: 'rgba(255, 255, 255, 255)',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
  },
});
