import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  StatusBar,
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
//import GetLocation from 'react-native-get-location'
import {UIActivityIndicator} from 'react-native-indicators';
import {Icon} from 'react-native-elements';
import {Buffer} from 'buffer';
//import { array } from 'yup';
import BtnDisabled from '../component/BtnDisabled';
//import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
//import Clipboard from '@react-native-clipboard/clipboard';

export default class Detailcreen extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      selectKategori: [],
      images64: [],
      imagesbase64: [],
      selectedKategori: '',
      selectedValueKat: 0,
      deskripsi: [],
      nama_kandidat: '',
      kandidat_id: '',
      selectGender: ['Pria', 'Wanita'],
      selectedGender: 'Jenis Kelamin',
      selectedValueGender: '',
      long: '',
      lat: '',
      jawaban: [],
      loader: false,
      lat: '-6.4158345',
      long: '106.8213416',
      selectKenal: ['Ya', 'Tidak'],
      selectMemilih: ['Akan Memilih Calon', 'Golput', 'Memilih calon lain'],
      selectType: ['Ideologi/Emosional', 'Rasional', 'Transaksional'],
      selectValid: ['Data Baru', 'Data Valid', 'Data Tidak Valid'],
      reason: '',
      fotobase64: [],
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {useridrelawan} = this.props.route.params;
      //console.log("86060606089", useridrelawan);
      this.ProfilesData();
      this.ImageData();
      this.setState({
        relawan_id_detail: useridrelawan,
      });
      this.GetDataRelawan(useridrelawan);
    });
  }

  ProfilesData = async () => {
    const {navigation} = this.props;

    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("==========ccccc========"+JSON.stringify(datastring));
        this.setState({
          token: datastring[0].token,
          nama_kandidat: datastring[0].k_name,
          kandidat_id: datastring[0].k_id,
          user_id: datastring[0].user_id,
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

  GetDataRelawan = idrelawan => {
    const self = this;
    self.setState({
      loader: true,
    });
    //console.log("00000---00----",idrelawan);
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/userdetail/` + idrelawan,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->REPORTS"+JSON.stringify(response.data.data));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            //console.log("----datetime1----", items.ud_selfi);
            self.setState({
              name: items.usernama,
              handphone: items.userhp,
              nik: items.user_nik,
              tmptlahir: items.user_tmpt_lahir,
              datebirth: items.user_tgl_lahir,
              selectedGender: items.user_gender > 0 ? 'Wanita' : 'Pria',
              selectedValueGender: items.user_gender,
              selectedProvince: items.provinsi,
              selectedCity: items.kota,
              selectedDistrict: items.dis_name,
              selectedSubDistrict: items.subdis_name,
              alamat: items.user_alamat,
              email: items.user_email,
              tandatangan: items.ud_signature,
              ktp: items.ud_ktp,
              selfi: items.ud_selfi,
              rt: items.user_rt,
              rw: items.user_rw,
              tps: items.user_tps,
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
          //selfi: datastring["ibase64"]
        });

        this.simpanSelfi();
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  simpanSelfi = () => {
    //console.log("dddddd", this.state.selfi);

    const deleteRekrutFoto = async () => {
      try {
        await AsyncStorage.removeItem('@storage_FotoRekrut_Key');
      } catch (e) {
        // saving error
      }
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
    formData.append('user_id', this.state.relawan_id_detail);
    formData.append('ktp', '');
    formData.append('selfi', base64StringFoto);
    formData.append('signature', '');
    formData.append('handphone', '');

    var config = {
      method: 'post',
      url:
        this.state.selfi !== null
          ? API_URL + `/uploadrekrut/update`
          : API_URL + `/uploadrekrut`,

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

        if (response.data.success === true) {
          alert('Foto telah Tersimpan.');
          //this.GetDataRelawan(this.state.relawan_id_detail)
          deleteRekrutFoto();
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

  SimpanData = value => {
    //console.log("---->>>>",this.state.selectedValueGender);

    const self = this;
    self.setState({loader: true});
    const {navigation} = this.props;

    var formData = new URLSearchParams();
    formData.append('nama', this.state.name);
    //formData.append('nik', this.state.nik);
    //formData.append('handphone', this.state.handphone);
    formData.append('gender', this.state.selectedValueGender);
    formData.append('alamat', this.state.alamat);
    formData.append('rt', this.state.rt);
    formData.append('rw', this.state.rw);
    formData.append('tps', this.state.tps);
    formData.append('id', this.state.relawan_id_detail);

    var config = {
      method: 'post',
      url: API_URL + `/user/editrekrut`,
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
          //self.simpanSelfi();
          navigation.navigate('listrekrut');
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
  setPhone = ref => {
    this.setState({handphone: ref});
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

  setNik = ref => {
    this.setState({nik: ref});
    //this.cekNik(ref)
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

        <ScrollView style={{marginTop: 0, marginLeft: 5}}>
          <View style={styles.formcontainer}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                paddingLeft: 10,
                marginBottom: 50,
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('bukakamerarekrut', {
                    backpage: 2,
                    iduser: this.state.relawan_id_detail,
                  })
                }
                style={{
                  width: 110,
                  height: 110,
                  borderWidth: 0,
                  borderColor: 'black',
                  paddingTop: 2,
                }}>
                {this.state.loader ? (
                  <UIActivityIndicator
                    color="#000000"
                    zIndex={999999}
                    size={50}
                    style={{bottom: 10}}
                  />
                ) : this.state.fotobase64.length > 0 ? (
                  <Image
                    source={{
                      uri: `data:image/png;base64,${this.state.fotobase64}`,
                    }}
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: 10,
                      borderWidth: 1,
                      marginRight: 0,
                    }}
                  />
                ) : this.state.selfi !== null ? (
                  <Image
                    source={{uri: `data:image/png;base64,${this.state.selfi}`}}
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: 10,
                      borderWidth: 1,
                      marginRight: 0,
                    }}
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/noimage.png')}
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: 10,
                      borderWidth: 1,
                      marginRight: 0,
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  NAMA
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
                  autoCapitalize="none"
                  keyboardType="default"
                  autoCorrect={false}
                  style={styles.usernameInput}
                  value={this.state.name}
                  onChangeText={text => this.setState({name: text})}
                />
              </View>
            </View>

            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  NIK
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
                  autoCapitalize="none"
                  keyboardType="default"
                  autoCorrect={false}
                  editable={false}
                  style={[styles.usernameInput, {backgroundColor: '#CFCFCF'}]}
                  value={this.state.nik}
                  onChangeText={text => this.setState({nik: text})}
                />
              </View>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  No. Whatsapp{' '}
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
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                  autoCorrect={false}
                  editable={false}
                  style={[styles.usernameInput, {backgroundColor: '#CFCFCF'}]}
                  value={this.state.handphone}
                  onChangeText={text => this.setState({handphone: text})}
                />
              </View>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  Jenis Kelamin{' '}
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
                  data={this.state.selectGender}
                  buttonStyle={{
                    width: '100%',
                    height: 40,
                    borderBottomWidth: 1,
                    borderColor: '#828282',
                    paddingHorizontal: 0,
                    backgroundColor: '#FFFFFF',
                  }}
                  buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                  defaultButtonText={
                    this.state.selectedGender != ''
                      ? this.state.selectedGender
                      : 'Jenis Kelamin'
                  }
                  dropdownStyle={{height: 100}}
                  rowTextStyle={{textAlign: 'left'}}
                  onSelect={(selectedItem, index) => {
                    //console.log(selectedItem, index)
                    this.setState({
                      selectedGender: selectedItem,
                      selectedValueGender: index,
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
                  defaultValue={this.state.selectedGender}
                />
              </View>
            </View>

            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  Alamat{' '}
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
                  autoCapitalize="none"
                  keyboardType="default"
                  autoCorrect={false}
                  style={styles.usernameInput}
                  value={this.state.alamat}
                  onChangeText={text => this.setState({alamat: text})}
                />
              </View>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  RT{' '}
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
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  autoCorrect={false}
                  style={styles.usernameInput}
                  value={this.state.rt}
                  onChangeText={text => this.setState({rt: text})}
                />
              </View>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  RW{' '}
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
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  autoCorrect={false}
                  style={styles.usernameInput}
                  value={this.state.rw}
                  onChangeText={text => this.setState({rw: text})}
                />
              </View>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  TPS{' '}
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
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  autoCorrect={false}
                  style={styles.usernameInput}
                  value={this.state.tps}
                  onChangeText={text => this.setState({tps: text})}
                />
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
                <View style={{marginLeft: 35}} />
              )}
              {this.state.name === '' ||
              this.state.handphone === '' ||
              this.state.nik === '' ||
              this.state.alamat == '' ||
              this.state.errorHP == true ? (
                <TouchableOpacity
                  onPress={() => console.log('Belum Lengkap')}
                  disabled={true}
                  style={{
                    height: 80,
                    width: '95%',
                    marginTop: 20,
                    alignSelf: 'center',
                  }}>
                  <BtnDisabled name="SIMPAN" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.SimpanData()}
                  disabled={false}
                  style={{
                    height: 80,
                    width: '95%',
                    marginTop: 20,
                  }}>
                  <BtnStandard name="SIMPAN" />
                </TouchableOpacity>
              )}
            </View>
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
    width: '40%',
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
    height: 40,
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#828282',
    borderRadius: 8,
    textAlignVertical: 'top',
    marginTop: -10,
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
});
