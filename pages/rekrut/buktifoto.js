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
import database, {firebase} from '@react-native-firebase/database';
import analytics from '@react-native-firebase/analytics';

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
      fotobase64: [],
      poinRekrut: 0,
      nama: '',
      userhp: '',
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.ImageData();
      this.RegisterData();
      this.ProfilesData();
      this.DataFirebasePoint();
    });
  }

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->ProfilesdKANDIII", JSON.stringify(datastring[0]["k_id"]));
        if (datastring.session_id != '') {
          this.setState({
            login: true,
            token: datastring[0]['token'],
            usernama: datastring[0]['usernama'],
            username: datastring[0]['username'],
            userkandidat: datastring[0]['user_relawankandidat'],
            idreferral: datastring[0]['user_id_parent'],
          });
          this.GetDataProvince(datastring[0]['username']);
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  DataFirebasePoint = async () => {
    const reference = firebase
      .app()
      .database(
        'https://timsesapps-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('/point');

    const onValueChange = await database()
      .ref('/point')
      .on('value', snapshot => {
        //console.log('User data: ', JSON.stringify(snapshot.val()));

        let dataRF = snapshot.val();
        //("---<><><><><>RRRRRR",dataRF.rekrut);
        this.setState({
          poinRekrut: dataRF.rekrut,
        });
      });

    return () => database().ref(`/point`).off('value', onValueChange);
  };

  RegisterData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_rekrut_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);

        this.setState({
          user_id: datastring[0].user_id,
          userhp: datastring[0].userhp,
          nama: datastring[0].usernama,
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
      const value = await AsyncStorage.getItem('@storage_FotoRekrut_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("==========kamerassss========"+JSON.stringify(datastring));
        self.setState({
          nameFoto: 'image' + Date.now(),
          filenameFoto: Date.now() + '.png',
          typeFoto: 'image/png',
          uriFoto: datastring['img'],
          fotobase64: datastring['ibase64'],
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
    const deleteRekrutFoto = async () => {
      try {
        await AsyncStorage.removeItem('@storage_FotoRekrut_Key');
      } catch (e) {
        // saving error
      }
    };

    const InjectPoint = () => {
      //console.log(nama,hp);
      this.setState({loader: true});

      var formData = new URLSearchParams();
      formData.append('poin', this.state.poinRekrut);
      formData.append(
        'deskripsi',
        'Tambah ' +
          this.state.poinRekrut +
          ' Poin, Dari Merekrut Lengkap Dengan Foto :' +
          this.state.nama +
          ' - ' +
          this.state.userhp,
      );

      console.log(JSON.stringify(formData));

      var config = {
        method: 'post',
        url: API_URL + `/giftpoint`,
        data: formData,
        headers: {
          //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
          Authorization: 'Bearer ' + this.state.token,
        },
      };

      axios(config)
        .then(function (response) {
          //console.log("---->AKTS"+JSON.stringify(response.data.data));
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

    const InjectInbox = () => {
      //console.log(nama,hp);
      this.setState({loader: true});

      var formData = new URLSearchParams();
      formData.append('user_id', this.state.idreferral);
      formData.append('title', 'Selamat, Ada Pendukung Baru');
      formData.append(
        'deskripsi',
        'Anggota Relawan Anda Telah Menambah Pendukung Baru, Dengan nama ' +
          this.state.nama +
          ' dan didaftarkan dengan nomor : ' +
          this.state.userhp,
      );
      formData.append('type', 0);
      formData.append('url', '');

      //console.log(JSON.stringify(formData));

      var config = {
        method: 'post',
        url: API_URL + `/inject`,
        data: formData,
        headers: {
          //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
          Authorization: 'Bearer ' + this.state.token,
        },
      };

      axios(config)
        .then(function (response) {
          //console.log("---->AKTS"+JSON.stringify(response.data.data));
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

    // Buffer Foto
    let bufferObjFoto = Buffer.from(this.state.fotobase64, 'utf8');
    let base64StringFoto = bufferObjFoto.toString('base64');

    this.setState({
      loader: false,
    });

    const {navigation} = this.props;
    //var formData = new FormData();
    var formData = new URLSearchParams();
    formData.append('user_id', this.state.user_id);
    formData.append('ktp', '');
    formData.append('selfi', base64StringFoto);
    formData.append('signature', '');
    formData.append('handphone', '');

    var config = {
      method: 'post',
      url: API_URL + `/user/storedok`,

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + this.state.token,
      },

      data: formData,
    };

    axios(config)
      .then(function (response) {
        //console.log("---->SAVE USER"+JSON.stringify(response.data));
        var profile = response.data.data;
        const self = this;
        if (response.data.success === true) {
          deleteRekrutFoto();
          InjectPoint();
          InjectInbox();
          alert('Terima kasih, Data anda telah tersimpan.');
          navigation.navigate('listrekrut');
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
                marginLeft: 20,
              }}>
              Foto Pendukung
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('bukakamerarekrut', {backpage: 1})
              }
              style={{
                borderWidth: 1,
                borderColor: '#CCCCCC',
                borderRadius: 25,
                justifyContent: 'center',
                width: '80%',
                height: 150,
                alignSelf: 'center',
              }}>
              {this.state.fotobase64.length > 0 ? (
                <Image
                  source={{
                    uri: `data:image/png;base64,${this.state.fotobase64}`,
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
          </View>
        </ScrollView>
        {this.state.loader ? (
          <UIActivityIndicator
            color="#000000"
            zIndex={999999}
            size={20}
            style={{left: 30, bottom: 10}}
          />
        ) : (
          <View style={{marginLeft: 35}} />
        )}
        {this.state.fotobase64 != '' ? (
          <TouchableOpacity
            onPress={async () => {
              await analytics().logEvent('buktifotorekrut', {
                id: this.state.username,
                item:
                  this.state.usernama +
                  ' :Input Bukti Foto :' +
                  this.state.nama,
                description: 'Input Bukti Foto Rekrut Pendukung',
              });
              this._onSaveEvent();
            }}
            disabled={false}
            style={{
              height: 80,
              width: '95%',
              marginTop: 30,
              alignSelf: 'center',
            }}>
            <BtnStandard name="Kirim Data Rekrut" />
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
            <BtnDisabled name="Kirim Data Rekrut" />
          </TouchableOpacity>
        )}
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
    width: '100%',
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
