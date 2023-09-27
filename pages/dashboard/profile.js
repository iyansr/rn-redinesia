import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Image,
  Alert,
  Dimensions,
  RefreshControl,
} from 'react-native';
import BtnStandard from '../component/BtnStandard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import {SkypeIndicator} from 'react-native-indicators';
import analytics from '@react-native-firebase/analytics';

export default class HomeScreen extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      images: [
        require('../../assets/images/banner1.jpeg'),
        require('../../assets/images/banner2.jpg'),
        require('../../assets/images/banner3.png'),
        require('../../assets/images/banner41.jpg'),
        //require('./assets/images/girl.jpg'),          // Local image
      ],

      usernama: '',
      userimage: '',
      kandidat: '',
      dataRef: [],
      jmlKursi: 0,
      jmlTps: 0,
      jmlDpt: 0,
      jmlKota: 0,
      jmlKec: 0,
      jmlKel: 0,
      jmlTargetSuara: 0,
      jmlTargetRelawan: 0,
      loader: true,
      loaderdatadapil: true,
      loaderdatareport: true,
      dataRelawanKandidat: 0,
      dataPendukungKandidat: 0,
      dataDukunganHarian: 0,
      dataLaporanHarian: 0,
      dataSurveyHarian: 0,
      namadapil: '',
      jumlahData: 0,
      refreshing: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.ProfilesData();
      //this.DataInfoFoto();
    });

    setInterval(() => {
      var datetime = new Date();
      this.GetDataReferal(this.state.username);
    }, 150000);
  }

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  DoLogout = () => {
    const {navigation} = this.props;
    return Alert.alert('KELUAR APLIKASI', 'Apakah anda yakin Ingin Keluar?', [
      // The "Yes" button
      {
        text: 'Ya',
        onPress: async () => {
          //this.processApprove(status)
          AsyncStorage.getAllKeys().then(keys =>
            AsyncStorage.multiRemove(keys),
          );
          //navigation.replace('login')
          await analytics().logEvent('dologout', {
            id: this.state.username,
            item: this.state.usernama + ' :Logout',
            description: 'User Melakukan Logout',
          });
          navigation.replace('LoginNavigator', {screen: 'login'});
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'Tidak',
        onPress: null,
      },
    ]);
  };

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->DATASESSION555", JSON.stringify(datastring[0]["session_id"]));
        if (datastring.session_id != '') {
          //console.log("bguiadiuu",datastring[0]["user_prov"]);
          this.setState({
            login: true,
            token: datastring[0]['token'],
            userid: datastring[0]['user_id'],
            usernama: datastring[0]['usernama'],
            username: datastring[0]['username'],
            //userimage: datastring[0]["ud_selfi"],
            typeuser: datastring[0]['type'],
            kandidat: datastring[0]['k_name'],
            kandidatfoto: datastring[0]['k_foto'],
            partai: datastring[0]['pt_nama'],
            prov_id: datastring[0]['user_prov'],
            namadapil: datastring[0]['dapil_nama'],
            kandidat_id: datastring[0]['user_relawankandidat'],
          });
          //this.GetDataReferal(datastring[0]["username"]);
          if (this.state.jumlahData == 0) {
            this.GetDataReferal(datastring[0]['username']);
          } else {
            this.DataInfoFoto();
          }
          this.GetProfileFoto();
          this.GetDataDapil(datastring[0]['k_id']);
          //this.GetDataUserRekap(datastring[0]["user_relawankandidat"]);
          this.setState({loader: false});
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  GetProfileFoto = async () => {
    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    //formData.append('uname',hp);
    var config = {
      method: 'post',
      url: API_URL + `/userfoto`,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    await axios(config)
      .then(function (response) {
        let ft = [];
        if (response.data.success === true) {
          let foto = response.data.data;
          //console.log(JSON.stringify(foto));
          self.setState({
            userimage: foto[0].ud_selfi,
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
            loaderdatareport: false,
          });
        }
      })
      .finally(response => {
        self.setState({
          loaderdatareport: false,
        });
      });
  };

  DataInfoFoto = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_reflist_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->Profilesd", datastring.length);

        if (datastring.length > 0) {
          this.setState({
            jumlahData: datastring.length,
          })(datastring).forEach((items, index) => {
            this.state.dataRef.push({
              userid: items.user_id,
              foto: items.ud_selfi,
            });
          });
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataReferal = hp => {
    this.setState({dataRef: [], loaderdatadapil: true});
    const storeDataFoto = async value => {
      try {
        await AsyncStorage.setItem(
          '@storage_reflist_Key',
          JSON.stringify(value),
        );
      } catch (e) {
        // saving error
      }
    };

    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    //formData.append('uname',hp);
    var config = {
      method: 'get',
      url: API_URL + `/userrefprof/` + hp,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->REPORTS222"+response.data.data.length);
        let ft = [];
        var fotoref = response.data.data;
        storeDataFoto(fotoref);
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            //console.log("----testmapp----", items.ud_selfi);
            self.state.dataRef.push({
              userid: items.user_id,
              foto: items.ud_selfi,
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
            loaderdatadapil: false,
          });
        }
      })
      .finally(response => {
        self.setState({
          loaderdatadapil: false,
        });
      });
  };

  GetDataDapil = async uprove => {
    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    //formData.append('uname',hp);
    var config = {
      method: 'get',
      url: API_URL + `/getDataUserDapil/` + uprove,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    await axios(config)
      .then(function (response) {
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          //console.log("dataReport",JSON.stringify(response.data.data));
          let dataReport = response.data.data;
          //console.log("datareport", dataReport);
          self.setState({
            jmlKursi: dataReport[0]['dpl_jml_kursi'],
            jmlTps: dataReport[0]['dpl_jml_tps'],
            jmlDpt: dataReport[0]['dpl_jml_dpt'],
            jmlKota: dataReport[0]['jmlKota'],
            jmlKec: dataReport[0]['jmlKec'],
            jmlKel: dataReport[0]['jmlKel'],
            jmlTargetSuara: dataReport[0]['dpl_target_suara'],
            jmlTargetRelawan:
              dataReport[0]['dpl_target_suara'] / dataReport[0]['dpl_jml_tps'], //dataReport[0]["dpl_target_perrelawan"],
            jmlhrekrut: dataReport[0]['jmlhrekrut'],
            jmlhrlapor: dataReport[0]['jmlhrlapor'],
            jmlhrsurvey: dataReport[0]['jmlhrsurvey'],
          });

          self.GetDataUserRekap(
            self.state.kandidat_id,
            dataReport[0]['dpl_target_suara'],
            dataReport[0]['jmlhrekrut'],
          );
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
            loaderdatareport: false,
          });
        }
      })
      .finally(response => {
        this.setState({
          loaderdatareport: false,
        });
      });
  };

  GetDataUserRekap = async (kandidat, target, rekrut) => {
    //console.log("=====2=2=2=2=",target);
    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    //formData.append('uname',hp);
    var config = {
      method: 'get',
      url: API_URL + `/userrekap/` + kandidat,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    await axios(config)
      .then(function (response) {
        //let jmlhrianrekrut = this.state.jmlhrekrut;
        //let jmlhrianlapor = this.state.jmlhrlapor;
        //let jmlhriansurvey = this.state.jmlhrsurvey;
        let ft = [];
        if (response.data.success === true) {
          let dataReport = response.data.data;

          let ttl = (dataReport[0]['total_relawan'] / target) * 100;
          let ttlp = (dataReport[0]['total_pendukung'] / target) * 100;
          let all =
            ((dataReport[0]['total_pendukung'] +
              dataReport[0]['total_relawan']) /
              target) *
            100;
          let allh = (dataReport[0]['total_dukungan_harian'] / rekrut) * 100;
          let alllaporanh =
            (dataReport[0]['total_laporan_harian'] / self.state.jmlhrlapor) *
            100;
          let allsurveyh =
            (dataReport[0]['total_survey_harian'] / self.state.jmlhrsurvey) *
            100;
          let pct = '%';
          //console.log("JSONNNNNAAAAAASSSSIAAAHHHHHWWW", ttlp);
          self.setState({
            dataRelawanKandidat: dataReport[0]['total_relawan'],
            dataPendukungKandidat: dataReport[0]['total_pendukung'],
            dataDukunganHarian: dataReport[0]['total_dukungan_harian'],
            dataLaporanHarian: dataReport[0]['total_laporan_harian'],
            dataSurveyHarian: dataReport[0]['total_survey_harian'],
            styleRelawan: {
              width: ttl + pct,
              height: 18,
              backgroundColor: 'green',
            },
            stylePendukung: {
              width: ttlp + pct,
              height: 18,
              backgroundColor: 'green',
            },
            styleTotal: {
              width: all + pct,
              height: 18,
              backgroundColor: 'red',
            },
            styleRekrutBulanan: {
              width: allh + pct,
              height: 18,
              backgroundColor: 'yellow',
            },
            styleLaporanHarian: {
              width: alllaporanh + pct,
              height: 18,
              backgroundColor: 'yellow',
            },
            styleSurveyHarian: {
              width: allsurveyh + pct,
              height: 18,
              backgroundColor: 'yellow',
            },
          });
        } else {
          console.log('errorrrrrrrita');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORAKTAAAAAAAASSASAS' + error);
          //alert("ERROR KONEKSI: SILAHKAN COBA");
        } else {
          self.setState({
            loaderdatareport: false,
          });
        }
      })
      .finally(response => {
        self.setState({
          loaderdatareport: false,
        });
      });
  };

  Deleted = () => {
    const {navigation} = this.props;

    return Alert.alert(
      'Hapus Akun Saya.',
      'Apakah anda yakin Ingin Menghapus User Anda ?',
      [
        // The "Yes" button
        {
          text: 'YA, Saya Yakin',
          onPress: async () => {
            //console.log(reason);
            //navigation.navigate("Profile");
            this.DeleteUser(this.state.userid);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'Nanti Dulu',
          onPress: () => {
            navigation.navigate('Profile');
          },
        },
      ],
    );
  };

  DeleteUser = id => {
    const self = this;
    self.setState({loader: true});
    const {navigation} = this.props;

    var formData = new URLSearchParams();
    formData.append('id', id);

    var config = {
      method: 'post',
      url: API_URL + `/user/disactive`,
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
          AsyncStorage.getAllKeys().then(keys =>
            AsyncStorage.multiRemove(keys),
          );
          navigation.replace('LoginNavigator', {screen: 'login'});
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

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });

    this.ProfilesData();

    setTimeout(() => {
      this.setState({
        refreshing: false,
      });
    }, 2000);
  };

  formatNumber = num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  render() {
    //console.log("7777", (this.state.dataRef).length);
    const {navigation} = this.props;
    let percentrelawan = (this.state.dataRelawanKandidat / 120) * 100;
    let w = Dimensions.get('window').width;
    return (
      <SafeAreaView>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <View
            style={{
              width: '100%',
              height: 100,
              backgroundColor: '#f59e0b',
              borderBottomLeftRadius: 50,
            }}></View>
          <View
            style={{
              flex: 1,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'orange',
              alignSelf: 'center',
              width: '90%',
              height: 110,
              marginTop: -40,
              backgroundColor: '#CCCCCC',
              elevation: 10,
            }}>
            <View
              style={{
                flex: 0,
                alignSelf: 'center',
                width: '100%',
                height: 25,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontFamily: 'TitilliumWeb-Regular',
                  paddingLeft: 5,
                  paddingTop: 3,
                  color: 'black',
                }}>
                Profil Anda
              </Text>
              <Icon
                name="angle-right"
                type="font-awesome-5"
                size={15}
                style={{marginLeft: 5, paddingTop: 4}}
              />
            </View>
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                alignSelf: 'center',
                width: '100%',
                height: 200,
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                elevation: 4,
              }}>
              <View style={{width: 50, height: 50, padding: 3}}>
                {this.state.loader ? (
                  <View style={{marginTop: 40, marginLeft: 10}}>
                    <SkypeIndicator color="red" />
                  </View>
                ) : (
                  // <TouchableOpacity onPress={() => navigation.navigate("DashboardNavigator", {screen : 'editdataprofile', params:{useridrelawan : this.state.userid}})}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('DashboardNavigator', {
                        screen: 'editdataprofile',
                      })
                    }>
                    {this.state.userimage === '' ? (
                      <Image
                        source={require('../../assets/images/noimage.png')}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 20,
                          borderWidth: 1,
                          resizeMode: 'contain',
                          marginTop: 4,
                        }}
                      />
                    ) : (
                      <Image
                        source={{
                          uri: `data:image/png;base64,${this.state.userimage}`,
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 20,
                          marginLeft: 3,
                          borderWidth: 1,
                          resizeMode: 'contain',
                          marginTop: 4,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
              {this.state.typeuser !== 5 ? (
                <View
                  style={{
                    flex: 1,
                    width: '70%',
                    marginLeft: 40,
                    marginTop: 10,
                    height: 180,
                  }}>
                  <Text style={{fontFamily: 'Play-Bold', fontSize: w * 0.042}}>
                    {this.state.usernama}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: 12,
                      paddingTop: 3,
                    }}>
                    Relawan Caleg:{' '}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: w * 0.035,
                      fontWeight: 'bold',
                      width: 250,
                    }}>
                    {this.state.kandidat}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    width: '60%',
                    marginLeft: 40,
                    marginTop: 5,
                    height: 180,
                  }}>
                  <Text style={{fontSize: w * 0.042, fontWeight: 'bold'}}>
                    {this.state.usernama}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: 14,
                      paddingTop: 3,
                    }}>
                    {this.state.partai}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: w * 0.031,
                      fontWeight: 'bold',
                      paddingTop: 3,
                    }}>
                    DAPIL : {this.state.namadapil}
                  </Text>
                </View>
              )}
              {/* <TouchableOpacity onPress={() => navigation.navigate("DashboardNavigator", {screen:"reward"})} style={{justifyContent: "center", alignContent: "center", alignItems: "center", width: "20%", marginRight: 10, marginTop: 10}}>
                                <Icon type='font-awesome-5' name='chartl' color={"#e07b39"} size={60} />
                                <Image source={require('../../assets/images/achieved.png')} 
                                  style={{width: 70, height: 70, borderRadius: 20, 
                                          borderWidth: 1, resizeMode: 'contain'}} />
                                <Text style={{fontFamily: "FredokaOne-Regular", color: "#000000", top: -30}}>POINKU</Text>
                            </TouchableOpacity>                     */}
            </View>
          </View>
          {this.state.typeuser !== 5 ? (
            <View style={{marginTop: 20, marginLeft: 25}}>
              <Text
                style={{
                  fontFamily: 'Vega-Regular',
                  color: '#f59e0b',
                  fontSize: 15,
                }}>
                Jumlah Rekrutan : {this.state.dataRef.length} Orang
              </Text>
            </View>
          ) : (
            <View />
          )}
          {this.state.typeuser !== 5 ? (
            <View
              style={{
                width: '95%',
                height: 50,
                flexDirection: 'row',
                flex: 1,
                marginTop: 10,
                marginLeft: 20,
              }}>
              {this.state.loaderdatadapil && this.state.dataRef.length == 0 ? (
                <View style={{marginTop: 10, marginLeft: 10}}>
                  <SkypeIndicator color="red" />
                </View>
              ) : (
                <View />
              )}
              {this.state.dataRef.map((items, index) =>
                index < 5 ? (
                  <Image
                    source={{uri: `data:image/png;base64,${items.foto}`}}
                    style={{
                      width: 55,
                      height: 55,
                      borderRadius: 60,
                      marginLeft: 3,
                      borderWidth: 1,
                      resizeMode: 'contain',
                    }}
                  />
                ) : (
                  <View />
                ),
              )}
              {this.state.dataRef.length > 5 ? (
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 60,
                    borderWidth: 1,
                    borderColor: '#CCCCCC',
                    justifyContent: 'center',
                    marginLeft: 5,
                    backgroundColor: '#f7f5f5',
                  }}>
                  {/* <Icon type="font-awesome-5" name="arrow-right" size={20} /> */}
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'TitilliumWeb-Regular',
                      alignSelf: 'center',
                    }}>
                    +{this.state.dataRef.length - 5}
                  </Text>
                </View>
              ) : (
                <View />
              )}
            </View>
          ) : (
            <View />
          )}

          <View style={{marginTop: 20, marginLeft: 25}}>
            <Text
              style={{
                fontFamily: 'Vega-Regular',
                color: '#f59e0b',
                fontSize: 15,
              }}>
              Data Daerah Pemilihan
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              height: this.state.namadapil.length > 12 ? 100 : 90,
              marginLeft: 25,
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '28%',
                height: this.state.namadapil.length > 12 ? 85 : 70,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#CCCCCC',
                backgroundColor: '#f59e0b',
              }}>
              <View
                style={{
                  width: '100%',
                  height: this.state.namadapil.length > 12 ? 70 : 55,
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  top: 13,
                }}>
                <Text
                  style={{
                    padding: 5,
                    color: '#000000',
                    fontFamily: 'TitilliumWeb-Regular',
                    fontSize: 10,
                  }}>
                  Dapil
                </Text>
                {this.state.loaderdatareport ? (
                  <View style={{marginTop: 10, marginLeft: -65}}>
                    <SkypeIndicator color="red" size={19} />
                  </View>
                ) : (
                  <Text
                    style={{
                      paddingLeft: 5,
                      color: '#f59e0b',
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: this.state.namadapil.length > 12 ? 11 : 15,
                      top: this.state.namadapil.length > 12 ? 3 : 2,
                    }}>
                    {this.state.namadapil}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                width: '28%',
                height: 70,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#CCCCCC',
                backgroundColor: '#f59e0b',
                marginLeft: 10,
              }}>
              <View
                style={{
                  width: '100%',
                  height: 55,
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  top: 13,
                }}>
                <Text
                  style={{
                    padding: 5,
                    color: '#000000',
                    fontFamily: 'TitilliumWeb-Regular',
                    fontSize: 12,
                  }}>
                  Jml. Kecamatan
                </Text>
                {this.state.loaderdatareport ? (
                  <View style={{marginTop: 10, marginLeft: -65}}>
                    <SkypeIndicator color="red" size={19} />
                  </View>
                ) : (
                  <Text
                    style={{
                      paddingLeft: 5,
                      color: '#f59e0b',
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: 20,
                    }}>
                    {this.state.jmlKec}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                width: '28%',
                height: 70,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#CCCCCC',
                backgroundColor: '#f59e0b',
                marginLeft: 10,
              }}>
              <View
                style={{
                  width: '100%',
                  height: 55,
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  top: 13,
                }}>
                <Text
                  style={{
                    padding: 5,
                    color: '#000000',
                    fontFamily: 'TitilliumWeb-Regular',
                    fontSize: 12,
                  }}>
                  Jml. Kelurahan
                </Text>
                {this.state.loaderdatareport ? (
                  <View style={{marginTop: 10, marginLeft: -65}}>
                    <SkypeIndicator color="red" size={19} />
                  </View>
                ) : (
                  <Text
                    style={{
                      paddingLeft: 5,
                      color: '#f59e0b',
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: 20,
                    }}>
                    {this.state.jmlKel}
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: 80,
              marginLeft: 25,
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: 140,
                height: 80,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#CCCCCC',
                backgroundColor: '#f59e0b',
              }}>
              <View
                style={{
                  width: '100%',
                  height: 65,
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  top: 13,
                }}>
                <Text
                  style={{
                    padding: 5,
                    color: '#000000',
                    fontFamily: 'TitilliumWeb-Regular',
                  }}>
                  Jumlah Kursi
                </Text>
                {this.state.loaderdatareport ? (
                  <View style={{marginTop: 10, marginLeft: -65}}>
                    <SkypeIndicator color="red" size={19} />
                  </View>
                ) : (
                  <Text
                    style={{
                      padding: 5,
                      color: '#f59e0b',
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: 20,
                    }}>
                    {this.state.jmlKursi}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                width: 140,
                height: 80,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#CCCCCC',
                backgroundColor: '#f59e0b',
                marginLeft: 10,
              }}>
              <View
                style={{
                  width: '100%',
                  height: 65,
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  top: 13,
                }}>
                <Text
                  style={{
                    padding: 5,
                    color: '#000000',
                    fontFamily: 'TitilliumWeb-Regular',
                  }}>
                  Jumlah DPT
                </Text>
                {this.state.loaderdatareport ? (
                  <View style={{marginTop: 10, marginLeft: -65}}>
                    <SkypeIndicator color="red" size={19} />
                  </View>
                ) : (
                  <Text
                    style={{
                      padding: 5,
                      color: '#f59e0b',
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: 20,
                    }}>
                    {this.formatNumber(this.state.jmlDpt)}
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: 80,
              marginLeft: 25,
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '34%',
                height: 80,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#CCCCCC',
                backgroundColor: '#f59e0b',
              }}>
              <View
                style={{
                  width: '100%',
                  height: 65,
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  top: 13,
                }}>
                <Text
                  style={{
                    padding: 5,
                    color: '#000000',
                    fontFamily: 'TitilliumWeb-Regular',
                  }}>
                  Target Suara
                </Text>
                {this.state.loaderdatareport ? (
                  <View style={{marginTop: 10, marginLeft: -65}}>
                    <SkypeIndicator color="red" size={19} />
                  </View>
                ) : (
                  <Text
                    style={{
                      padding: 5,
                      color: '#f59e0b',
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: 14,
                    }}>
                    {this.formatNumber(this.state.jmlTargetSuara)} (
                    {(
                      (this.state.jmlTargetSuara / this.state.jmlDpt) *
                      100
                    ).toFixed(1)}{' '}
                    %)
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                width: '23%',
                height: 70,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#CCCCCC',
                backgroundColor: '#f59e0b',
                marginLeft: 10,
              }}>
              <View
                style={{
                  width: '100%',
                  height: 55,
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  top: 13,
                }}>
                <Text
                  style={{
                    padding: 5,
                    color: '#000000',
                    fontFamily: 'TitilliumWeb-Regular',
                    fontSize: 12,
                  }}>
                  Jumlah TPS
                </Text>
                {this.state.loaderdatareport ? (
                  <View style={{marginTop: 10, marginLeft: -65}}>
                    <SkypeIndicator color="red" size={19} />
                  </View>
                ) : (
                  <Text
                    style={{
                      paddingLeft: 5,
                      color: '#f59e0b',
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: 15,
                    }}>
                    {this.state.jmlTps}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                width: '27%',
                height: 80,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#CCCCCC',
                backgroundColor: '#f59e0b',
                marginLeft: 10,
              }}>
              <View
                style={{
                  width: '100%',
                  height: 65,
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  top: 13,
                }}>
                <Text
                  style={{
                    padding: 3,
                    color: '#000000',
                    fontFamily: 'TitilliumWeb-Regular',
                    fontSize: 11,
                  }}>
                  Target Rekrut Per-TPS
                </Text>
                {this.state.loaderdatareport ? (
                  <View style={{marginTop: 10, marginLeft: -65}}>
                    <SkypeIndicator color="red" size={19} />
                  </View>
                ) : (
                  <Text
                    style={{
                      paddingLeft: 5,
                      color: '#f59e0b',
                      fontFamily: 'TitilliumWeb-Regular',
                      fontSize: 18,
                    }}>
                    {this.state.jmlTargetRelawan.toFixed(0)} Orang
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View style={{marginTop: 20, marginLeft: 25}}>
            <Text
              style={{
                fontFamily: 'Vega-Regular',
                color: '#f59e0b',
                fontSize: 15,
                fontWeight: 'bold',
              }}>
              PROGRESS DUKUNGAN
            </Text>
          </View>
          <View style={{width: '90%', height: 90}}>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 80,
                borderColor: '#CCCCCC',
                justifyContent: 'center',
                marginTop: 10,
                borderWidth: 1,
                backgroundColor: '#FCA123',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  color: '#0000FF',
                  fontSize: 16,
                  fontWeight: 'bold',
                  fontFamily: 'TitilliumWeb-Regular',
                }}>
                {(
                  ((this.state.dataPendukungKandidat +
                    this.state.dataRelawanKandidat) /
                    this.state.jmlTargetSuara) *
                  100
                ).toFixed(2)}{' '}
                %
              </Text>
            </View>
          </View>
          <View style={{width: '100%'}}>
            <View
              style={{
                width: '90%',
                height: 40,
                borderWidth: 1,
                marginLeft: 25,
                borderRadius: 10,
                flexDirection: 'row',
              }}>
              <Icon
                name="check"
                type="font-awesome-5"
                size={10}
                style={{alignSelf: 'flex-start', padding: 12}}
              />
              <Text style={{padding: 8, width: 150}}>Total Relawan </Text>
              <View
                style={{
                  width: '45%',
                  height: 20,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  top: 10,
                }}>
                <View style={[this.state.styleRelawan]}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      fontFamily: 'TitilliumWeb-Regular',
                      width: 300,
                    }}>
                    {this.state.dataRelawanKandidat}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '90%',
                height: 40,
                borderWidth: 1,
                marginLeft: 25,
                marginTop: 10,
                borderRadius: 10,
                flexDirection: 'row',
              }}>
              <Icon
                name="check"
                type="font-awesome-5"
                size={10}
                style={{alignSelf: 'flex-start', padding: 12}}
              />
              <Text style={{padding: 8, width: 150}}>Total Pendukung</Text>
              <View
                style={{
                  width: '45%',
                  height: 20,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  top: 10,
                }}>
                <View style={[this.state.stylePendukung]}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      fontFamily: 'TitilliumWeb-Regular',
                      width: 300,
                    }}>
                    {this.state.dataPendukungKandidat}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '90%',
                height: 40,
                borderWidth: 1,
                marginLeft: 25,
                marginTop: 10,
                borderRadius: 10,
                flexDirection: 'row',
              }}>
              <Icon
                name="check"
                type="font-awesome-5"
                size={10}
                style={{alignSelf: 'flex-start', padding: 12}}
              />
              <Text style={{padding: 8, width: 150, fontWeight: 'bold'}}>
                Total Dukungan{' '}
              </Text>
              <View
                style={{
                  width: '45%',
                  height: 20,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  top: 10,
                }}>
                <View style={[this.state.styleTotal]}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      fontFamily: 'TitilliumWeb-Regular',
                      width: 300,
                    }}>
                    {this.state.dataPendukungKandidat +
                      this.state.dataRelawanKandidat}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{marginTop: 20, marginLeft: 25}}>
            <Text
              style={{
                fontFamily: 'Vega-Regular',
                color: '#f59e0b',
                fontSize: 15,
              }}>
              Laporan Kinerja
            </Text>
          </View>
          <View style={{width: '100%'}}>
            <View
              style={{
                width: '90%',
                height: 40,
                borderWidth: 1,
                marginLeft: 25,
                marginTop: 10,
                borderRadius: 10,
                flexDirection: 'row',
              }}>
              <Icon
                name="check"
                type="font-awesome-5"
                size={10}
                style={{alignSelf: 'flex-start', padding: 12}}
              />
              <Text style={{padding: 8, width: 180}}>
                Jumlah Rekrutan / Hari{' '}
              </Text>
              <View
                style={{
                  width: '36%',
                  height: 20,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  top: 10,
                }}>
                <View style={[this.state.styleRekrutBulanan]}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      fontFamily: 'TitilliumWeb-Regular',
                      color: 'blue',
                      width: 300,
                    }}>
                    {this.state.dataDukunganHarian} / {this.state.jmlhrekrut}{' '}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '90%',
                height: 40,
                borderWidth: 1,
                marginLeft: 25,
                marginTop: 10,
                borderRadius: 10,
                flexDirection: 'row',
              }}>
              <Icon
                name="check"
                type="font-awesome-5"
                size={10}
                style={{alignSelf: 'flex-start', padding: 12}}
              />
              <Text style={{padding: 8, width: 180}}>
                Jumlah Laporan / Hari{' '}
              </Text>
              <View
                style={{
                  width: '36%',
                  height: 20,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  top: 10,
                }}>
                <View style={[this.state.styleLaporanHarian]}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      fontFamily: 'TitilliumWeb-Regular',
                      color: 'blue',
                      width: 300,
                    }}>
                    {this.state.dataLaporanHarian} / {this.state.jmlhrlapor}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '90%',
                height: 40,
                borderWidth: 1,
                marginLeft: 25,
                marginTop: 10,
                borderRadius: 10,
                flexDirection: 'row',
              }}>
              <Icon
                name="check"
                type="font-awesome-5"
                size={10}
                style={{alignSelf: 'flex-start', padding: 12}}
              />
              <Text style={{padding: 8, width: 180}}>
                Jumlah Survey / Hari{' '}
              </Text>
              <View
                style={{
                  width: '36%',
                  height: 20,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  top: 10,
                }}>
                <View style={[this.state.styleSurveyHarian]}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      fontFamily: 'TitilliumWeb-Regular',
                      color: 'blue',
                      width: 300,
                    }}>
                    {this.state.dataSurveyHarian} / {this.state.jmlhrsurvey}{' '}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: '90%',
              paddingTop: 20,
              alignSelf: 'center',
              marginBottom: 2,
            }}
            onPress={() => this.DoLogout()}>
            <BtnStandard name="Keluar Aplikasi" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '90%',
              paddingTop: 10,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 50,
            }}
            onPress={() => this.Deleted(this.state.user_id)}>
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontFamily: 'Play-Bold',
              }}>
              Hapus/NonAktifkan Akun
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
});
