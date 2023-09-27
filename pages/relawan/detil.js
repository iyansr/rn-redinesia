import React, {Component, useState} from 'react';
import {
  View,
  Alert,
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
import axios from 'react-native-axios';
import {Icon} from 'react-native-elements';
import {API_URL} from '@env';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker';
import {nikParser} from 'nik-parser';
import CheckBox from '@react-native-community/checkbox';
import {UIActivityIndicator} from 'react-native-indicators';
import analytics from '@react-native-firebase/analytics';

class AppDetail extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      kodename: '',
      pekerjaan: '',
      lokasikerja: '',
      email: '',
      referral: '',
      handphone: '',
      nik: '',
      tmptlahir: '',
      selectedGender: 'Jenis Kelamin',
      selectGender: ['Pria', 'Wanita'],
      selectedValueGender: '-',
      datebirth: new Date('1940-01-01'),
      open: false,
      tanggalLahir: '',
      selectProvince: [],
      selectedProvince: '',
      selectedValueProv: '',
      selectCity: [],
      selectedCity: '',
      selectedValueCity: '',
      selectDistrict: [],
      selectedDistrict: '',
      selectedValueDistrict: '',
      alamat: '',
      isSelected: false,
      account: '',
      idaccount: 0,
      photoaccount: '',
      loader: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {useridrelawan} = this.props.route.params;
      this.setState({
        useridrelawan: useridrelawan,
      });
      //console.log("=====SLEBEWW====="+useridrelawan);
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
        //console.log("-->Profilesds", datastring[0]["userhp"]);
        if (datastring.session_id != '') {
          this.setState({
            token: datastring[0]['token'],
            userid: datastring[0]['user_id'],
            usernama: datastring[0]['usernama'],
            username: datastring[0]['username'],
            userkandidat: datastring[0]['user_relawankandidat'],
          });
        }

        this.GetDataRelawan(this.state.useridrelawan);
      }
    } catch (e) {
      // error reading value
    }
  };

  formatDate(input) {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + '/' + month + '/' + year;
  }

  GetDataRelawan = idrelawan => {
    const self = this;

    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/user/` + idrelawan,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log('---->REPORTS' + JSON.stringify(response.data.data));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            //console.log("----datetime1----", items.user_gender);
            self.setState({
              name: items.usernama,
              handphone: items.userhp,
              nik: items.user_nik,
              tmptlahir: items.user_tmpt_lahir,
              datebirth: items.user_tgl_lahir,
              gender: items.user_gender > 0 ? 'Wanita' : 'Pria',
              selectedProvince: items.provinsi,
              selectedCity: items.kota,
              selectedDistrict: items.kecamatan,
              alamat: items.user_alamat,
              email: items.user_email,
              tandatangan: items.ud_signature,
              ktp: items.ud_ktp,
              selfi: items.ud_selfi,
            });
          });
        } else {
          console.log('errorrrrrrrita');
        }
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

  Approved = status => {
    const {navigation} = this.props;
    let statustext = '';
    if (status === 1) {
      statustext = 'Menyetujui';
    } else {
      statustext = 'Menolak';
    }
    return Alert.alert(
      'Apakah Anda Yakin?',
      'Apakah anda yakin ' +
        statustext +
        ' user ' +
        this.state.name +
        ' menjadi Relawan ?',
      [
        // The "Yes" button
        {
          text: 'YA, Saya Yakin',
          onPress: async () => {
            await analytics().logEvent('approverelawan', {
              id: this.state.username,
              item:
                this.state.usernama +
                ' :Approve Relawan Bernama :' +
                this.state.name,
              description: 'Approve Relawan',
            });
            this.processApprove(status);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'Nanti Dulu',
          onPress: () => {
            navigation.navigate('newreg');
          },
        },
      ],
    );
  };

  processApprove = status => {
    const {navigation} = this.props;
    this.setState({loader: true});
    var formData = new URLSearchParams();
    formData.append('status', status);
    formData.append('kandidat', this.state.userkandidat);
    formData.append('id', this.state.useridrelawan);
    formData.append('handphone', this.state.handphone);
    //
    var config = {
      method: 'post',
      url: API_URL + `/user/approved`,

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + this.state.token,
      },
      data: formData,
    };

    axios(config)
      .then(function (response) {
        //console.log("---->LOGIN"+JSON.stringify(response.data));
        var profile = response.data.data;
        //alert(JSON.stringify(profile));
        //var API_URL = response.data.API_URL;
        if (response.data.success === true) {
          navigation.navigate('newreg');
        } else {
          alert('GAGAL');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          // network error
          //this.errorStatus = 'Error: Network Error';
          console.log('------ERORlogin' + error);
          alert('ERROR KONEKSI: SILAHKAN COBA');
        } else {
          //this.errorStatus = error.response.data.message;
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

  render() {
    const {navigation} = this.props;
    let h = Dimensions.get('window').height;
    let w = Dimensions.get('window').width;

    const phoneRegExp =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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
                  name="user"
                  type="font-awesome"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Nama Lengkap"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                editable={false}
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.name}
              />
            </View>
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
                editable={false}
                name="phoneNumber"
                style={styles.usernameInput}
                value={this.state.handphone}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="credit-card"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="NIK"
                placeholderTextColor="#707070"
                returnKeyType="next"
                editable={false}
                style={styles.usernameInput}
                value={this.state.nik}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="map"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Tempat Lahir"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.tmptlahir}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="birthday-cake"
                  type="font-awesome"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Tangggal Lahir"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.datebirth}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="venus-mars"
                  type="font-awesome"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Jenis Kelamin"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.gender}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="map-marker-alt"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Provinsi"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.selectedProvince}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="map-marker-alt"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Kota"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.selectedCity}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="map-marker-alt"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Kecamatan"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.selectedDistrict}
              />
            </View>

            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="home"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Alamat"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.alamat}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="at"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.email}
              />
            </View>
          </View>
          <View style={{marginTop: 10, marginLeft: 30, flexDirection: 'row'}}>
            <Icon name="file-upload" type="font-awesome-5" size={16} />
            <Text style={{fontFamily: 'TitilliumWeb-Regular', marginLeft: 10}}>
              Foto dan Tandatangan
            </Text>
          </View>

          <View>
            <View>
              <Text
                style={{
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                  fontFamily: 'TitilliumWeb-Regular',
                }}>
                1. Foto KTP
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 25,
                  justifyContent: 'center',
                  width: '80%',
                  height: 150,
                  alignSelf: 'center',
                }}>
                {this.state.ktp != '' ? (
                  <Image
                    source={{uri: `data:image/png;base64,${this.state.ktp}`}}
                    style={{
                      width: '100%',
                      height: 150,
                      borderRadius: 10,
                      borderWidth: 1,
                      marginRight: 0,
                    }}
                  />
                ) : (
                  <Text>User Tidak Upload KTP</Text>
                )}
              </View>
              <Text
                style={{
                  paddingHorizontal: 30,
                  paddingVertical: 15,
                  fontFamily: 'TitilliumWeb-Regular',
                }}>
                2. Foto Selfi Dengan KTP
              </Text>
              <View
                onPress={() => navigation.navigate('kameraselfi')}
                style={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 25,
                  justifyContent: 'center',
                  width: '80%',
                  height: 150,
                  alignSelf: 'center',
                }}>
                {this.state.selfi != '' ? (
                  <Image
                    source={{uri: `data:image/png;base64,${this.state.selfi}`}}
                    style={{
                      width: '100%',
                      height: 150,
                      borderRadius: 10,
                      borderWidth: 1,
                      marginRight: 0,
                    }}
                  />
                ) : (
                  <Text>User Tidak Upload Selfi</Text>
                )}
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    paddingHorizontal: 30,
                    paddingVertical: 15,
                    fontFamily: 'TitilliumWeb-Regular',
                  }}>
                  3. Tanda Tangan Digital
                </Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  justifyContent: 'center',
                  width: '80%',
                  height: 150,
                  alignSelf: 'center',
                }}>
                {this.state.tandatangan != '' ? (
                  <Image
                    source={{
                      uri: `data:image/png;base64,${this.state.tandatangan}`,
                    }}
                    style={{
                      width: '100%',
                      height: 150,
                      borderRadius: 10,
                      borderWidth: 1,
                      marginRight: 0,
                    }}
                  />
                ) : (
                  <Text>User Tidak Kirim Tanda Tangan</Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.action2}>
          {this.state.loader ? (
            <UIActivityIndicator
              color="#FFFFFF"
              zIndex={999999}
              size={20}
              style={{left: 35, bottom: 15}}
            />
          ) : (
            <View style={{marginLeft: 35}} />
          )}
          <TouchableOpacity
            onPress={() => this.Approved(1)}
            disabled={false}
            style={{
              height: 90,
              width: '90%',
              marginTop: 10,
            }}>
            <BtnStandard name="Setujui" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{marginBottom: 10, marginTop: -28, alignItems: 'center'}}
          onPress={() => this.Approved(2)}>
          <Text style={{color: '#000000', fontFamily: 'TitilliumWeb-Regular'}}>
            {' '}
            Tolak
          </Text>
        </TouchableOpacity>
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
    marginTop: 7,
    height: Dimensions.get('window').height - 200,
    padding: 20,
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
    height: 100,
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
});
export default AppDetail;
