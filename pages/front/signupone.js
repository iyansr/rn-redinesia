import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';
import BtnStandard from '../component/BtnStandard';
import BtnDisabled from '../component/BtnDisabled';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import SafeAreaView from 'react-native-safe-area-view';
import {Icon} from 'react-native-elements';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId:
    '752730602230-s6s85opqdugo13hulcd6r9emn6h3gu5t.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  //googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  //openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  //profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

class AppLanding extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordlagi: '',
      secureTextEntry: true,
      secureTextEntryLagi: true,
    };
  }

  componentDidMount() {
    //console.log("=====SLEBEWW====="+API_URL);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //this.isSignedIn();
    });
  }

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  setPassword = ref => {
    this.setState({password: ref});
  };
  setPasswordLagi = ref => {
    this.setState({passwordlagi: ref});
  };
  setUsername = ref => {
    this.setState({username: ref});
    //console.log("--->V", this.validasiNomorSeluler(ref));
    if (this.validasiNomorSeluler(ref) == true) {
      this.setState({
        errorHP: false,
      });
    } else {
      this.setState({
        errorHP: true,
      });
    }
  };

  validasiNomorSeluler = phone => {
    phone = this.normalisasiNomorHP(phone);
    return this.tesNomorHP(phone) && !!this.deteksiOperatorSeluler(phone);
  };

  normalisasiNomorHP = phone => {
    phone = String(phone).trim();
    if (phone.startsWith('+62')) {
      phone = '0' + phone.slice(3);
    } else if (phone.startsWith('62')) {
      phone = '0' + phone.slice(2);
    }
    return phone.replace(/[- .]/g, '');
  };

  tesNomorHP = phone => {
    if (!phone || !/^08[1-9][0-9]{7,10}$/.test(phone)) {
      return false;
    }
    return true;
  };

  deteksiOperatorSeluler = phone => {
    const prefix = phone.slice(0, 4);
    if (['0831', '0832', '0833', '0838'].includes(prefix)) return 'axis';
    if (['0895', '0896', '0897', '0898', '0899'].includes(prefix))
      return 'three';
    if (['0817', '0818', '0819', '0859', '0878', '0877'].includes(prefix))
      return 'xl';
    if (
      ['0814', '0815', '0816', '0855', '0856', '0857', '0858'].includes(prefix)
    )
      return 'indosat';
    if (
      [
        '0812',
        '0813',
        '0852',
        '0853',
        '0821',
        '0823',
        '0822',
        '0851',
        '0811',
      ].includes(prefix)
    )
      return 'telkomsel';
    if (
      [
        '0881',
        '0882',
        '0883',
        '0884',
        '0885',
        '0886',
        '0887',
        '0888',
        '0889',
      ].includes(prefix)
    )
      return 'smartfren';
    return null;
  };

  signup = values => {
    const self = this;

    const storeData = async value => {
      try {
        await AsyncStorage.setItem(
          '@storage_registelp_Key',
          JSON.stringify(value),
        );
      } catch (e) {
        // saving error
      }
    };

    const {navigation} = this.props;
    //console.log("===ee", JSON.stringify(values));
    //var formData = new FormData();
    var formData = new URLSearchParams();
    formData.append('handphone', self.state.username);
    //formData.append('password', self.state.name);

    var config = {
      method: 'post',
      url: API_URL + `/user/signup`,

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },
      data: formData,
    };

    axios(config)
      .then(function (response) {
        //console.log("---->SAVE USER"+JSON.stringify(response.data));
        var profile = response.data.data;

        if (response.data.success === true) {
          //alert("sukses");
          storeData(profile);

          navigation.navigate('updatedok');
        } else {
          alert(response.data.message);
        }
      })
      .catch(function (error) {
        if (!error.response) {
          // network error
          //this.errorStatus = 'Error: Network Error';
          console.log('------ERORlaporan' + error);
          alert('ERROR KONEKSI: SILAHKAN COBA');
        } else {
          //this.errorStatus = error.response.data.message;
          self.setState({
            loader: false,
          });
        }
      })
      .finally(response => {
        self.setState({
          loader: false,
        });
      });
  };

  updateSecureTextEntry = status => {
    this.setState({secureTextEntry: !this.state.secureTextEntry});
  };
  updateSecureTextEntryLagi = status => {
    this.setState({secureTextEntryLagi: !this.state.secureTextEntryLagi});
  };

  isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    this.setState({isLoginScreenPresented: isSignedIn});
  };

  signInFirst = async () => {
    const storeDataGoogle = async value => {
      try {
        await AsyncStorage.setItem(
          '@storage_google_Key',
          JSON.stringify(value),
        );
      } catch (e) {
        // saving error
      }
    };

    try {
      //   const userInfo = await GoogleSignin.signIn();
      //   console.log("--->sss44", userInfo);
      //this.setState({ userInfo });

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      //console.log('User info', userInfo);

      storeDataGoogle(userInfo);
      const {navigation} = this.props;
      navigation.navigate('registrasi');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('CANCEL');
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('OP');
        GoogleSignin.signOut();
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('NA');
        // play services not available or outdated
      } else {
        console.log('----->oooo', error.code);
        // some other error happened
      }
    }
  };

  render() {
    const {navigation} = this.props;
    let h = Dimensions.get('window').height;
    let w = Dimensions.get('window').width;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <ScrollView style={{marginTop: 0, marginLeft: 2}}>
          <ImageBackground
            source={require('../../assets/images/relawan.jpg')}
            style={{
              flex: 1,
              resizeMode: 'cover',
              height: h - 45,
              width: w,
              backgroundColor: '#039dfc',
            }}>
            <View style={styles.formcontainer}>
              {/* <View style={{alignItems: 'center'}}>
                        
                        <GoogleSigninButton
                            style={{ width: '95%', borderWidth: 1, borderRadius: 8, height: 60, alignSelf: 'center' }}
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Light}
                            onPress={this.signInFirst}
                            disabled={this.state.isLoginScreenPresented}
                            />
                    </View>
                    <View style={{alignItems: 'center', marginTop: 20}}>
                        <Text style={{fontFamily: 'TitilliumWeb-Regular', color: '#FFFFFF'}}>ATAU</Text>
                    </View> */}

              <View style={styles.action1}>
                <View style={styles.lefticon}>
                  <Icon
                    name="mobile"
                    type="font-awesome-5"
                    color="#f59e0b"
                    size={15}
                  />
                </View>
                <TextInput
                  placeholder="No.Handphone"
                  placeholderTextColor="#707070"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  name="phoneNumber"
                  keyboardType="phone-pad"
                  style={styles.usernameInput}
                  onChangeText={text => this.setUsername(text)}
                  value={this.state.username}
                />
                {this.state.errorHP && (
                  <Text style={styles.error}>Masih Salah</Text>
                )}
              </View>
            </View>
            <View style={styles.action2}>
              {this.state.loader ? (
                <UIActivityIndicator
                  color="#000000"
                  zIndex={999999}
                  size={20}
                  style={{left: 30, bottom: 10}}
                />
              ) : (
                <View />
              )}
              {
                <TouchableOpacity
                  onPress={() => this.signup()}
                  disabled={false}
                  style={{
                    height: 80,
                    width: '85%',
                    marginTop: 0,
                  }}>
                  <BtnStandard name="Daftar" />
                </TouchableOpacity>
              }
            </View>
            <TouchableOpacity
              style={{marginTop: -20, alignItems: 'center'}}
              onPress={() => navigation.navigate('login')}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'TitilliumWeb-Regular',
                  fontSize: 20,
                }}>
                {' '}
                Batal{' '}
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formcontainer: {
    //position: 'absolute',
    marginTop: 320,
    height: Dimensions.get('window').height - 690,
    padding: 20,
    borderRadius: 25.5,
  },
  lefticon: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    alignContent: 'center',
    borderColor: '#828282',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  leftcheck: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 20,
    alignContent: 'center',
    borderColor: '#828282',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  action: {
    flexDirection: 'row',
  },
  action1: {
    flexDirection: 'row',
    borderRadius: 12,
    width: '100%',
    jus: 'center',
  },
  action2: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 0,
  },
  action3: {
    flexDirection: 'row',
    borderRadius: 12,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  backgroundImage2: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  usernameInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#828282',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },

  passInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#828282',
  },
  eyeInput: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: '#E68127',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    alignContent: 'center',
    borderColor: '#828282',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
  error: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'red',
    paddingHorizontal: 5,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderColor: '#828282',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    fontSize: 12,
    fontFamily: 'TitilliumWeb-Regular',
    marginLeft: -5,
  },
  errorselect: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'red',
    paddingHorizontal: 5,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderColor: '#828282',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    fontSize: 12,
    fontFamily: 'TitilliumWeb-Regular',
    marginLeft: -60,
  },
});
export default AppLanding;
