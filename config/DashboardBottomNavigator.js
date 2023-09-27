import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, useNavigation} from '@react-navigation/native';

import HomeScreen from '../pages/dashboard/home';
import ProfileScreen from '../pages/dashboard/profile';
import MonitoringScreen from '../pages/report/list';
import ReportScreen from '../pages/report/laporan';
import CampaignScreen from '../pages/dashboard/campaign';
import {Icon} from 'react-native-elements';
//import { createStackNavigator, HeaderBackButton, CardStyleInterpolators} from '@react-navigation/stack';

const Tab = createBottomTabNavigator();

const Router = () => {
  const navigation = useNavigation();

  return (
    <Tab.Navigator shifting="true">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => {
            const color = focused ? '#f59e0b' : 'black';
            return (
              <Text
                style={{
                  fontSize: 10,
                  color,
                  fontFamily: 'TitilliumWeb-Regular',
                  fontWeight: '400',
                }}>
                Beranda
              </Text>
            );
          },
          headerLeft: null,
          tabBarIcon: ({focused, color, size}) => {
            const colors = focused ? '#f59e0b' : 'black';
            return <Icon name="home" size={20} color={colors} />;
          },
        }}
      />
      <Tab.Screen
        name="Aktifitas"
        component={CampaignScreen}
        options={{
          tabBarLabel: ({focused}) => {
            const color = focused ? '#f59e0b' : 'black';
            return (
              <Text
                style={{
                  fontSize: 10,
                  color,
                  fontFamily: 'TitilliumWeb-Regular',
                  fontWeight: '400',
                }}>
                Aktifitas
              </Text>
            );
          },
          tabBarIcon: ({focused, color, size}) => {
            const colors = focused ? '#f59e0b' : 'black';
            return <Icon name="flag" size={20} color={colors} />;
          },
          headerLeft: null,
          headerRight: props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('DashboardNavigator', {
                      screen: 'inputevent',
                    })
                  }
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                    marginRight: 20,
                  }}>
                  <Icon
                    name="plus"
                    type="font-awesome-5"
                    size={20}
                    color="red"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportScreen}
        options={{
          tabBarLabel: '',
          headerShown: false,
          tabBarIcon: ({color}) => (
            <View
              style={{
                position: 'absolute',
                //bottom: 0, // space from bottombar
                height: 45,
                width: 45,
                marginTop: 10,
                borderRadius: 45,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 40,
                borderWidth: 2,
                borderColor: 'black',
                borderRadius: 40,
              }}>
              <Icon
                name="plus-circle"
                type="font-awesome-5"
                color="#f59e0b"
                size={38}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Laporanku"
        component={MonitoringScreen}
        options={{
          tabBarLabel: ({focused}) => {
            const color = focused ? '#f59e0b' : 'black';
            return (
              <Text
                style={{
                  fontSize: 10,
                  color,
                  fontFamily: 'TitilliumWeb-Regular',
                  fontWeight: '400',
                }}>
                Laporanku
              </Text>
            );
          },

          tabBarIcon: ({focused, color, size}) => {
            const colors = focused ? '#f59e0b' : 'black';
            return (
              <Icon
                name="chart-pie"
                type="font-awesome-5"
                size={20}
                color={colors}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({focused}) => {
            const color = focused ? '#f59e0b' : 'black';
            return (
              <Text
                style={{
                  fontSize: 10,
                  color,
                  fontFamily: 'TitilliumWeb-Regular',
                  fontWeight: '400',
                }}>
                Profile
              </Text>
            );
          },
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            const colors = focused ? '#f59e0b' : 'black';
            return (
              <Icon name="user" type="font-awesome" size={20} color={colors} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Router;
