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
import SafeAreaView from 'react-native-safe-area-view';
import axios from 'react-native-axios';
import {Icon} from 'react-native-elements';
import {API_URL} from '@env';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker';
import SignatureCapture from 'react-native-signature-capture';
import {UIActivityIndicator} from 'react-native-indicators';
import {Buffer} from 'buffer';

class AppDok extends Component {
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
      ktpbase64: [],
      selfibase64: [],
      loader: false,
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.ImageData();
      this.RegisterData();
    });
  }

  RegisterData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_regis_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("oooooooop"+JSON.stringify(datastring[0].user_id));
        this.setState({
          user_id: datastring[0].user_id,
          userhp: datastring[0].userhp,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  resetSign = () => {
    this.setState({
      changed: false,
    });
    this.refs['sign'].resetImage();
  };

  ImageData = async () => {
    const self = this;
    try {
      const value = await AsyncStorage.getItem('@storage_KTP_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("==========kamerassss========"+JSON.stringify(datastring));
        self.setState({
          nameKTP: 'image' + Date.now(),
          filenameKTP: Date.now() + '.png',
          typeKTP: 'image/png',
          uriKTP: datastring['img'],
          ktpbase64: datastring['ibase64'],
        });
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }

    try {
      const value = await AsyncStorage.getItem('@storage_SELFI_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("==========kamerassss========"+JSON.stringify(datastring));
        self.setState({
          nameSelfi: 'image' + Date.now(),
          filenameSelfi: Date.now() + '.png',
          typeSelfi: 'image/png',
          uriSelfi: datastring['img'],
          selfibase64: datastring['ibase64'],
        });
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  _onSaveEvent = result => {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name

    this.setState({
      loader: true,
    });
    // Buffer SIgn
    let bufferObjSign = Buffer.from(result.encoded, 'utf8');
    let base64StringSign = bufferObjSign.toString('base64');

    // Buffer KTP
    let bufferObjKTP = Buffer.from(this.state.ktpbase64, 'utf8');
    let base64StringKTP = bufferObjKTP.toString('base64');

    // Buffer SELFI
    let bufferObjSelfi = Buffer.from(this.state.selfibase64, 'utf8');
    let base64StringSelfi = bufferObjSelfi.toString('base64');

    const {navigation} = this.props;
    //var formData = new FormData();
    var formData = new URLSearchParams();
    formData.append('user_id', this.state.user_id);
    formData.append('ktp', base64StringKTP);
    formData.append('selfi', base64StringSelfi);
    formData.append('signature', base64StringSign);
    formData.append('handphone', this.state.userhp);

    //console.log(JSON.stringify(formData));
    var config = {
      method: 'post',
      url: API_URL + `/user/updatedok`,

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },

      data: formData,
    };

    axios(config)
      .then(function (response) {
        //console.log("---->SAVE USER"+JSON.stringify(response.data));
        var profile = response.data.data;

        if (response.data.success === true) {
          alert('Terima kasih, Data anda menunggu persetujuan.');
          navigation.navigate('login');
        } else {
          alert(response.data.message);
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORlaporan' + error);
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
  };

  savedok(result) {
    this.refs['sign'].saveImage();
  }

  _onDragEvent = () => {
    // This callback will be called when the user enters signature
    //const self = this;
    this.setState({
      changed: true,
    });
    //console.log("dragged");
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
            <Text
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                fontFamily: 'TitilliumWeb-Regular',
              }}>
              1. Foto KTP
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('kameraktp')}
              style={{
                borderWidth: 1,
                borderColor: '#CCCCCC',
                borderRadius: 25,
                justifyContent: 'center',
                width: '80%',
                height: 150,
                alignSelf: 'center',
              }}>
              {this.state.ktpbase64.length > 0 ? (
                <Image
                  source={{
                    uri: `data:image/png;base64,${this.state.ktpbase64}`,
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
                <Icon
                  name="camera"
                  type="font-awesome-5"
                  size={50}
                  color="orange"
                />
              )}
            </TouchableOpacity>
            <Text
              style={{
                paddingHorizontal: 20,
                paddingVertical: 15,
                fontFamily: 'TitilliumWeb-Regular',
              }}>
              2. Foto Selfi Dengan KTP
            </Text>
            <TouchableOpacity
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
              {this.state.selfibase64.length > 0 ? (
                <Image
                  source={{
                    uri: `data:image/png;base64,${this.state.selfibase64}`,
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
                <Icon
                  name="camera"
                  type="font-awesome-5"
                  size={50}
                  color="orange"
                />
              )}
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  fontFamily: 'TitilliumWeb-Regular',
                }}>
                3. Tanda Tangan Digital
              </Text>
              <TouchableOpacity
                style={{marginTop: 15}}
                onPress={() => this.resetSign()}>
                <Text style={{color: 'blue'}}>[Reset Tanda Tangan]</Text>
              </TouchableOpacity>
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
              <SignatureCapture
                style={[{flex: 1}, styles.signature]}
                ref="sign"
                onSaveEvent={this._onSaveEvent}
                onDragEvent={this._onDragEvent}
                saveImageFileInExtStorage={false}
                showNativeButtons={false}
                showTitleLabel={false}
                backgroundColor="#FFFFFF"
                strokeColor="#000000"
                minStrokeWidth={4}
                maxStrokeWidth={4}
                viewMode={'portrait'}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.action2}>
          {this.state.loader ? (
            <UIActivityIndicator
              color="#000000"
              zIndex={999999}
              size={20}
              color="white"
              style={{left: 35, top: 14, justifyContent: 'flex-start'}}
            />
          ) : (
            <View style={{marginLeft: 35}} />
          )}
          {this.state.selfibase64 == '' ||
          this.state.ktpbase64 == '' ||
          this.state.changed == true ? (
            <TouchableOpacity
              onPress={() => this.savedok()}
              disabled={false}
              style={{
                height: 80,
                width: '90%',
                marginTop: 0,
                alignSelf: 'center',
              }}>
              <BtnStandard name="Kirim Update Dokumen" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={console.log('Disabled')}
              disabled={true}
              style={{
                height: 80,
                width: '95%',
                marginTop: 30,
                alignSelf: 'center',
              }}>
              <BtnDisabled name="Kirim Update Dokumen" />
            </TouchableOpacity>
          )}
        </View>
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
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
    width: '90%',
    height: 150,
    alignSelf: 'center',
  },
  formcontainer: {
    //position: 'absolute',
    marginTop: 7,
    height: Dimensions.get('window').height - 120,
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
  action: {
    flexDirection: 'row',
  },
  action1: {
    flexDirection: 'row',
    borderRadius: 12,
  },
  action2: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
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

export default AppDok;
