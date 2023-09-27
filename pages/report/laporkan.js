import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  StatusBar,
  Alert,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import BtnStandard from '../component/BtnStandard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, {showMessage} from 'react-native-flash-message';

import {UIActivityIndicator} from 'react-native-indicators';
import {Icon} from 'react-native-elements';
import {Buffer} from 'buffer';

import BtnDisabled from '../component/BtnDisabled';
import ImageModal from 'react-native-image-modal';

import CheckBox from '@react-native-community/checkbox';
import analytics from '@react-native-firebase/analytics';

export default class Laporkan extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataLaporan: [],
      isFetching: false,
      userid: 0,
      lat: '-6.4158345',
      long: '106.8213416',
      selectedSentimen: ['success', 'primary', 'error'],
      selectedSentVal: ['Positif', 'Netral', 'Negatif'],
      objimage: [],
      Region: [],
      selectedReason: 'Pilih Alasan',
      selectedValueReason: '',
      isSelected: false,
      selectReason: [
        'Konten Tidak Sesuai Konteks',
        'Yang Melaporkan Sudah Bukan Pendukung',
        'Foto Tidak Sesuai Dengan Deskripsi',
        'Mengandung Kekerasan',
        'Mengandung Konten Seksual',
        'Lainnya',
      ],
      deskripsi: '',
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {idlaporan} = this.props.route.params;
      //console.log("86060606089", idlaporan);

      this.setState({
        idlaporan: idlaporan,
      });
      this.ProfilesData();
    });
  }

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->Profilesds", JSON.stringify(datastring[0]["user_id"]));
        if (datastring.session_id != '') {
          this.setState({
            login: true,
            token: datastring[0]['token'],
            userid: datastring[0]['user_id'],
            usernama: datastring[0]['usernama'],
            userimage: datastring[0]['user_photo'],
            kandidat: datastring[0]['k_name'],
          });
          this.GetDataLaporan(this.state.idlaporan);
          //this.GetDataSurvey(datastring[0]["user_id"]);
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  ProsesKirim = () => {
    const {navigation} = this.props;

    return Alert.alert(
      'Apakah Anda Yakin?',
      'Apakah anda yakin Ingin Melaporkan Konten Laporan ini?',
      [
        // The "Yes" button
        {
          text: 'YA, Saya Yakin',
          onPress: async () => {
            await analytics().logEvent('doReportLaporan', {
              id: 1,
              item: this.state.usernama + 'Melaporkan Laporan Relawan',
              description: 'User Mereport Laporan Relawan',
            });
            this.KirimLaporan();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'Batal',
          onPress: () => {
            navigation.navigate('DashboardNavigator', {
              screen: 'detail',
              params: {idlaporan: this.state.idlaporan},
            });
          },
        },
      ],
    );
  };

  KirimLaporan = () => {
    const self = this;
    self.setState({loader: true});
    const {navigation} = this.props;

    var formData = new URLSearchParams();
    formData.append('lap_id', self.state.idlaporan);
    formData.append('reason_poin', self.state.selectedValueReason);
    formData.append('reason_desk', self.state.deskripsi_laporan);
    formData.append('lf_hide', self.state.isSelected === false ? 0 : 1);

    var config = {
      method: 'post',
      url: API_URL + `/reportkonten`,
      headers: {
        //'Content-Type': 'application/x-www-form-urlencoded',
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },

      data: formData,
    };

    axios(config)
      .then(function (response) {
        //console.log("---->SAVE VALIDATED"+JSON.stringify(response.data));
        var profile = response.data.data;
        if (response.data.success === true) {
          alert('Sukses');
          navigation.navigate('DashboardBottomNavigator', {screen: 'home'});
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

  setName = ref => {
    this.setState({name: ref});
  };

  GetDataLaporan = idlaporan => {
    const self = this;

    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/laporan/` + idlaporan,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log('---->REPORTSDETAIL' + JSON.stringify(response.data.data));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            //console.log("----datetime122---", items["lap_lat"]);
            self.setState({
              id: items['lap_id'],
              long: items['lap_long'],
              lat: items['lap_lat'],
              kategori: items['kl_nama'],
              pelapor: items['usernama'],
              pelapor_id: items['lap_user_id'],
              waktu: items['lap_datetime'],
              sentimen: self.state.selectedSentVal[items['lap_sentimen']],
              deskripsi: items['lap_deskripsi'],
            });
          });

          response.data.images.forEach((items, index) => {
            //console.log("imggg",items.li_image);
            self.state.objimage.push(items.li_image);
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

  setSelection = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    });
  };

  render() {
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <View style={{flexDirection: 'row'}}>
          <ScrollView horizontal={true}>
            {this.state.objimage.map((img, index) => (
              <View
                key={index}
                style={{
                  width: 150,
                  height: 150,
                  padding: 20,
                  borderWidth: 0,
                  borderColor: 'black',
                  paddingTop: 2,
                }}>
                <ImageModal
                  resizeMode="contain"
                  imageBackgroundColor="#000000"
                  source={{uri: `data:image/png;base64,${img}`}}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 10,
                    borderWidth: 1,
                    marginRight: 0,
                    marginTop: 10,
                  }}
                />
              </View>
            ))}
          </ScrollView>
        </View>
        <ScrollView style={{marginTop: 0, marginLeft: 5}}>
          <View style={styles.formcontainer}>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  multiline={true}
                  style={{
                    fontFamily: 'TitilliumWeb-Regular',
                    alignItems: 'flex-start',
                  }}>
                  Deskripsi :
                </Text>
              </View>
              <View style={{width: '70%', height: 40, alignContent: 'center'}}>
                <ScrollView horizontal={true}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      fontFamily: 'Play-Regular',
                      fontSize: 16,
                    }}>
                    {this.state.deskripsi}{' '}
                  </Text>
                </ScrollView>
              </View>
            </View>

            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  Alasan{' '}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  paddingLeft: 5,
                  backgroundColor: '#FFFCF2',
                  height: 40,
                  width: '60%',
                }}>
                <SelectDropdown
                  data={this.state.selectReason}
                  buttonStyle={{
                    width: 220,
                    height: 40,
                    borderBottomWidth: 1,
                    borderColor: '#828282',
                    paddingHorizontal: 0,
                    backgroundColor: '#FFFFFF',
                  }}
                  buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                  defaultButtonText={
                    this.state.selectedReason != ''
                      ? this.state.selectedReason
                      : 'Pilih Alasan'
                  }
                  dropdownStyle={{height: 240, width: 300, marginLeft: -80}}
                  rowTextStyle={{textAlign: 'left', fontSize: 13, color: 'red'}}
                  onSelect={(selectedItem, index) => {
                    //console.log(selectedItem, index)
                    this.setState({
                      selectedReason: selectedItem,
                      selectedValueReason: index,
                    });
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    //console.log("--> after select"+selectedItem, index);
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem;
                    //return this.state.selectedKategori
                  }}
                  selectedRowStyle={{backgroundColor: '#f5e0d7'}}
                  selectedRowTextStyle={{justifyContent: 'space-between'}}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    //console.log("----9999"+item);
                    return item;
                  }}
                  //defaultValue={values.selectgdr}
                  defaultValue={this.state.selectedReason}
                />
              </View>
            </View>

            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  Alasan{' '}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  paddingLeft: 5,
                  backgroundColor: '#FFFCF2',
                  height: 40,
                  width: '60%',
                  top: 10,
                }}>
                <TextInput
                  returnKeyType="next"
                  placeholder="Opsional"
                  autoCapitalize="none"
                  multiline={true}
                  keyboardType="default"
                  autoCorrect={false}
                  style={styles.usernameInput}
                  value={this.state.deskripsi_laporan}
                  onChangeText={text =>
                    this.setState({deskripsi_laporan: text})
                  }
                />
              </View>
            </View>
            <View style={styles.action3}>
              <View style={styles.leftcheck}>
                <CheckBox
                  value={this.state.isSelected}
                  //onValueChange={this.setSelection()}
                  onValueChange={newValue => this.setSelection(newValue)}
                />
              </View>
              <View style={{width: '70%'}}>
                <Text style={{marginTop: 5}}>Sembunyikan Laporan Ini</Text>
              </View>
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
                <View style={{marginLeft: 15}} />
              )}
              {this.state.idlaporan === '' ||
              this.state.selectedValueReason === '' ? (
                <TouchableOpacity
                  onPress={() => console.log('Belum Lengkap')}
                  disabled={true}
                  style={{
                    height: 80,
                    width: '95%',
                    marginTop: 10,
                  }}>
                  <BtnDisabled name="KIRIM" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.ProsesKirim()}
                  disabled={false}
                  style={{
                    height: 80,
                    width: '95%',
                    marginTop: 10,
                  }}>
                  <BtnStandard name="KIRIM" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: '90%',
                alignSelf: 'center',
                alignContent: 'center',
                alignItems: 'center',
                color: '#000000',
              }}>
              <Text style={{fontSize: 18, color: 'black'}}>Batal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <FlashMessage position="bottom" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formcontainer: {
    //position: 'absolute',
    marginTop: 7,
    height: Dimensions.get('window').height - 100,
    paddingLeft: 20,
    paddingTop: 10,
    borderRadius: 25.5,
    width: '95%',
  },
  lefticon: {
    height: 40,
    //backgroundColor: '#FFFFFF',
    marginBottom: 0,
    color: 'black',
    paddingHorizontal: 10,
    borderBottomWidth: 0,
    marginBottom: 5,
    //alignContent: "center",
    borderColor: '#828282',
    // alignSelf: "center",
    // alignItems: "center",
    justifyContent: 'center',
    width: '30%',
    backgroundColor: '#f7f5f5',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  lefticonmultiline: {
    height: 45,
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
    color: 'black',
    //paddingHorizontal: 10,
    //borderBottomWidth: 1,
    //alignContent: "center",
    borderColor: '#828282',
    // alignSelf: "center",
    // alignItems: "center",

    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    textAlignVertical: 'top',
  },
  usernameInput: {
    //flex: 1,
    height: 70,
    width: 220,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#828282',
    textAlignVertical: 'top',
    marginTop: 18,
  },
  idInput: {
    //flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#828282',
    borderRadius: 8,
    textAlignVertical: 'top',
    marginTop: -30,
  },
  multilineInput: {
    flex: 1,
    height: 80,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#828282',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    textAlignVertical: 'top',
  },
  action2: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'center',
    marginTop: 30,
  },
  action1: {
    flexDirection: 'row',
    borderRadius: 12,
  },
  actionJawaban: {
    //flexDirection: 'row',
    paddingLeft: 10,
    borderRadius: 12,
  },
  action3: {
    marginTop: 60,
    marginBottom: 10,
    flexDirection: 'row',
    borderRadius: 12,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
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
});
