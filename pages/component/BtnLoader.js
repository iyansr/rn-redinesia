import React from 'react';
import {
  View,
  Text, StyleSheet, TouchableOpacity
} from 'react-native';
import {UIActivityIndicator, DotIndicator} from 'react-native-indicators';

export default (props) => {
  return (
    <View style={styles.buttonContainer}
    >
      <Text style={styles.buttonText}>
        { props.loader == "true" ?
        <DotIndicator color='white' zIndex={999999} size={15} />
        :
        props.name
        }
            </Text>
    </View>

  );

};
const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: 46,
    borderRadius: 15,
    backgroundColor: "#E68127",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: 'center',
  },
  buttonText: {
    
    textAlign: 'center',
    color: "rgba(255, 255, 255, 255)",
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
  }
});
