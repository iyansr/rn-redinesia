import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  Alert,
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Focus,
} from 'react-native';
import {Button} from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import BtnStandard from '../component/BtnStandard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import GetLocation from 'react-native-get-location';
import {UIActivityIndicator} from 'react-native-indicators';
import {Icon} from 'react-native-elements';
import {Buffer} from 'buffer';
import {array} from 'yup';
import BtnDisabled from '../component/BtnDisabled';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Clipboard from '@react-native-clipboard/clipboard';

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
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {useridrelawan} = this.props.route.params;
      //console.log("86060606089", idrelawan);
      this.setState({
        relawan_id_detail: useridrelawan,
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
        //console.log("==========ccccc========"+datastring[0]["token"]);
        this.setState({
          token: datastring[0]['token'],
          nama_kandidat: datastring[0].k_name,
          kandidat_id: datastring[0].k_id,
          user_id: datastring[0].user_id,
        });
        this.GetDataRelawan(this.state.relawan_id_detail);
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
    //console.log("00000---00----",self.state.token);
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
              selectedDistrict: items.dis_name,
              selectedSubDistrict: items.subdis_name,
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

  Validated = nama => {
    const {navigation} = this.props;

    return Alert.alert(
      'Valid?',
      'Apakah Data Survey Dengan Nama ' + nama + ' Valid?',
      [
        // The "Yes" button
        {
          text: 'YA, Valid',
          onPress: () => {
            this.ValidationProcess(1);
          },
        },
        {
          text: 'Tidak Valid',
          onPress: () => {
            this.ValidationProcess(2);
          },
        },
        {
          text: 'Nanti Dulu',
          onPress: () => {
            navigation.navigate('listsurvey');
          },
        },
      ],
    );
  };

  ValidationProcess = value => {
    const self = this;
    self.setState({loader: true});
    const {navigation} = this.props;

    var formData = new URLSearchParams();
    formData.append('validator_id', this.state.user_id);
    formData.append('status_valid', value);
    formData.append('reason', this.state.reason);
    formData.append('id', this.state.survey_id_detail);

    var config = {
      method: 'post',
      url: API_URL + `/validated`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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

          navigation.navigate('listsurvey');
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

  copied = text => {
    Clipboard.setString(text);
    showMessage({
      message: 'Berhasil Tersalin',
      type: 'warning',
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

        <ScrollView style={{marginTop: 0, marginLeft: 5}}>
          <View style={styles.formcontainer}>
            <View
              style={{flexDirection: 'row', marginTop: 10, paddingLeft: 10}}>
              <View
                style={{
                  width: 130,
                  height: 130,
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
                ) : (
                  <Image
                    source={{uri: `data:image/png;base64,${this.state.selfi}`}}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 10,
                      borderWidth: 1,
                      marginRight: 0,
                    }}
                  />
                )}
              </View>
              <View style={{width: '100%'}}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      marginTop: 10,
                      justifyContent: 'center',
                      height: 40,
                      backgroundColor: '#f7f5f5',
                      width: '26%',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'TitilliumWeb-Regular',
                        fontSize: 16,
                      }}>
                      Nama
                    </Text>
                  </View>
                  <View
                    style={
                      (styles.action1,
                      {
                        marginTop: 10,
                        justifyContent: 'center',
                        paddingLeft: 5,
                        backgroundColor: '#FFFCF2',
                        height: 40,
                        width: '38%',
                      })
                    }>
                    <Text
                      style={{
                        fontFamily: 'TitilliumWeb-Regular',
                        fontSize: 16,
                      }}>
                      {this.state.name}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      marginTop: 10,
                      justifyContent: 'center',
                      height: 40,
                      backgroundColor: '#f7f5f5',
                      width: '26%',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'TitilliumWeb-Regular',
                        fontSize: 16,
                      }}>
                      Tgl. Lahir
                    </Text>
                  </View>
                  <View
                    style={
                      (styles.action1,
                      {
                        marginTop: 10,
                        justifyContent: 'center',
                        paddingLeft: 5,
                        backgroundColor: '#FFFCF2',
                        height: 40,
                        width: '38%',
                      })
                    }>
                    <Text
                      style={{
                        fontFamily: 'TitilliumWeb-Regular',
                        fontSize: 16,
                      }}>
                      {this.state.datebirth}
                    </Text>
                  </View>
                </View>
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
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'TitilliumWeb-Regular',
                    color: 'red',
                    width: '100%',
                  }}>
                  {this.state.nik}
                  <TouchableOpacity onPress={() => this.copied(this.state.nik)}>
                    <Icon
                      type="font-awesome-5"
                      name="copy"
                      size={14}
                      style={{marginLeft: 15}}
                    />
                  </TouchableOpacity>
                </Text>
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
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'TitilliumWeb-Regular',
                    color: 'red',
                    width: '100%',
                  }}>
                  {this.state.handphone}
                  <TouchableOpacity
                    onPress={() => this.copied(this.state.handphone)}>
                    <Icon
                      type="font-awesome-5"
                      name="copy"
                      size={14}
                      style={{marginLeft: 15}}
                    />
                  </TouchableOpacity>
                </Text>
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
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'TitilliumWeb-Regular',
                    color: 'red',
                  }}>
                  {this.state.gender}
                </Text>
              </View>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  Kecamatan{' '}
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
                <Text
                  style={{fontSize: 16, fontFamily: 'TitilliumWeb-Regular'}}>
                  {this.state.selectedDistrict}
                </Text>
              </View>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  Kelurahan{' '}
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
                <Text
                  style={{fontSize: 16, fontFamily: 'TitilliumWeb-Regular'}}>
                  {this.state.selectedSubDistrict}
                </Text>
              </View>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  Alamat{' '}
                </Text>
              </View>
              {/* <View style={{justifyContent: 'center', paddingLeft: 5, backgroundColor: "#FFFCF2", height: 40, width: "60%"}}>
                                <Text style={{fontSize: 16, fontFamily: 'TitilliumWeb-Regular'}}>{this.state.alamat}</Text>
                            </View> */}
              <ScrollView
                horizontal
                style={{
                  paddingLeft: 5,
                  backgroundColor: '#FFFCF2',
                  height: 40,
                  paddingTop: 5,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'TitilliumWeb-Regular',
                    justifyContent: 'center',
                  }}>
                  {this.state.alamat}
                </Text>
              </ScrollView>
            </View>

            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  Email{' '}
                </Text>
              </View>
              <ScrollView
                horizontal
                style={{
                  paddingLeft: 5,
                  backgroundColor: '#FFFCF2',
                  height: 40,
                  width: '20%',
                  paddingTop: 5,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'TitilliumWeb-Regular',
                    justifyContent: 'center',
                  }}>
                  {this.state.email}
                </Text>
              </ScrollView>
            </View>
          </View>
          <View style={{marginTop: 10, marginLeft: 30, flexDirection: 'row'}}>
            <Icon name="file-upload" type="font-awesome-5" size={16} />
            <Text style={{fontFamily: 'TitilliumWeb-Regular', marginLeft: 10}}>
              KTP dan Tandatangan
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

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    paddingHorizontal: 30,
                    paddingVertical: 15,
                    fontFamily: 'TitilliumWeb-Regular',
                  }}>
                  2. Tanda Tangan Digital
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
                  marginBottom: 50,
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
    height: Dimensions.get('window').height - 290,
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
    width: '50%',
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
