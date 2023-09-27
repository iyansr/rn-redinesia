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
  Focus,
  BackHandler,
} from 'react-native';
//import { Button } from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import BtnStandard from '../component/BtnStandard';
import BtnDisabled from '../component/BtnDisabled';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import database, {firebase} from '@react-native-firebase/database';
//import GetLocation from 'react-native-get-location'
import {UIActivityIndicator} from 'react-native-indicators';
//import DatePicker from 'react-native-date-picker'
//import PushNotification from "react-native-push-notification";
import {Icon} from 'react-native-elements';
//import { Buffer } from "buffer";
import CheckBox from '@react-native-community/checkbox';

export default class Broadcasting extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      deskripsi: '',
      title: '',
      totalPenerima: 0,
      loader: false,
      selectPenerima: [],
      selectedPenerima: '',
      selectedValuePenerima: '',
      selectedListPenerima: [],
      isPendukung: false,
      isRelawan: false,
      selectedSegmen: 'Pilih Segmen Target',
      selectSegmen: [
        'Semua Relawan',
        'Semua Pendukung',
        'Pendukung 17 - 23 Tahun',
        'Pendukung 24 - 40 Tahun',
        'Pendukung Diatas 40 Tahun',
        'Pendukung Laki-laki',
        'Pendukung Perempuan',
      ],
      selectedValueSegmen: '',
      imagesbase64: [],
      UriUploaded: '',
      Base64Images: '',
      korcammodel: [],
      user_referal: 0,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {idfrom} = this.props.route.params;
      //console.log("00------",idfrom);
      this.ProfilesData();
      this.ImageData();

      if (idfrom === 'list') {
        try {
          AsyncStorage.removeItem('@storage_BroadcastFoto_Key');
          return true;
        } catch (exception) {
          return false;
        }
        this.setState({
          imagesbase64: [],
          totalPenerima: 0,
        });
      }

      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.backAction,
      );
    });
  }

  backAction = () => {
    const {navigation} = this.props;
    try {
      AsyncStorage.removeItem('@storage_BroadcastFoto_Key');
      //return true;
      this.setState({
        imagesbase64: [],
        totalPenerima: 0,
      });
      navigation.navigate('Broadcastlist');
    } catch (exception) {
      return false;
    }
  };

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("==========ccccc========"+datastring[0].k_id);
        this.setState({
          token: datastring[0].token,
          nama_kandidat: datastring[0].k_name,
          kandidat_id: datastring[0].k_id,
          user_id: datastring[0].user_id,
          user_referal: datastring[0].user_referal,
        });
        //this.GetDataPenerimaBroadcast(datastring[0].k_id);
      } else {
        this.setState({
          session_id: null,
        });
      }
      this.getDataKorcam();
    } catch (e) {
      // error reading value
    }
  };

  GetDataPenerimaBroadcast = async segment => {
    const self = this;
    self.setState({selectPenerima: []});
    self.setState({
      loaders: true,
    });
    // console.log("RRRRRRRFFF", idkandidat);

    //console.log("fffff",whoreceived);
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/receivers/`,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    await axios(config)
      .then(function (response) {
        //console.log("---->REPORTSTOTALBRD"+JSON.stringify(response.data.data));
        let ft = [];
        let dataReceiver = response.data.data;
        let dataJumlah = 0;
        if (response.data.success === true) {
          //console.log("---->REPORTSTOTALBRDS____"+segment);
          self.setState({
            //totalPenerima : dataJumlah,
            selectPenerima: dataReceiver,
          });

          if (segment === 0) {
            //console.log("SEGMENTS", segment);
            self.setState({
              totalPenerima: self.state.selectPenerima.filter(x => x.type == 3)
                .length,
            });
          } else if (segment === 1) {
            self.setState({
              totalPenerima: self.state.selectPenerima.filter(
                x => x.type == 4 && x.isNoWa == 1,
              ).length,
            });
          } else if (segment === 2) {
            self.setState({
              totalPenerima: self.state.selectPenerima.filter(
                x => self.getAge(x.user_tgl_lahir) < 24 && x.isNoWa == 1,
              ).length,
            });
          } else if (segment === 3) {
            self.setState({
              totalPenerima: self.state.selectPenerima.filter(
                x =>
                  self.getAge(x.user_tgl_lahir) >= 24 &&
                  self.getAge(x.user_tgl_lahir) <= 40 &&
                  x.isNoWa == 1,
              ).length,
            });
          } else if (segment === 4) {
            self.setState({
              totalPenerima: self.state.selectPenerima.filter(
                x => self.getAge(x.user_tgl_lahir) > 40 && x.isNoWa == 1,
              ).length,
            });
          } else if (segment === 5) {
            self.setState({
              totalPenerima: self.state.selectPenerima.filter(
                x => x.user_gender == 0 && x.isNoWa == 1,
              ).length,
            });
          } else if (segment === 6) {
            self.setState({
              totalPenerima: self.state.selectPenerima.filter(
                x => x.user_gender == 1 && x.isNoWa == 1,
              ).length,
            });
          } else if (segment === 7) {
            self.setState({
              totalPenerima: self.state.selectPenerima.filter(
                x =>
                  x.type == 5 &&
                  x.username != self.state.user_referal &&
                  x.isNoWa == 1,
              ).length,
            });
          }
        } else {
          console.log('errorrrrrrrita');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERROR AMBIL RECEIVERSS' + error);
          //alert("ERROR KONEKSI: SILAHKAN COBA");
        } else {
          self.setState({
            loaders: false,
          });
        }
      })
      .finally(response => {
        self.setState({
          loaders: false,
        });
      });
  };

  setTitle = t => {
    this.setState({title: t});
  };

  setDeskripsi = des => {
    this.setState({deskripsi: des});
  };

  getAge = dateString => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  setFiltering = segment => {
    const self = this;
    self.GetDataPenerimaBroadcast(this.state.kandidat_id);
    //console.log("FILTER AFTER PICKED",self.state.selectPenerima);
    //selectSegmen: ["Semua Relawan", "Semua Pendukung", "Pendukung 17 - 23 Tahun", "Pendukung 24 - 40 Tahun", "Pendukung Diatas 40 Tahun", "Pendukung Laki-laki", "Pendukung Perempuan"],
    //  if(segment === 0){
    //     //console.log("SEGMENTS", segment);
    //     this.setState({
    //         totalPenerima: this.state.selectPenerima.filter(x => x.type == 3).length
    //     })
    //  }else if(segment === 1){
    //     this.setState({
    //         totalPenerima: this.state.selectPenerima.filter(x => x.type == 4).length
    //     })
    //  }else if(segment === 2){
    //     this.setState({
    //         totalPenerima: this.state.selectPenerima.filter(x => this.getAge(x.user_tgl_lahir) <  24).length
    //     })
    //  }else if(segment === 3){
    //     this.setState({
    //         totalPenerima: this.state.selectPenerima.filter(x => this.getAge(x.user_tgl_lahir) >= 24 && this.getAge(x.user_tgl_lahir) <= 40).length
    //     })
    //  }else if(segment === 4){
    //     this.setState({
    //         totalPenerima: this.state.selectPenerima.filter(x => this.getAge(x.user_tgl_lahir) > 40).length
    //     })
    //  }else if(segment === 5){
    //     this.setState({
    //         totalPenerima: this.state.selectPenerima.filter(x => x.user_gender == 0).length
    //     })
    //  }else if(segment === 6){
    //     this.setState({
    //         totalPenerima: this.state.selectPenerima.filter(x => x.user_gender == 1).length
    //     })
    //  }
  };

  ImageData = async () => {
    const self = this;
    const selectedbkat = this.state.selectedKategori;
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_BroadcastFoto_Key');
      if (value !== null) {
        //self.ProfilesData();
        const datastring = JSON.parse(value);
        // self.setFiltering(datastring.target)
        //console.log("==========TARGETTTESS======="+JSON.stringify(datastring.target));
        //var objmaps64 = [];
        //(datastring).forEach((items,index) => {
        self.state.imagesbase64.push({
          name: 'image' + Date.now(),
          filename: Date.now() + '.png',
          type: 'image/png',
          uri: datastring['img'],
          images64: datastring['ibase64'],
          selectedValueSegmen: datastring.target,
        });
        self.setState({
          UriUploaded: datastring['img'],
          Base64Images: datastring['ibase64'],
        });
        self.GetDataPenerimaBroadcast(datastring.target);
        //this.setFiltering(datastring.target);

        //console.log("=====ITEMS 65==="+ items["img"]);
        // });

        this.setState({
          imagesnormal: datastring.img,
          //images64 : array64
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

  deleteimage = e => {
    var array = [...this.state.imagesbase64]; // make a separate copy of the array
    var index = array.indexOf(e);
    // if (index !== -1) {
    //     array.splice(index, 1);
    //     this.setState({images64: array});
    // }

    var i;
    for (i = array.length - 1; i >= 0; --i) {
      // while (i-- > 0) {
      //console.log("--->>>>jjjjj"+JSON.stringify(array[i].name));
      if (array[i].name == e) {
        array.splice(i, 1);
        this.setState({imagesbase64: array});
      }
    }
    //console.log("Data dengan Index "+ id + " telah dihapus" + JSON.stringify(this.state.images64) + "total: "+this.state.images64.length);
  };

  PreparingUpload = async () => {
    //console.log(this.state.title);

    if (this.state.title != '' && this.state.deskripsi != '') {
      const self = this;
      self.setState({loader: true});
      const {navigation} = this.props;

      //console.log(this.state.title, "----", this.state.UriUploaded);
      let nama_file =
        'broadcast_' +
        this.state.kandidat_id +
        '_' +
        Math.random() +
        '_' +
        Date.now() +
        '.png';

      var formData = new FormData();
      formData.append('title', this.state.title);
      formData.append('konten', this.state.deskripsi);
      formData.append('count', this.state.totalPenerima);
      formData.append('kandidat_id', this.state.kandidat_id);
      formData.append('user_id', this.state.user_id);
      formData.append('image', {
        uri: this.state.UriUploaded,
        type: 'image/png',
        name: nama_file,
      });
      formData.append('segment', this.state.selectedValueSegmen);
      var config = {
        method: 'post',
        url: API_URL + `/broadcast/createUpload`,
        headers: {
          //'Content-Type': 'application/x-www-form-urlencoded',
          //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + self.state.token,
        },

        data: formData,
      };

      await axios(config)
        .then(function (response) {
          //console.log("---->SAVE QC"+JSON.stringify(response.data));
          var profile = response.data.data;
          if (response.data.success === true) {
            alert('Sukses');
            self.ProsesBroadcast(
              self.state.deskripsi,
              self.state.selectedValueSegmen,
              nama_file,
            );
            navigation.navigate('Broadcastlist');
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
    } else {
      showMessage({
        message: 'Form harus diisi dengan benar!',
        type: 'danger',
      });
    }
  };

  ProsesBroadcast = async (konten, segment, filename) => {
    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    formData.append('konten', konten);
    formData.append('segment', segment);
    formData.append('filename', filename);

    var config = {
      method: 'post',
      url: API_URL + `/broadcast/sendingProcess`,
      headers: {
        //'Content-Type': 'application/x-www-form-urlencoded',
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        //'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + self.state.token,
      },

      data: formData,
    };

    await axios(config)
      .then(function (response) {
        //console.log(response.data.data);
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

  uploadImage = async filename => {
    const self = this;
    const {navigation} = this.props;
    //var formData = new URLSearchParams();
    let urlData = {
      url: filename,
    };

    var config = {
      method: 'post',
      url: 'https://api.wassenger.com/v1/files',
      headers: {
        Accept: 'application/json',
        Token:
          '911a9b457c0211c9b1be5c5b64c218e092730c4d398d44c099798c07ad441ff649ddc2a6205a6d79',
      },

      data: urlData,
    };

    await axios(config)
      .then(function (response) {
        //console.log(response.data.data);
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

  render() {
    const dt = new Date();
    dt.setMonth(dt.getMonth() + 24);
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <View style={{flexDirection: 'row'}}>
          <Icon
            name="location-arrow"
            type="font-awesome-5"
            size={10}
            style={{marginTop: 5, marginLeft: 15}}
          />
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 15}}>
            {' '}
            Kirim Broadcast Whatsapp Pendukung{' '}
          </Text>
        </View>
        <ScrollView style={{marginTop: 0, marginLeft: 5}}>
          <View style={styles.formcontainer}>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text style={{textAlignVertical: 'top'}}>Pilih Target</Text>
              </View>
              <SelectDropdown
                data={this.state.selectSegmen}
                buttonStyle={{
                  width: '70%',
                  height: 40,
                  borderBottomWidth: 1,
                  borderColor: '#828282',
                  paddingHorizontal: 0,
                  backgroundColor: '#FFFFFF',
                }}
                buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                defaultButtonText={
                  this.state.selectedValueSegmen !== ''
                    ? this.state.selectSegmen[this.state.selectedValueSegmen]
                    : 'Segment Target'
                }
                dropdownStyle={{height: 300}}
                rowTextStyle={{textAlign: 'left'}}
                onSelect={(selectedItem, index) => {
                  this.setState({
                    selectedSegmen: selectedItem,
                    selectedValueSegmen: index,
                  });
                  //this.setFiltering(index);
                  this.GetDataPenerimaBroadcast(index);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                selectedRowStyle={{backgroundColor: '#f5e0d7'}}
                selectedRowTextStyle={{justifyContent: 'space-between'}}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                defaultValue={
                  this.state.selectSegmen[this.state.selectedValueSegmen]
                }
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text style={{textAlignVertical: 'top'}}>Jumlah User</Text>
              </View>
              <Text
                style={[
                  styles.usernameInput,
                  {
                    color: 'red',
                    paddingTop: 8,
                    fontSize: 17,
                    fontWeight: 'bold',
                  },
                ]}>
                {this.state.totalPenerima} Orang
              </Text>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text style={{textAlignVertical: 'top'}}>Judul Broadcast</Text>
              </View>
              <TextInput
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.title}
                onChangeText={text => this.setTitle(text)}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticonmultiline}>
                <Text style={{textAlignVertical: 'top'}}>Isi Pesan</Text>
              </View>
              <TextInput
                placeholderTextColor="#707070"
                returnKeyType="next"
                multiline={true}
                keyboardType="number"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.multilineInput}
                value={this.state.deskripsi}
                onChangeText={text => this.setDeskripsi(text)}
              />
            </View>
            <View style={{marginTop: 5}}>
              <Text style={{marginLeft: 5, fontFamily: 'TitilliumWeb-Regular'}}>
                Ambil Gambar :
              </Text>
              {this.state.imagesbase64.length === 0 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('DashboardNavigator', {
                      screen: 'imagebroadcast',
                      params: {idtarget: this.state.selectedValueSegmen},
                    })
                  }
                  style={{
                    height: 40,
                    width: '30%',
                    marginTop: 10,
                    justifyContent: 'flex-start',
                  }}>
                  <Icon
                    name="camera"
                    type="font-awesome-5"
                    size={30}
                    style={{alignSelf: 'flex-start', marginLeft: 10}}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={{flexDirection: 'row'}}>
              {this.state.imagesbase64.map(item => (
                <View
                  style={{
                    width: 150,
                    height: 150,
                    borderWidth: 0,
                    borderColor: 'black',
                    paddingTop: 2,
                  }}>
                  <TouchableOpacity
                    style={{
                      zIndex: 999999,
                      width: 130,
                      height: 70,
                      marginTop: 0,
                      borderWidth: 0,
                      borderColor: 'black',
                    }}
                    onPress={() => this.deleteimage(item['name'])}>
                    <Icon
                      name="times-circle"
                      type="font-awesome-5"
                      size={30}
                      color="red"
                      style={{
                        marginTop: 0,
                        zIndex: 9999999,
                        alignSelf: 'flex-end',
                      }}
                    />
                  </TouchableOpacity>
                  <Image
                    source={{uri: `data:image/png;base64,${item['images64']}`}}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 10,
                      borderWidth: 1,
                      marginRight: 0,
                      marginTop: -70,
                    }}
                  />
                </View>
              ))}
            </View>
            {/* <View style={styles.action1}>
                        <View style={{paddingLeft: 10}}>
                            <Text style={{textAlignVertical: 'top'}}>Total Penerima Broadcast</Text>
                            </View>
                        <View>
                            <Text style={{fontWeight: "bold"}}>: {this.state.totalPenerima} Orang</Text>
                        </View>        
                    </View>                     */}
          </View>
        </ScrollView>
        <View
          style={{
            marginTop: 20,
            width: '95%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
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
          {this.state.selectedSegmen == '' ||
          this.state.totalPenerima == 0 ||
          this.state.title == '' ||
          this.state.deskripsi == '' ||
          this.state.imagesbase64.length == 0 ? (
            <TouchableOpacity
              onPress={() => console.log('Belum Lengkap')}
              disabled={true}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
              }}>
              <BtnDisabled name="Kirim Broadcast" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.PreparingUpload()}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
                alignSelf: 'center',
              }}>
              <BtnStandard name="Kirim Broadcast" />
            </TouchableOpacity>
          )}
        </View>
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
    height: Dimensions.get('window').height - 200,
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
  lefticonlokasi: {
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

  action2: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'center',
  },
  action1: {
    flexDirection: 'row',
    borderRadius: 12,
  },
  action3: {
    marginTop: 0,
    marginBottom: 10,
    flexDirection: 'row',
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#828282',
  },
  multilineInput: {
    flex: 1,
    height: 80,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 5,
    paddingTop: -5,
    borderBottomWidth: 1,
    borderColor: '#828282',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    textAlignVertical: 'top',
  },
  lefticonmultiline: {
    height: 80,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#828282',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    textAlignVertical: 'top',
    width: 100,
  },
  leftcheck: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 5,
    alignContent: 'center',
    borderColor: '#828282',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
});
