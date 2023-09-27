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
  FlatList,
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
import {Badge} from '@rneui/themed';
import ImageModal from 'react-native-image-modal';

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
      dokumentab: false,
      rekruttab: false,
      laporantab: false,
      isFetching: false,
      uname: '',
      dataRef: [],
      dataLaporan: [],
      selectedSentimen: ['success', 'primary', 'error'],
      selectedSentVal: ['+', 'N', '-'],
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {idrelawan, hp} = this.props.route.params;
      //console.log("86060606089", idrelawan);
      this.setState({
        relawan_id_detail: idrelawan,
        hphone: hp,
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
        //console.log("==========cccccddd========"+datastring[0]["token"]);
        this.setState({
          token: datastring[0]['token'],
          nama_kandidat: datastring[0].k_name,
          kandidat_id: datastring[0].k_id,
          user_id: datastring[0].user_id,
        });

        this.GetDataRelawan(this.state.relawan_id_detail);
        this.GetDataLaporan(this.state.relawan_id_detail);
      } else {
        this.setState({
          session_id: null,
        });
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
    self.setState({
      loader: true,
    });
    //console.log("00000---00----",this.state.token);
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
          const items = response.data.data;
          var objmaps64 = {};
          //(response.data.data).forEach((items,index) => {
          //console.log("----datetime1----", items[0].username);
          self.setState({
            uname: items[0].username,
            name: items[0].usernama,
            handphone: items[0].userhp,
            nik: items[0].user_nik,
            tmptlahir: items[0].user_tmpt_lahir,
            datebirth: items[0].user_tgl_lahir,
            gender: items[0].user_gender > 0 ? 'Wanita' : 'Pria',
            selectedProvince: items[0].provinsi,
            selectedCity: items[0].kota,
            selectedDistrict: items[0].dis_name,
            selectedSubDistrict: items[0].subdis_name,
            alamat: items[0].user_alamat,
            email: items[0].user_email,
            tandatangan: items[0].ud_signature,
            ktp: items[0].ud_ktp,
            selfi: items[0].ud_selfi,
          });
          //});
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

  GetDataLaporan = userids => {
    this.setState({dataLaporan: [], loader: true});

    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/laporanuser/` + userids,
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
          var PATTERN = 'atribut';
          response.data.data.forEach((items, index) => {
            //console.log("----datetime1----", items.lap_datetime);
            //console.log("---------dtme----",new Date().toString())

            //self.state.dataLaporan[items.lap_id] = items.lap_datetime
            //console.log("--->GAMBAR"+items.k_foto);
            self.state.dataLaporan.push({
              id: items.lap_id,
              datetime: items.lap_datetime,
              deskripsi: items.lap_deskripsi,
              gambar: items.lap_image,
              total: items.lap_total_image,
              sentimen: items.lap_sentimen,
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
                  <ImageModal
                    resizeMode="contain"
                    imageBackgroundColor="#000000"
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
                  {this.state.uname}
                  <TouchableOpacity
                    onPress={() => this.copied(this.state.uname)}>
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
              {/* <View style={{justifyContent: 'center', paddingLeft: 5, backgroundColor: "#FFFCF2", height: 40, width: "55%"}}>
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

            {/* <View style={styles.action1}> */}
            {/* <View style={styles.lefticon}>
                            <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>Email </Text>
                        </View> */}
            {/* <View style={{justifyContent: 'center', paddingLeft: 5, backgroundColor: "#FFFCF2", height: 40, width: "55%"}}>
                                <Text style={{fontSize: 16, fontFamily: 'TitilliumWeb-Regular'}}>{this.state.email}</Text>
                            </View> */}
            {/* <ScrollView horizontal style={{paddingLeft: 5, backgroundColor: "#FFFCF2", height: 40,  paddingTop: 5}}>
                                <Text style={{fontSize: 16, fontFamily: 'TitilliumWeb-Regular', justifyContent: "center"}}>{this.state.email}</Text>
                            </ScrollView> */}
            {/* </View>     */}
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 10,
            }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  dokumentab: true,
                  rekruttab: false,
                  laporantab: false,
                })
              }
              style={{
                width: 80,
                height: 80,
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
                justifyContent: 'center',
                backgroundColor:
                  this.state.dokumentab == true ? '#CCCCCC' : '#D2F0FE',
              }}>
              <Icon name="folder" type="font-awesome-5" size={25} />
              <Text style={{alignSelf: 'center'}}>Dokumen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DashboardNavigator', {
                  screen: 'listrekrutan',
                  params: {refnum: this.state.uname},
                })
              }
              style={{
                width: 80,
                height: 80,
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
                justifyContent: 'center',
                backgroundColor: '#D2F0FE',
              }}>
              <Icon name="users" type="font-awesome-5" size={25} />
              <Text style={{alignSelf: 'center'}}>Rekrutan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  laporantab: true,
                  rekruttab: false,
                  dokumentab: false,
                })
              }
              style={{
                width: 80,
                height: 80,
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
                justifyContent: 'center',
                backgroundColor:
                  this.state.laporantab == true ? '#CCCCCC' : '#D2F0FE',
              }}>
              <Icon name="flag" type="font-awesome-5" size={25} />
              <Text style={{alignSelf: 'center'}}>Laporan</Text>
            </TouchableOpacity>
          </View>

          {this.state.dokumentab === true ? (
            <View>
              <View
                style={{marginTop: 10, marginLeft: 30, flexDirection: 'row'}}>
                <Icon name="file-upload" type="font-awesome-5" size={16} />
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', marginLeft: 10}}>
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
                    {!this.state.ktp ? (
                      <Image
                        source={require('../../assets/images/noimage.png')}
                        style={{
                          width: '100%',
                          height: 150,
                          borderRadius: 10,
                          borderWidth: 1,
                          resizeMode: 'contain',
                        }}
                      />
                    ) : (
                      <Image
                        source={{
                          uri: `data:image/png;base64,${this.state.ktp}`,
                        }}
                        style={{
                          width: '100%',
                          height: 150,
                          borderRadius: 10,
                          borderWidth: 1,
                          marginRight: 0,
                        }}
                      />
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
                    {!this.state.tandatangan ? (
                      <Image
                        source={require('../../assets/images/noimage.png')}
                        style={{
                          width: '100%',
                          height: 150,
                          borderRadius: 10,
                          borderWidth: 1,
                          resizeMode: 'contain',
                        }}
                      />
                    ) : (
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
                    )}
                  </View>
                </View>
              </View>
            </View>
          ) : null}

          {this.state.laporantab == true ? (
            <View style={{marginLeft: 20, height: 300}}>
              {this.state.dataLaporan.length === 0 ? (
                <View style={{width: '90%', alignItems: 'center'}}>
                  <Text>Tidak Ada Laporan</Text>
                </View>
              ) : (
                this.state.dataLaporan.map(item => (
                  <View
                    style={{
                      width: '90%',
                      height: 100,
                      flexDirection: 'row',
                      marginBottom: 10,
                      borderBottomColor: '#fcba03',
                      borderBottomWidth: 1,
                    }}>
                    <View style={{width: 100, height: 100}}>
                      <Image
                        source={{uri: `data:image/png;base64,${item.gambar}`}}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 60,
                          borderWidth: 1,
                          resizeMode: 'contain',
                        }}
                      />

                      <Badge
                        status={this.state.selectedSentimen[item.sentimen]}
                        value={this.state.selectedSentVal[item.sentimen]}
                        containerStyle={{
                          position: 'absolute',
                          top: 5,
                          left: 60,
                        }}
                      />
                    </View>
                    <View style={{width: '70%', paddingTop: 5}}>
                      <Text
                        style={{
                          fontFamily: 'TitilliumWeb-Regular',
                          fontSize: 12,
                        }}>
                        {this.formatDate(item.datetime.split(' ')[0]) +
                          ' ' +
                          item.datetime.split(' ')[1]}
                      </Text>
                      <View>
                        <Text
                          style={{
                            fontFamily: 'TitilliumWeb-Regular',
                            fontSize: 14,
                          }}>
                          {item.deskripsi.substring(0, 100)} ..
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          ) : null}
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
    height: Dimensions.get('window').height - 340,
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
