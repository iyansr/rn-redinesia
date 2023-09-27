import React, { Component, useState } from 'react';
//import { createStackNavigator } from '@react-navigation/stack';
import { createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';
import landing from '../pages/front/landing'; 
import login from '../pages/front/login'; 
import signupone from '../pages/front/signupone'; 
import registrasi from '../pages/front/registrasi'; 
import registerdpt from '../pages/front/registerdpt'; 
import trial from '../pages/front/trial'; 
import updatedok from '../pages/front/updatedok'; 
import cameraktp from '../pages/front/cameraktp'; 
import cameraselfi from '../pages/front/cameraselfi'; 
import otp from '../pages/front/otp'; 

const LoginNavigatorStack = createStackNavigator();

class AppLoginRouter extends Component {

    constructor(props: Props) {  
        super(props);  
        this.state = {  
            profiledata: false,
        };  
    } 

    render(){
        const { navigation } = this.props;
        return (
            <LoginNavigatorStack.Navigator>
                <LoginNavigatorStack.Screen
                    name="landing"
                    options={{
                        headerShown: false,
                        gestureEnabled: false
                    }}
                    component={landing} />
                <LoginNavigatorStack.Screen
                    name="login"
                    options={{
                        title: 'Login',
                        headerShown: false,
                        gestureEnabled: false,
                        headerTintColor: '#4F4F4F',
                        headerLeft: ()=> null,
                        headerTitleStyle: {
                            color: '#4F4F4F', 
                        }
                    }}
                    component={login} />
                  <LoginNavigatorStack.Screen
                    name="daftar"
                    options={{
                        title: 'Mendaftar Menjadi Relawan',
                        headerShown: true,
                        gestureEnabled: false,
                        headerTintColor: '#4F4F4F',
                        //headerLeft: ()=> null,
                        headerLeft: (props) => (
                            <HeaderBackButton
                              {...props}                              
                              onPress={() => navigation.navigate("login")}
                            />
                          ),
                        headerTitleStyle: {
                            color: '#4F4F4F', 
                        }
                    }}
                    component={signupone} />     
                 <LoginNavigatorStack.Screen
                    name="registrasi"
                    options={{
                        title: 'Registrasi Relawan',
                        headerShown: true,
                        gestureEnabled: false,
                        headerTintColor: '#4F4F4F',
                        //headerLeft: ()=> null,
                        headerLeft: (props) => (
                            <HeaderBackButton
                              {...props}                              
                              onPress={() => navigation.navigate("login")}
                            />
                          ),
                        headerTitleStyle: {
                            color: '#4F4F4F', 
                        }
                    }}
                    component={registrasi} />
                <LoginNavigatorStack.Screen
                    name="registrasidpt"
                    options={{
                        title: 'Registrasi Relawan',
                        headerShown: true,
                        gestureEnabled: false,
                        headerTintColor: '#4F4F4F',
                        //headerLeft: ()=> null,
                        headerLeft: (props) => (
                            <HeaderBackButton
                              {...props}                              
                              onPress={() => navigation.navigate("login")}
                            />
                          ),
                        headerTitleStyle: {
                            color: '#4F4F4F', 
                        }
                    }}
                    component={registerdpt} />        
                <LoginNavigatorStack.Screen
                    name="updatedok"
                    options={{
                        title: 'Kirim Dokumen Relawan',
                        headerShown: true,
                        gestureEnabled: false,
                        headerTintColor: '#4F4F4F',
                        //headerLeft: ()=> null,
                        headerLeft: (props) => (
                            <HeaderBackButton
                              {...props}                              
                              onPress={() => navigation.navigate("login")}
                            />
                          ),
                        headerTitleStyle: {
                            color: '#4F4F4F', 
                        }
                    }}
                    component={updatedok} />  
               <LoginNavigatorStack.Screen
                name="kameraktp"
                options={{
                    title: 'Ambil Gambar KTP',
                    headerStyle: {
                        backgroundColor: '#040493',
                    },
                    
                    headerTitleAlign: 'center',
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS    
                }}
                component={cameraktp} />   
            <LoginNavigatorStack.Screen
                name="kameraselfi"
                options={{
                    title: 'Ambil Gambar Selfi',
                    headerStyle: {
                        backgroundColor: '#040493',
                    },
                    
                    headerTitleAlign: 'center',
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS    
                }}
                component={cameraselfi} />     
            <LoginNavigatorStack.Screen
                    name="otp"
                    options={{
                        title: 'Validasi OTP',
                        headerShown: true,
                        gestureEnabled: false,
                        headerTintColor: '#4F4F4F',
                        //headerLeft: ()=> null,
                        headerLeft: (props) => (
                            <HeaderBackButton
                              {...props}                              
                              onPress={() => navigation.navigate("login")}
                            />
                          ),
                        headerTitleStyle: {
                            color: '#4F4F4F', 
                        }
                    }}
                    component={otp} />       
              <LoginNavigatorStack.Screen
                    name="trial"
                    options={{
                        title: 'DAFTAR BARU',
                        headerShown: true,
                        gestureEnabled: false,
                        headerTintColor: '#4F4F4F',
                        //headerLeft: ()=> null,
                        headerLeft: (props) => (
                            <HeaderBackButton
                              {...props}                              
                              onPress={() => navigation.navigate("landing")}
                            />
                          ),
                        headerTitleStyle: {
                            color: '#4F4F4F', 
                        }
                    }}
                    component={trial} />                                
            </LoginNavigatorStack.Navigator>

        );
    }
}

export default AppLoginRouter;
