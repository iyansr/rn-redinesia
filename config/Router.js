import * as React from 'react';
import {Button, Text, TextInput, View, TouchableOpacity} from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardNavigator from './DashboardNavigator';
import DashboardBottomNavigator from './DashboardBottomNavigator';
import LoginNavigator from './LoginNavigator';
import CalegView from './CalegView';
import TandemView from './Tandem';
import opencamera from '../pages/report/opencamera';
import {Icon} from 'react-native-elements';

const AuthContext = React.createContext();

console.disableYellowBox = true;

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

const HeaderLeft = () => {
  const navigation = useNavigation();
  return (
    <View style={{paddingHorizontal: 16, marginTop: 12}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          borderColor: 'white',
          width: 30,
          height: 30,
        }}>
        <Icon
          name="arrow-left"
          type="font-awesome-5"
          size={20}
          color="#f59e0b"
        />
      </TouchableOpacity>
    </View>
  );
};

function HomeScreen() {
  const {signOut} = React.useContext(AuthContext);

  return (
    <View>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {signIn} = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signIn({username, password})} />
    </View>
  );
}

function ProfilesData() {
  try {
    const value = AsyncStorage.getItem('@storage_Key');
    if (value !== null) {
    }
  } catch (e) {
    // error reading value
  }
}

const Stack = createStackNavigator();

export default function App({navigation}) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="LoginNavigator"
            component={LoginNavigator}
            options={{
              headerShown: false,
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />

          <Stack.Screen
            name="DashboardBottomNavigator"
            component={DashboardBottomNavigator}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="DashboardNavigator"
            component={DashboardNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CalegView"
            component={CalegView}
            options={{
              headerShown: true,
              title: 'Laporan Untuk Kandidat',
              gestureEnabled: false,
              headerTintColor: '#4F4F4F',
              headerTitleAlign: 'center',
              headerLeft: HeaderLeft,

              headerTitleStyle: {
                color: '#4F4F4F',
                fontFamily: 'TitilliumWeb-Regular',
              },
            }}
          />
          <Stack.Screen
            name="TandemView"
            component={TandemView}
            options={{
              headerShown: true,
              title: 'Laporan Caleg Tandem',
              gestureEnabled: false,
              headerTintColor: '#4F4F4F',
              headerTitleAlign: 'center',
              headerLeft: HeaderLeft,
              headerTitleStyle: {
                color: '#4F4F4F',
                fontFamily: 'TitilliumWeb-Regular',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
