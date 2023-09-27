import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';
import BtnStandard from '../component/BtnStandard';
import BtnDisabled from '../component/BtnDisabled';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaView from 'react-native-safe-area-view';
import axios from 'react-native-axios';
import {Icon} from 'react-native-elements';
import {API_URL} from '@env';
import {UIActivityIndicator} from 'react-native-indicators';
//import Modal from "react-native-modal";
import SelectDropdown from 'react-native-select-dropdown';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import analytics from '@react-native-firebase/analytics';

class AppLanding extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      judulberita: '',
      //sumber : '',
      link: '',
      selectedSumber: 'Sumber Berita Online',
      selectSumber: [
        'Berita Online Web',
        'Facebook',
        'Twitter',
        'Instagram',
        'Whatsapp',
        'Threads',
      ],
      selectedValueSumber: '-',
    };
  }

  componentDidMount() {
    //console.log("=====SLEBEWW====="+API_URL);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.ProfilesData();
    });
  }

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->Profilesd", JSON.stringify(datastring));
        if (datastring.session_id != '') {
          this.setState({
            login: true,
            usernama: datastring[0]['usernama'],
            username: datastring[0]['username'],
            token: datastring[0]['token'],
            userimage: datastring[0]['user_photo'],
            kandidat: datastring[0]['k_name'],
            kandidatid: datastring[0]['k_id'],
            userid: datastring[0]['user_id'],
            usertype: datastring[0]['type'],
            jumlahsurvey: datastring[0]['jumlahsurvey'],
          });
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  registrationProcess = values => {
    const self = this;
    self.setState({
      loader: true,
    });

    const {navigation} = this.props;

    var formData = new URLSearchParams();
    var fdata = {
      judulberita: self.state.judulberita,
      link: self.state.link,
      sumber: self.state.selectedValueSumber,
      user_id: self.state.userid,
    };

    //console.log(JSON.stringify(fdata));

    var config = {
      method: 'post',
      url: API_URL + `/buzz/add`,
      headers: {
        Authorization: 'Bearer ' + self.state.token,
      },
      data: fdata,
    };

    axios(config)
      .then(function (response) {
        //console.log("---->SAVE USER"+JSON.stringify(response.data.data));
        var profile = response.data.data;

        if (response.data.success === true) {
          navigation.navigate('DashboardNavigator', {screen: 'listbuzz'});
        } else {
          alert(response.data.message);
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORlaporan' + error);
          alert('ERROR KONEKSI: SILAHKAN COBA');
        } else {
          //this.errorStatus = error.response.data.message;
          // showMessage({
          //     message: error.response.data.message,
          //     type: "danger",
          // });
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

  setJudul = ref => {
    this.setState({judulberita: ref});
  };

  setSumber = ref => {
    this.setState({sumber: ref});
  };

  setLink = ref => {
    this.setState({link: ref});
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
          <View style={styles.formcontainer}>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="newspaper"
                  type="font-awesome-5"
                  color="#934386"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Judul Berita"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.judulberita}
                onChangeText={text => this.setJudul(text)}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="hashtag"
                  type="font-awesome-5"
                  color="#934386"
                  size={15}
                />
              </View>
              <SelectDropdown
                data={this.state.selectSumber}
                buttonStyle={{
                  width: '88%',
                  height: 40,
                  borderBottomWidth: 1,
                  borderColor: '#828282',
                  paddingHorizontal: 0,
                  backgroundColor: '#FFFFFF',
                }}
                buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                defaultButtonText={
                  this.state.selectedSumber != ''
                    ? this.state.selectedSumber
                    : 'Sumber Media Online'
                }
                dropdownStyle={{height: 160, width: 200}}
                rowTextStyle={{textAlign: 'left'}}
                onSelect={(selectedItem, index) => {
                  this.setState({
                    selectedSumber: selectedItem,
                    selectedValueSumber: index,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                selectedRowStyle={{backgroundColor: '#f5e0d7'}}
                selectedRowTextStyle={{justifyContent: 'space-between'}}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                defaultValue={this.state.selectedSumber}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="link"
                  type="font-awesome-5"
                  color="#934386"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Link Berita"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                onChangeText={text => this.setLink(text)}
                value={this.state.link}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.action2}>
          {this.state.loader ? (
            <UIActivityIndicator
              color="#FFFFFF"
              zIndex={999999}
              size={20}
              style={{left: 30, bottom: 10}}
            />
          ) : (
            <View style={{marginLeft: 30}} />
          )}
          {this.state.sumber === '' ||
          this.state.judulberita === '' ||
          this.state.link === '' ? (
            <TouchableOpacity
              onPress={() => console.log('Belum Lengkap')}
              disabled={true}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
              }}>
              <BtnDisabled name="Daftar" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={async () => {
                await analytics().logEvent('inputbuzz', {
                  id: this.state.username,
                  item: this.state.usernama + ' :Input Buzz',
                  description: 'Input Buzz',
                });
                this.registrationProcess();
              }}
              disabled={false}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
              }}>
              <BtnStandard name="Daftar" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const screen = Dimensions.get('screen');
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
    marginTop: 7,
    height: Dimensions.get('window').height - 100,
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
  },
  action2: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'center',
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

  footer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: screen.width * 0.8,
    alignSelf: 'center',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  nameText: {
    fontWeight: 'bold',
    color: '#20232a',
  },
  followText: {
    fontWeight: 'bold',
    color: '#0095f6',
  },
});
export default AppLanding;
