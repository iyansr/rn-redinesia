import React, { Component, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,ImageBackground, StatusBar, Dimensions } from 'react-native';
//import BtnStandard from '../component/BtnStandard'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaView from 'react-native-safe-area-view';
//import axios from 'react-native-axios';
import { Icon } from 'react-native-elements'
import {API_URL} from "@env"
import OTPTextView from 'react-native-otp-textinput';

class AppOtp extends Component {

    constructor(props: Props) {  
        super(props);  
        this.state = {  
            otpInput: '',            
        };  
  } 

  componentDidMount() {    
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {      
       this.RegisterData();
    });
  }

  RegisterData = async () => {
    const { navigation } = this.props;
    try {
        const value = await AsyncStorage.getItem('@storage_regis_Key')
        if(value !== null) {
            const datastring = JSON.parse(value);           
            //console.log("oooooooop"+JSON.stringify(datastring[0].user_id));   
            this.setState({
                user_id: datastring[0].user_id,
                userhp : datastring[0].userhp,
                userotp: datastring[0].user_otp,
            })                  
        }
    } catch(e) {
        // error reading value
    }
}


  ValidatedOTP = (otp) => {
    const { navigation } = this.props;
     if(otp.length == 6){
            if(otp == this.state.userotp){
                navigation.navigate("updatedok");
            }else{
               this.setState({
                 otpInput: otp,
                 otpError : true
               })  
            }
     }else{

     this.setState({
        otpError: false,
        otpInput: otp
     })
    }
  }
  

  render(){
    const { navigation } = this.props;
    let h = Dimensions.get('window').height;
    let w = Dimensions.get('window').width;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor='transparent' />
            <ScrollView style={{marginTop: 20, marginLeft: 2}}>
                <View style={styles.formcontainer}>
                <View style={{marginBottom: 20}}>
                    <Text>Cek OTP Pada Nomor { this.state.userhp }</Text>
                </View>
                 <OTPTextView
                    ref={(e) => (this.input1 = e)}
                    containerStyle={styles.textInputContainer}
                    textInputStyle={styles.roundedTextInput}
                    handleTextChange={(text) => this.ValidatedOTP(text)}
                    inputCount={6}
                    keyboardType="numeric"
                    tintColor="#2C7AAE"
                    offTintColor="#B5D5EA"

                    />
                    {
                         this.state.otpError == true ?   
                    <View style={{marginBottom: 20}}>
                        <Text style={{color: 'red'}}>Otp Salah</Text>
                    </View> : <View/>
                    } 
                </View>
            </ScrollView>            
        </SafeAreaView>
    )
  }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },    
    textInputContainer: {
        marginBottom: 20,
    },
    roundedTextInput: {
        borderRadius: 10,
        borderWidth: 4,
        borderColor: '#CCCCCC'
      },
      formcontainer: {
        marginTop: 50,
        padding: 20,
        borderRadius: 25.5,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center"
    },

});

export default AppOtp;