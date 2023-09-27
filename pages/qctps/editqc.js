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
import BtnDisabled from '../component/BtnDisabled';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import GetLocation from 'react-native-get-location';
import {UIActivityIndicator} from 'react-native-indicators';
import DatePicker from 'react-native-date-picker';
import PushNotification from 'react-native-push-notification';
import {Icon} from 'react-native-elements';
import {Buffer} from 'buffer';
import ImageModal from 'react-native-image-modal';

export default class QCEditScreen extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      deskripsi: '',
      long: '',
      lat: '',
      loader: false,
      tglevent: new Date(),
      open: false,
      tps: 0,
      totaldpt: 0,
      totalsuara: 0,
      totalsuaracaleg: 0,
      totalsuarapartai: 0,
      imagesbase64: [],
      kel_id: '',
      namasaksi: '',
      hpsaksi: '',
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {idqc, pscreen} = this.props.route.params;

      this.setState({
        idquickcount: idqc,
        pscreen: pscreen,
      });

      this.ProfilesData(idqc);
      this.getLocation();
      this.ImageData();
    });
  }

  ProfilesData = async idqc => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        this.setState({
          token: datastring[0].token,
          nama_kandidat: datastring[0].k_name,
          kandidat_id: datastring[0].k_id,
          user_id: datastring[0].user_id,
          provinsi: datastring[0].provinsi,
          kota: datastring[0].kota,
          kecamatan: datastring[0].kecamatan,
          kelurahan: datastring[0].kelurahan,
          kel_id: datastring[0].user_kel,
        });

        this.GetDataQCByID(idqc);
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  setDeskripsi = des => {
    this.setState({deskripsi: des});
  };

  setTps = des => {
    this.setState({tps: des});
  };

  setTotalDPT = t => {
    this.setState({totaldpt: t});
  };

  setTotalSuara = t => {
    this.setState({totalsuara: t});
  };

  setTotalSuaraCaleg = t => {
    this.setState({totalsuaracaleg: t});
  };

  setTotalSuaraPartai = t => {
    this.setState({totalsuarapartai: t});
  };

  getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
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
      const value = await AsyncStorage.getItem('@storage_QC_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);

        //var objmaps64 = [];
        //(datastring).forEach((items,index) => {
        self.state.imagesbase64.push({
          name: 'image' + Date.now(),
          filename: Date.now() + '.png',
          type: 'image/png',
          uri: datastring['img'],
          images64: datastring['ibase64'],
        });

        // });

        this.setState({
          imagesnormal: datastring.img,
          //images64 : array64
        });
        this.removeItemValue('@storage_QC_Key');
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataQCByID = idqc => {
    const self = this;
    //console.log("---->", idqc);
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/qctpsbyid/` + idqc,
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
          let dataqc = response.data.success;
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            //console.log("----datetime1----", items.qc_no_tps);
            if (self.state.pscreen === 'list') {
              self.setState({
                tps: items.qc_no_tps,
                totaldpt: items.qc_total_dpt_real,
                totalsuara: items.qc_total_suara_masuk,
                totalsuaracaleg: items.qc_suara_sah_caleg,
                totalsuarapartai: items.qc_total_suara_partai,
                user_id_saksi: items.qc_user_id,
                namasaksi: items.usernama,
                hpsaksi: items.userhp,
              });

              self.state.imagesbase64.push({
                images64: items.qc_gbr_perolehan,
              });
            }
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

  removeItemValue = async key => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  };

  SaveQCTPS = () => {
    if (
      this.state.totalsuaracaleg != '' &&
      this.state.totalsuara != '' &&
      this.state.tps != '' &&
      this.state.totaldpt != '' &&
      parseInt(this.state.totaldpt) >= parseInt(this.state.totalsuara) &&
      parseInt(this.state.totalsuara) >= parseInt(this.state.totalsuaracaleg)
    ) {
      const self = this;
      self.setState({loader: true});
      const {navigation} = this.props;

      let bufferObjimageQC = Buffer.from(
        self.state.imagesbase64[0].images64,
        'utf8',
      );
      let base64StringQC = bufferObjimageQC.toString('base64');

      var formData = new URLSearchParams();
      //formData.append('user_id', this.state.user_id);
      //formData.append('subdis_id', this.state.kel_id);
      formData.append('no_tps', this.state.tps);
      formData.append('total_dpt', this.state.totaldpt);
      formData.append('total_suara', this.state.totalsuara);
      formData.append('suara_caleg', this.state.totalsuaracaleg);
      formData.append('suara_partai', this.state.totalsuarapartai);
      //formData.append('long', this.state.long);
      //formData.append('lat', this.state.lat);
      formData.append('gambarqc', base64StringQC);
      formData.append('id', this.state.idquickcount);

      //console.log(JSON.stringify(formData));

      var config = {
        method: 'post',
        url: API_URL + `/qctps/edit`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
          Authorization: 'Bearer ' + self.state.token,
        },

        data: formData,
      };

      axios(config)
        .then(function (response) {
          var profile = response.data.data;

          if (response.data.success === true) {
            alert('Sukses');

            navigation.navigate('listqc');
          } else {
            alert(response.data.message);
          }
        })
        .catch(function (error) {
          if (!error.response) {
            // network error
            //this.errorStatus = 'Error: Network Error';
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

  render() {
    // const dt = new Date();
    // dt.setMonth( dt.getMonth() + 24 );
    //console.log("---->",this.state.tps);
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
            Edit Data QC TPS{' '}
          </Text>
        </View>
        <ScrollView style={{marginTop: 0, marginLeft: 5}}>
          <View style={styles.formcontainer}>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text style={{alignSelf: 'flex-start'}}>SAKSI</Text>
              </View>
              <TextInput
                placeholderTextColor="#707070"
                returnKeyType="next"
                disabled={true}
                style={styles.usernameInput}
                defaultValue={this.state.namasaksi + ' - ' + this.state.hpsaksi}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text style={{alignSelf: 'flex-start'}}>TPS</Text>
              </View>
              <TextInput
                // placeholder={this.state.tps === 0 ? "000":this.state.tps}
                placeholderTextColor="#707070"
                returnKeyType="next"
                //keyboardType="number"
                keyboardType="number-pad"
                //autoCapitalize="none"
                //autoCorrect={false}
                style={styles.usernameInput}
                defaultValue={this.state.tps.toString()}
                onChangeText={text => this.setTps(text)}
              />
              {/* <View style={{flexDirection: 'row', marginTop: 10}}>
                                <TouchableOpacity style={styles.eyeInput} onPress={() => navigation.navigate("getlocation")}>
                                    <Icon name="location-arrow" type="font-awesome-5" color="#f59e0b" size={15}/>
                                </TouchableOpacity>
                             </View> */}
            </View>
            <View style={styles.action1}>
              <View style={{width: '100%', height: 20, marginLeft: 10}}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 10}}>
                  Domisili Kamu : Kecamatan : {this.state.kecamatan} - Kelurahan
                  : {this.state.kelurahan}
                </Text>
              </View>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text style={{alignSelf: 'flex-start'}}>Jumlah DPT </Text>
              </View>
              <TextInput
                // placeholder={this.state.totaldpt === 0 ? "0":this.state.totaldpt}
                placeholderTextColor="#707070"
                returnKeyType="next"
                keyboardType="number"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                defaultValue={this.state.totaldpt.toString()}
                onChangeText={text => this.setTotalDPT(text)}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{textAlignVertical: 'top', alignSelf: 'flex-start'}}>
                  Total Pemilih Yg Hadir*
                </Text>
              </View>
              <TextInput
                // placeholder={this.state.totalsuara === 0 ? "0":this.state.totalsuara}
                placeholderTextColor="#707070"
                returnKeyType="next"
                keyboardType="number"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                defaultValue={this.state.totalsuara.toString()}
                onChangeText={text => this.setTotalSuara(text)}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{textAlignVertical: 'top', alignSelf: 'flex-start'}}>
                  Total Suara Caleg**
                </Text>
              </View>
              <TextInput
                // placeholder={this.state.totalsuaracaleg === 0 ? "0":this.state.totalsuaracaleg}
                placeholderTextColor="#707070"
                returnKeyType="next"
                keyboardType="number"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                defaultValue={this.state.totalsuaracaleg.toString()}
                onChangeText={text => this.setTotalSuaraCaleg(text)}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{textAlignVertical: 'top', alignSelf: 'flex-start'}}>
                  Total Suara Partai***
                </Text>
              </View>
              <TextInput
                //placeholder={this.state.totalsuarapartai === 0 ? "0": this.state.totalsuarapartai}
                placeholderTextColor="#707070"
                returnKeyType="next"
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                defaultValue={this.state.totalsuarapartai.toString()}
                onChangeText={text => this.setTotalSuaraPartai(text)}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{marginLeft: 5, fontFamily: 'TitilliumWeb-Regular'}}>
                Gambar :
              </Text>
              {this.state.imagesbase64.length === 0 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('fotoqc', {
                      idqc: this.state.idquickcount,
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
                  {this.state.user_id === this.state.user_id_saksi ? (
                    <>
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
                        source={{
                          uri: `data:image/png;base64,${item['images64']}`,
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
                    </>
                  ) : (
                    <>
                      <ImageModal
                        resizeMode="contain"
                        imageBackgroundColor="#000000"
                        source={{
                          uri: `data:image/png;base64,${item['images64']}`,
                        }}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 10,
                          borderWidth: 1,
                          marginRight: 0,
                          marginTop: 10,
                        }}
                      />
                    </>
                  )}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.action2}>
          {this.state.loader ? (
            <UIActivityIndicator
              color="#FFFFFF"
              zIndex={999999}
              size={20}
              style={{left: 30, bottom: 10}}
            />
          ) : (
            <View style={{marginLeft: 25}} />
          )}
          {this.state.totalsuara === 0 ||
          this.state.totaldpt === 0 ||
          this.state.totalsuaracaleg === 0 ||
          this.state.tps === 0 ||
          this.state.imagesbase64.length === 0 ||
          this.state.user_id !== this.state.user_id_saksi ? (
            <TouchableOpacity
              onPress={() => console.log('Belum Lengkap')}
              disabled={true}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
              }}>
              <BtnDisabled name="Kirim" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.SaveQCTPS()}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
              }}>
              <BtnStandard name="Kirim" />
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
    width: '50%',
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
    //justifyContent: 'center',
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
    paddingTop: -10,
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
});
