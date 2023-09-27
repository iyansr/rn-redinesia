import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import BtnStandard from '../component/BtnStandard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaView from 'react-native-safe-area-view';
import {Icon} from 'react-native-elements';
import axios from 'react-native-axios';
import {UIActivityIndicator} from 'react-native-indicators';
import analytics from '@react-native-firebase/analytics';
import database, {firebase} from '@react-native-firebase/database';
//import md5 from 'md5';
import {API_URL} from '@env';
//import {API_URL} from "../../config/Url"
//import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';

class AppLogin extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      pekerjaan: '',
      lokasikerja: '',
      routing: false,
      email: '',
      username: '',
      password: '',
      secureTextEntry: true,
      loader: false,
      login: false,
      registerdpt: 0,
      bglanding: '',
    };
  }

  UNSAFE_componentWillMount() {
    this.ProfilesData();
    //this.GetConfig();
    // console.log(API_URL);
  }

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("=========<<<><><><>>>>>>"+BASEURL);
        if (datastring.session_id != '') {
          this.setState({
            login: true,
          });
        }
      }
      this.getDataStyle();
    } catch (e) {
      // error reading value
    }
  };

  GetConfig = async () => {
    const self = this;
    var config = {
      method: 'get',
      url: API_URL + `/config`,
    };
    await axios(config)
      .then(function (response) {
        //console.log("---->AKTS"+JSON.stringify(response.data.data));
        var configdata = response.data.data;
        self.setState({
          registerdpt: configdata[0].registerdpt,
        });
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORAKT' + error);
          //alert("ERROR KONEKSI: SILAHKAN COBA");
        } else {
          this.setState({
            loader: false,
          });
        }
      })
      .finally(response => {
        this.setState({
          loader: false,
        });
      });
  };

  getDataStyle = async () => {
    const reference = firebase
      .app()
      .database(
        'https://timsesapps-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('/style');

    const onValueChange = database()
      .ref('/style')
      .on('value', snapshot => {
        //console.log('User data: ', JSON.stringify(snapshot.val()));
        let dataRF = snapshot.val();
        this.setState({
          bglogin: dataRF.bglogin,
        });
      });
    return () => database().ref(`/style`).off('value', onValueChange);
  };

  DoLogin = () => {
    this.setState({loader: true});

    if (this.state.username == '' && this.state.password == '') {
      alert('Username dan Password Harus Diisi');
      this.setState({
        loader: false,
      });
    } else {
      const storeData = async value => {
        try {
          await AsyncStorage.setItem('@storage_Key', JSON.stringify(value));
        } catch (e) {
          // saving error
        }
      };

      const storeDPTENABLEDData = async value => {
        try {
          await AsyncStorage.setItem('@DPT_ENABLED', JSON.stringify(value));
        } catch (e) {
          // saving error
        }
      };

      const {navigation} = this.props;
      this.setState({loader: true});
      var formData = new URLSearchParams();
      formData.append('username', this.state.username);
      formData.append('password', this.state.password);

      var config = {
        method: 'post',
        url: API_URL + `/user/login`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },

        data: formData,
      };

      axios(config)
        .then(function (response) {
          var profile = response.data.data;
          if (response.data.success === true) {
            profile[0].session_id = response.data.session_id;
            //profile[0].jumlahsurvey = response.data.newsurvey;
            profile[0].token = response.data.token;
            profile[0].dptenabled = response.data.dptenabled;
            storeData(profile);
            storeDPTENABLEDData(profile[0].dptenabled);
            navigation.replace('DashboardBottomNavigator');
          } else {
            alert(response.data.message);
          }
        })
        .catch(function (error) {
          if (!error.response) {
            alert('ERROR KONEKSI: SILAHKAN COBA');
          } else {
            this.setState({
              loader: false,
            });
          }
        })
        .finally(response => {
          this.setState({
            loader: false,
          });
        });
    }
  };

  setUsername = usern => {
    this.setState({username: usern});
  };

  setPassword = passw => {
    this.setState({password: passw});
  };
  updateSecureTextEntry = status => {
    this.setState({secureTextEntry: !this.state.secureTextEntry});
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
        <ScrollView>
          <View
            style={{
              backgroundColor: '#fff',
            }}>
            <View style={styles.logoContainer}>
              <Text
                style={{
                  fontSize: 25,
                  marginTop: 80,
                  // fontWeight: 'bold',
                  fontFamily: 'FredokaOne-Regular',
                  textAlign: 'center',
                  color: '#f59e0b',
                }}>
                LOGIN
              </Text>

              <Text
                style={{
                  fontSize: 25,
                  marginTop: 10,
                  // fontWeight: 'bold',
                  fontFamily: 'FredokaOne-Regular',
                  textAlign: 'center',
                  color: '#f59e0b',
                }}>
                Redinesia
              </Text>
              <Image
                style={{
                  resizeMode: 'contain',
                  width: w - 32,
                  height: 200,
                }}
                source={require('../../assets/images/20944999.jpg')}
              />
            </View>

            <View style={styles.formcontainer}>
              <View style={styles.action}>
                <View style={styles.lefticon}>
                  <Icon
                    name="user"
                    type="font-awesome"
                    color="#f59e0b"
                    size={15}
                  />
                </View>
                <TextInput
                  placeholder="Masukan Username"
                  placeholderTextColor="#707070"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.usernameInput}
                  value={this.state.username}
                  onChangeText={text => this.setUsername(text)}
                />
              </View>

              <View style={styles.action}>
                <View style={styles.lefticon}>
                  <Icon
                    name="lock"
                    type="font-awesome-5"
                    color="#f59e0b"
                    size={15}
                  />
                </View>
                <TextInput
                  placeholder="kata sandi"
                  placeholderTextColor="#707070"
                  returnKeyType="go"
                  secureTextEntry={this.state.secureTextEntry ? true : false}
                  style={styles.passInput}
                  onChangeText={text => this.setPassword(text)}
                />
                <TouchableOpacity
                  style={styles.eyeInput}
                  onPress={() =>
                    this.updateSecureTextEntry(this.state.secureTextEntry)
                  }>
                  {this.state.secureTextEntry ? (
                    <Icon
                      name="eye"
                      type="font-awesome"
                      color="#f59e0b"
                      size={15}
                    />
                  ) : (
                    <Icon
                      name="eye-slash"
                      type="font-awesome"
                      color="#f59e0b"
                      size={15}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.action2}>
                {this.state.loader ? (
                  <UIActivityIndicator
                    color="#FFFFFF"
                    zIndex={999999}
                    size={20}
                    style={{left: 30, bottom: 10}}
                  />
                ) : (
                  <View />
                )}
                <TouchableOpacity
                  onPress={async () => {
                    await analytics().logEvent('dologin', {
                      id: this.state.username,
                      item: this.state.username + ' :Login',
                      description: 'User Melakukan Login',
                    });
                    this.DoLogin();
                  }}
                  style={{
                    height: 80,
                    width: '100%',
                    marginTop: 20,
                  }}>
                  <BtnStandard name="Masuk" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{marginTop: -20, alignItems: 'center'}}
                onPress={async () => {
                  await analytics().logEvent('doRegister', {
                    id: 1,
                    item: 'User Klik Link Melakukan Registrasi Relawan',
                    description: 'User Melakukan Registrasi Relawan',
                  });
                  navigation.navigate('registrasi');
                }}>
                <Text
                  style={{
                    color: '#f59e0b',
                    fontFamily: 'TitilliumWeb-Regular',
                  }}>
                  Registrasi Menjadi Relawan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  action: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#fda4af',
    borderWidth: 2,
  },

  action2: {
    flexDirection: 'row',
    width: '100%',
  },
  lefticon: {
    height: 40,
    backgroundColor: '#FFFFFF',
    color: 'black',
    paddingHorizontal: 10,
    alignContent: 'center',
    borderColor: '#828282',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  input: {
    width: '90%',
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    borderStyle: 'solid',
    borderColor: '#828282',
  },
  formcontainer: {
    //position: 'absolute',
    height: Dimensions.get('window').height,
    padding: 20,
  },
  usernameInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    color: 'black',
    paddingHorizontal: 10,
    borderColor: '#828282',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
  passInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    color: 'black',
    paddingHorizontal: 10,
    borderColor: '#828282',
  },
  eyeInput: {
    height: 40,
    backgroundColor: '#FFFFFF',
    color: '#E68127',
    paddingHorizontal: 10,
    alignContent: 'center',
    borderColor: '#828282',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
});
export default AppLogin;
