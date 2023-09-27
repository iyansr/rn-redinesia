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

export default class SurveyInputScreen extends Component {
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
      pertanyaan: [],
      loader: false,
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.GetDataPertanyaan();
      this.ImageData();
      this.ProfilesData();
      this.getLocation();
    });
  }

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("==========ccccc========"+datastring[0].k_name);
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
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataPertanyaan = () => {
    this.setState({
      pertanyaan: [],
    });
    this.setState({loader: true});
    const self = this;
    const {navigation} = this.props;

    this.setState({loader: true});
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/pertanyaan`,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->AKTSTANYA"+JSON.stringify(response.data.data));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            self.state.pertanyaan.push({
              ps_id: items.ps_id,
              pertanyaan: items.ps_pertanyaan,
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

  SendReport = () => {
    //const self = this;

    if (this.state.deskripsi.length > 0) {
      var filtered = this.state.deskripsi.filter(function (el) {
        return el != null;
      });

      let arrayPJ = [];
      for (let index = 0; index < this.state.deskripsi.length; index++) {
        const element = array[index];
        //console.log("SENDD", ff, (this.state.deskripsi).indexOf(ff));
        if (this.state.deskripsi[index] != null) {
          arrayPJ.push({
            psid: index,
            jawaban: this.state.deskripsi[index],
          });
        }
      }

      //console.log("---0",JSON.stringify(arrayPJ));

      const self = this;
      self.setState({loader: true});
      const {navigation} = this.props;
      //let img64 = this.state.images64;

      // /console.log("--->images64save1"+JSON.stringify(this.state.imagesbase64[0].images64));
      let arrayImageAll = [];
      // this.state.imagesbase64.map((img) => {
      //     let bufferObjimageall = Buffer.from(img.images64, "utf8");
      //     let base64StringAll = bufferObjimageall.toString("base64");
      //     arrayImageAll.push(base64StringAll);
      // })

      //console.log("ARRAYYYYY",JSON.stringify(self.state.imagesbase64));

      let bufferObjimageDepan = Buffer.from(
        self.state.imagesbase64[0].images64,
        'utf8',
      );
      let base64StringSurvey = bufferObjimageDepan.toString('base64');

      var formData = new URLSearchParams();
      formData.append('id', this.state.identitas);
      formData.append('nama', this.state.nama);
      formData.append('umur', this.state.umur);
      formData.append('photosurvey', base64StringSurvey);
      formData.append('jawaban', JSON.stringify(arrayPJ));
      formData.append('long', this.state.long);
      formData.append('lat', this.state.lat);
      formData.append('user_id', this.state.user_id);

      var config = {
        method: 'post',
        url: API_URL + `/survey/add`,
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
            //alert(JSON.stringify(profile));
            showMessage({
              message: 'Data survey telah terkirim',
              type: 'danger',
            });
            navigation.navigate('DashboardNavigator', {
              screen: 'listsurvey',
            });
            // AsyncStorage.removeItem('@storage_Kamera_Key');
            // self.setState({
            //     imagesbase64:[],
            //     deskripsi: '',
            //     selectedValueKat: ''
            // })
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
        message: 'Form harus diisi!',
        type: 'danger',
      });
    }
  };

  render() {
    let i = 0;
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
            style={{marginTop: 5, marginLeft: 35}}
          />
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 15}}>
            {' '}
            Input Survey{' '}
          </Text>
        </View>
        <ScrollView style={{marginTop: 0, marginLeft: 5}}>
          <View style={styles.formcontainer}>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 18}}>
                  Nama{' '}
                </Text>
              </View>
              <TextInput
                placeholderTextColor="#707070"
                returnKeyType="next"
                multiline={true}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.idInput}
                value={this.state.nama}
                onChangeText={text => {
                  this.setState({
                    nama: text,
                  });
                }}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 18}}>
                  Umur{' '}
                </Text>
              </View>
              <TextInput
                placeholderTextColor="#707070"
                returnKeyType="next"
                multiline={true}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.idInput}
                keyboardType="number-pad"
                maxLength={2}
                value={this.state.umur}
                onChangeText={text => {
                  this.setState({
                    umur: text,
                  });
                }}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 18}}>
                  Identitas/No. HP{' '}
                </Text>
              </View>
              <TextInput
                placeholderTextColor="#707070"
                returnKeyType="next"
                multiline={true}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
                style={styles.idInput}
                value={this.state.identitas}
                onChangeText={text => {
                  this.setState({
                    identitas: text,
                  });
                }}
              />
            </View>
            {this.state.pertanyaan.map(item => (
              <View style={styles.action1}>
                <View style={styles.lefticon}>
                  <Text
                    style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 18}}>
                    {item.pertanyaan}
                  </Text>
                </View>
                <TextInput
                  placeholderTextColor="#707070"
                  returnKeyType="next"
                  multiline={true}
                  ref={item.ps_id}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.usernameInput}
                  value={this.state.deskripsi[item.ps_id]}
                  onChangeText={text => {
                    let inputValues = this.state.deskripsi;
                    inputValues[item.ps_id] = text;
                    this.setState({inputValues});
                    var filtered = inputValues.filter(function (el) {
                      return el != null && el != '';
                    });
                    this.setState({
                      valueValidate: filtered.length,
                    });
                    // console.log("TIMEAFTERTIME",JSON.stringify(this.state.valueValidate));
                  }}
                />
              </View>
            ))}
            <View style={{marginTop: 10}}>
              <Text style={{marginLeft: 5, fontFamily: 'TitilliumWeb-Regular'}}>
                Gambar :
              </Text>
              {this.state.imagesbase64.length === 0 ? (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('fotosurvey')}
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
              ) : (
                <View />
              )}
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
          </View>
        </ScrollView>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          {this.state.loader ? (
            <UIActivityIndicator
              color="#000000"
              zIndex={999999}
              size={20}
              style={{left: 30, bottom: 10}}
            />
          ) : (
            <View />
          )}

          {this.state.valueValidate == this.state.pertanyaan.length &&
          this.state.imagesbase64.length > 0 &&
          this.state.identitas != '' &&
          this.state.umur != '' &&
          this.state.nama != '' ? (
            <TouchableOpacity
              onPress={() => this.SendReport()}
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
              onPress={() => console.log('Disabled')}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
                alignSelf: 'center',
              }}>
              <BtnDisabled name="Kirim" />
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
    height: Dimensions.get('window').height - 60,
    padding: 15,
    borderRadius: 25.5,
  },
  lefticon: {
    height: 60,
    backgroundColor: '#FFFFFF',
    marginBottom: 0,
    color: 'black',
    paddingHorizontal: 10,
    borderBottomWidth: 0,
    //alignContent: "center",
    borderColor: '#828282',
    // alignSelf: "center",
    // alignItems: "center",
    // justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  lefticonmultiline: {
    height: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
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
    //flexDirection: 'row',
    borderRadius: 12,
  },
});
