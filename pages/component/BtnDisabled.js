import React from 'react';
import {
  View,
  Text, StyleSheet, TouchableOpacity
} from 'react-native';

export default (props) => {
  return (
    <View style={styles.buttonContainer}
    >
      <Text style={styles.buttonText}>
        {props.name}
            </Text>
    </View>

  );

};
const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: 46,
    borderRadius: 15,
    backgroundColor: "#cccccc",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: 'center',
  },
  buttonText: {
    
    textAlign: 'center',
    color: "#FFFFFF",
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
  }
});
