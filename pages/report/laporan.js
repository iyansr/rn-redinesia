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
import BtnDisabled from '../component/BtnDisabled';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import GetLocation from 'react-native-get-location';
import {UIActivityIndicator} from 'react-native-indicators';
import {Icon} from 'react-native-elements';
import {Buffer} from 'buffer';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import database, {firebase} from '@react-native-firebase/database';
import analytics from '@react-native-firebase/analytics';

export default class ReportScreen extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      selectKategori: [],
      images64: [],
      imagesbase64: [],
      selectedKategori: '',
      selectedValueKat: 0,
      deskripsi: '',
      nama_kandidat: '',
      kandidat_id: '',
      long: '',
      lat: '',
      selectSentimen: ['Sentimen Positif', 'Netral', 'Sentimen Negatif'],
      selectedSentimen: '-- Pilih --',
      selectedValueSentimen: -1,
      loader: false,
      isModalVisible: false,
      isSelected: false,
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.ImageData();
      this.ProfilesData();
      this.getLocation();
      //   this.setState({
      //         img: img ,
      //         imagebase64: ibase64,
      //   });
      //const { prevscreen } = this.props.route.params;
    });
  }

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        console.log('==========ccccc========' + datastring[0].k_name);
        this.setState({
          token: datastring[0].token,
          nama_kandidat: datastring[0].k_name,
          kandidat_id: datastring[0].k_id,
          user_id: datastring[0].user_id,
          usernama: datastring[0].usernama,
          username: datastring[0].username,
          idreferral: datastring[0].user_id_parent,
        });
        this.GetDataKategori();
        this.DataFirebasePoint();
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  DataFirebasePoint = () => {
    const reference = firebase
      .app()
      .database(
        'https://timsesapps-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('/point');

    const onValueChange = database()
      .ref('/point')
      .on('value', snapshot => {
        //console.log('User data: ', JSON.stringify(snapshot.val()));

        let dataRF = snapshot.val();
        //console.log("---<><><><><>",dataRF.qctps);
        this.setState({
          poinReport: dataRF.report,
        });
      });

    return () => database().ref(`/point`).off('value', onValueChange);
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

  ImageData = async () => {
    const self = this;
    const selectedbkat = this.state.selectedKategori;
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Kamera_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("==========kamerassss========"+JSON.stringify(datastring));
        //var objmaps64 = [];
        //(datastring).forEach((items,index) => {
        self.state.imagesbase64.push({
          name: 'image' + Date.now(),
          filename: Date.now() + '.png',
          type: 'image/png',
          uri: datastring['img'],
          images64: datastring['ibase64'],
        });
        //console.log("=====ITEMS 65==="+ items["img"]);
        // });

        this.setState({
          imagesnormal: datastring.img,
          //images64 : array64
        });
        this.removeItemValue('@storage_Kamera_Key');
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  removeItemValue = async key => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  };

  setDeskripsi = des => {
    this.setState({deskripsi: des});
  };

  GetDataKategori = () => {
    this.setState({
      selectKategori: [],
    });
    this.setState({loader: true});
    const self = this;
    const {navigation} = this.props;

    this.setState({loader: true});
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/kategori`,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->AKTS"+JSON.stringify(response.data.data));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            self.state.selectKategori[items.kl_id] = items.kl_nama;
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

  InjectPoint = laporan => {
    this.setState({loader: true});
    const self = this;
    const {navigation} = this.props;

    this.setState({loader: true});
    var formData = new URLSearchParams();
    formData.append('poin', this.state.poinReport);
    formData.append(
      'deskripsi',
      'Tambah ' +
        this.state.poinReport +
        ' Poin, Dari Mengirim Report :' +
        laporan,
    );

    //console.log(JSON.stringify(formData));

    var config = {
      method: 'post',
      url: API_URL + `/giftpoint`,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
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

  InjectInbox = () => {
    //console.log(nama,hp);
    this.setState({loader: true});

    var formData = new URLSearchParams();
    formData.append('user_id', this.state.idreferral);
    formData.append('title', 'Ada Laporan Baru');
    formData.append(
      'deskripsi',
      'Ada Laporan Baru Dari Relawan,\nDeskripsi: ' +
        this.state.deskripsi +
        ' (Sentimen :' +
        this.state.selectSentimen[this.state.selectedValueSentimen] +
        ').\nPelapor : ' +
        this.state.usernama +
        ' (' +
        this.state.username +
        ')',
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

  getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        //console.log(location);
        this.setState({
          long: location.longitude,
          lat: location.latitude,
        });
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };

  setVisibleModal = vdata => {
    this.setState({
      isModalVisible: !vdata,
    });
  };
  setSelection = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    });
  };

  SendReport = () => {
    const deleteFotoReport = async () => {
      try {
        await AsyncStorage.removeItem('@storage_Kamera_Key');
      } catch (e) {
        // saving error
      }
    };

    if (
      this.state.imagesbase64.length > 0 &&
      this.state.selectedKategori != '' &&
      this.state.deskripsi != ''
    ) {
      const self = this;
      self.setState({loader: true});
      const {navigation} = this.props;
      //let img64 = this.state.images64;

      //console.log("--->images64save1"+JSON.stringify(this.state.imagesbase64[0].images64));
      let arrayImageAll = [];
      this.state.imagesbase64.map(img => {
        let bufferObjimageall = Buffer.from(img.images64, 'utf8');
        let base64StringAll = bufferObjimageall.toString('base64');
        arrayImageAll.push(base64StringAll);
      });

      // let bufferObjimageall = Buffer.from(this.state.imagesbase64, "utf8");
      // let base64StringAll = bufferObjimageall.toString("base64");

      //console.log("ARRAYYYYY",JSON.stringify(arrayImageAll));

      let bufferObjimageDepan = Buffer.from(
        this.state.imagesbase64[0].images64,
        'utf8',
      );
      let base64StringDepan = bufferObjimageDepan.toString('base64');

      //console.log("LOG, IMAGEDEPAN", base64StringDepan);

      var formData = new URLSearchParams();
      formData.append('kategori', this.state.selectedValueKat);
      formData.append('deskripsi', this.state.deskripsi);
      formData.append('kandidat_id', this.state.kandidat_id);
      formData.append('long', this.state.long.toString());
      formData.append('lat', this.state.lat.toString());
      formData.append('imagedepan', base64StringDepan);
      formData.append('images', JSON.stringify(arrayImageAll));
      formData.append('user_id', this.state.user_id);
      formData.append('total', this.state.imagesbase64.length);
      formData.append('sentimen', this.state.selectedValueSentimen);
      //console.log("-->SaveLap2", JSON.stringify(formData));
      var config = {
        method: 'post',
        url: API_URL + `/laporan/add`,
        //url: `http://192.168.18.6:3001/user/login`,
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //     //Accept: 'application/json','Content-Type': 'multipart/form-data',
        // },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
          Authorization: 'Bearer ' + self.state.token,
        },
        data: formData,
      };

      axios(config)
        .then(function (response) {
          //console.log("---->SAVE LAPORAN"+JSON.stringify(response.data));
          var profile = response.data.data;

          if (response.data.success === true) {
            alert('Sukses');
            navigation.navigate('DashboardBottomNavigator', {
              //img: data.uri,
              //ibase64: data.base64,
              screen: 'Laporanku',
            });
            deleteFotoReport();
            self.InjectPoint(self.state.deskripsi);
            self.InjectInbox();
            self.setState({
              imagesbase64: [],
              deskripsi: '',
              selectedValueKat: '',
            });
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
        message: 'Form dan Gambar harus diisi!',
        type: 'danger',
      });
    }
  };

  render() {
    //console.log("----alimage"+this.state.imagesbase64.length);
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <View
          style={{
            backgroundColor: '#f59e0b',
            width: '95%',
            height: 60,
            top: -12,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            alignSelf: 'center',
          }}></View>
        <View style={{flexDirection: 'row'}}>
          <Icon
            name="location-arrow"
            type="font-awesome-5"
            size={10}
            style={{marginTop: 5, marginLeft: 15}}
          />
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 15}}>
            {' '}
            Laporan Relawan{' '}
          </Text>
        </View>
        <ScrollView style={{marginTop: 0, marginLeft: 5}}>
          <View style={styles.formcontainer}>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text>Caleg</Text>
              </View>
              <TextInput
                placeholderTextColor="#707070"
                returnKeyType="next"
                defaultValue={this.state.nama_kandidat}
                autoCapitalize="none"
                editable={false}
                style={styles.usernameInput}
                defaultValue={this.state.nama_kandidat}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text>Kategori</Text>
              </View>
              <SelectDropdown
                data={this.state.selectKategori}
                buttonStyle={{
                  width: '77%',
                  height: 40,
                  borderBottomWidth: 1,
                  borderColor: '#828282',
                  paddingHorizontal: 0,
                  backgroundColor: '#FFFFFF',
                }}
                buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                defaultButtonText={
                  this.state.selectedKategori != ''
                    ? this.state.selectedKategori
                    : 'Pilih Kategori'
                }
                dropdownStyle={{height: 200, marginLeft: -30, marginTop: -20}}
                onSelect={(selectedItem, index) => {
                  //console.log(selectedItem, index)
                  this.setState({
                    selectedKategori: selectedItem,
                    selectedValueKat: index,
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
                selectedRowTextStyle={{fontFamily: 'TitilliumWeb-Regular'}}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  //console.log("----9999"+item);
                  return item;
                }}
                search={true}
                searchInputStyle={styles.dropdown1searchInputStyleStyle}
                searchPlaceHolder={'Cari'}
                searchPlaceHolderColor={'darkgrey'}
                renderSearchInputLeftIcon={() => {
                  return (
                    <Icon
                      type="font-awesome-5"
                      name={'search'}
                      color={'#444'}
                      size={18}
                    />
                  );
                }}
                defaultValue={this.state.selectedKategori}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text>Sentimen</Text>
              </View>
              <SelectDropdown
                data={this.state.selectSentimen}
                buttonStyle={{
                  width: '75%',
                  height: 40,
                  borderBottomWidth: 1,
                  borderColor: '#828282',
                  paddingHorizontal: 0,
                  backgroundColor: '#FFFFFF',
                }}
                buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                defaultButtonText={
                  this.state.selectedSentimen != ''
                    ? this.state.selectedSentimen
                    : 'Sentimen'
                }
                dropdownStyle={{height: 160, marginLeft: -30, marginTop: -20}}
                onSelect={(selectedItem, index) => {
                  //console.log(selectedItem, index)
                  this.setState({
                    selectedSentimen: selectedItem,
                    selectedValueSentimen: index,
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
                selectedRowTextStyle={{fontFamily: 'TitilliumWeb-Regular'}}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  //console.log("----9999"+item);
                  return item;
                }}
                defaultValue={this.state.selectedKategori}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticonmultiline}>
                <Text>Deskripsi</Text>
              </View>
              <TextInput
                placeholderTextColor="#707070"
                returnKeyType="next"
                multiline={true}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.multilineInput}
                value={this.state.deskripsi}
                onChangeText={text => this.setDeskripsi(text)}
              />
            </View>

            <View style={{marginTop: 20}}>
              <Text style={{marginLeft: 5, fontFamily: 'TitilliumWeb-Regular'}}>
                Ambil Gambar :
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('DashboardNavigator', {
                    screen: 'opencamera',
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
            </View>

            <View style={{flexDirection: 'row'}}>
              <ScrollView horizontal={true}>
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
                    <Text>testt</Text>
                    <Image
                      source={{
                        uri: `data:image/jpeg;base64,${item['images64']}`,
                      }}
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
              </ScrollView>
            </View>
          </View>
        </ScrollView>
        <View style={styles.action3}>
          <View style={styles.leftcheck}>
            <CheckBox
              value={this.state.isSelected}
              //onValueChange={this.setSelection()}
              onValueChange={newValue => this.setSelection(newValue)}
            />
          </View>
          <View style={{width: '70%'}}>
            <Text style={{marginTop: 5}}>
              Saya Setuju Dengan Syarat Dan Ketentuan yang berlaku.{' '}
            </Text>
            <Text
              onPress={() => this.setVisibleModal(this.state.isModalVisible)}
              style={{
                color: 'red',
                fontFamily: 'TitilliumWeb-Regular',
                fontSize: 15,
              }}>
              Selengkapnya
            </Text>
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
          {this.state.isSelected === true &&
          this.state.selectedValueSentimen !== -1 &&
          this.state.selectedValueKat !== 0 ? (
            <TouchableOpacity
              onPress={async () => {
                await analytics().logEvent('inputlaporan', {
                  id: this.state.user_id,
                  item: this.state.usernama + ' :Input Laporan',
                  description: 'Input Laporan',
                });
                this.SendReport();
              }}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
                alignSelf: 'center',
              }}>
              <BtnStandard name="Kirim" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
              }}>
              <BtnDisabled name="Kirim" />
            </TouchableOpacity>
          )}
        </View>
        <FlashMessage position="bottom" />
        <Modal
          isVisible={this.state.isModalVisible}
          onBackButtonPress={() =>
            this.setVisibleModal(this.state.isModalVisible)
          }>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.nameText}>Informasi Penting</Text>
              <Text style={styles.followText}></Text>
            </View>
            <View
              style={{
                height: 250,
                backgroundColor: 'white',
                paddingVertical: 10,
                padding: 10,
              }}>
              <Text
                style={{fontFamily: 'TitilliumWeb-Regular', marginBottom: 5}}>
                1. Dengan Penuh Kesadaran, bersama ini saya menyetujui setiap
                persyaratan fitur Konten Buatan Pengguna (UGC) pada aplikasi
                myTimses.{' '}
              </Text>
              <Text
                style={{fontFamily: 'TitilliumWeb-Regular', marginBottom: 5}}>
                2. Dengan ini saya menyatakan Bahwa konten saya tidak mengandung
                hal yang tidak pantas, dan tidak mempromosikan konten/gambar
                yang menyerang dan memiliki nilai seksual.
              </Text>
              <Text
                style={{fontFamily: 'TitilliumWeb-Regular', marginBottom: 5}}>
                3. Apabila dikemudian hari konten saya ini dinilai melanggar,
                maka saya bersedia konten/gambar saya dihapus dari list laporan.
              </Text>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={{
                  width: '100%',
                  marginTop: 35,
                  height: 30,
                  borderWidth: 1,
                  marginRight: 2,
                  backgroundColor: '#e87735',
                }}
                onPress={() => this.setVisibleModal(this.state.isModalVisible)}>
                <Text
                  style={{
                    alignSelf: 'center',
                    top: 4,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  OK Saya Mengerti
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  formcontainer: {
    //position: 'absolute',
    marginTop: 7,
    height: Dimensions.get('window').height - 210,
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
  lefticonmultiline: {
    height: 80,
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
    textAlignVertical: 'top',
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
  action3: {
    marginTop: 0,
    marginBottom: 10,
    flexDirection: 'row',
    borderRadius: 12,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  card: {
    backgroundColor: '#fff',
    width: screen.width * 0.8,
    height: 390,
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
