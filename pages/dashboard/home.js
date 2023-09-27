import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Dimensions,
  Linking,
} from 'react-native';
//import BtnStandard from '../component/BtnStandard'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaView from 'react-native-safe-area-view';
import {Icon, Badge} from 'react-native-elements';
import axios from 'react-native-axios';
import {UIActivityIndicator} from 'react-native-indicators';
import {SliderBox} from 'react-native-image-slider-box';
import {API_URL} from '@env';
import {SkypeIndicator} from 'react-native-indicators';
import database, {firebase} from '@react-native-firebase/database';
import analytics from '@react-native-firebase/analytics';

class AppHome extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      images: [
        require('../../assets/images/relawanku_slide2.jpg'),
        // require('../../assets/images/relawanku_slide3.jpg'),
        // require('../../assets/images/relawanku_slide1.png'),
        // require('../../assets/images/banner1.jpeg'),
        //require('../../assets/images/banner2.jpg'),
        //require('../../assets/images/banner3.png'),
        //require('../../assets/images/banner41.jpg'),
        //require('./assets/images/girl.jpg'),          // Local image
      ],
      rssfeeder: [],
      usernama: '',
      username: 0,
      userimage: '',
      kandidat: '',
      datainfo: [],
      isFetching: false,
      jumlahsurvey: 0,
      jumlahData: 0,
      ishead: 0,
      menuHead: [],
      unreadData: 0,
      saleswa: '',
      trialicon: false,
      akuntrial: [],
      rekappemilu: [],
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({rssfeeder: []});
      this.ProfilesData();
      this.DataInfoLaporan();
      //this.parseNews();
      //this.GetDataInfo();
    });

    setInterval(() => {
      var datetime = new Date();
      this.GetDataInfo(this.state.kandidatid);
      this.GetDataUnread();
    }, 150000);
  }

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);

        if (datastring.session_id != '') {
          this.setState({
            login: true,
            usernama: datastring[0]['usernama'],
            username: datastring[0]['username'],
            token: datastring[0]['token'],
            userimage: datastring[0]['user_photo'],
            kandidat: datastring[0]['k_name'],
            kandidatid: datastring[0]['k_id'],
            dapilid: datastring[0]['dapil_id'],
            userid: datastring[0]['user_id'],
            ishead: datastring[0]['user_ishead'],
            usertype: datastring[0]['type'],
            jumlahsurvey: datastring[0]['jumlahsurvey'],
            isvalidator: datastring[0]['user_isvalidator'],
          });
          //console.log("====++==++",this.state.jumlahData);
          if (this.state.jumlahData == 0) {
            this.GetDataInfo(datastring[0]['k_id']);
          } else {
            this.DataInfoLaporan();
            this.DataUnread();
          }
          this.getDatabaseFirebase();
          this.getDataSalesTrial();
          this.getDataStyle();
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  DataInfoLaporan = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_info_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->Profilesd", JSON.stringify(datastring));
        if (datastring.length > 0) {
          this.setState({
            jumlahData: datastring.length,
          })(datastring).forEach((items, index) => {
            this.state.datainfo.push({
              id: items.id,
              datetime: items.waktu,
              deskripsi: items.deskripsi,
              gambar: items.gambar,
              author: items.author,
            });
          });
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  DataUnread = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_inbox_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->INBOXXXSSSSSSTORAGEEE", datastring[0]["unread"]);
        if (datastring.length > 0) {
          this.setState({
            unreadData: datastring[0]['unread'],
          });
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  getDatabaseFirebase = () => {
    if (this.state.ishead === 0) {
      //console.log("Data Bukan Head");
      this.setState({
        menuHead: {
          menuRekrut: true,
          menureferral: true,
          menuElektoral: true,
          menuBroadcast: true,
          menuTandem: true,
          menuQC: true,
          menuBuzz: true,
          menuSurvey: true,
          menuReport: true,
          menuAppr: true,
        },
      });
    } else {
      const reference = firebase
        .app()
        .database(
          'https://timsesapps-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/ishead');

      const onValueChange = database()
        .ref('/ishead')
        .on('value', snapshot => {
          //console.log('User data: ', JSON.stringify(snapshot.val()));

          let dataRF = snapshot.val();
          //console.log("---<><><><><>",dataRF.qctps);
          this.setState({
            menuHead: {
              menuRekrut: dataRF.rekrut,
              menureferral: dataRF.referral,
              menuElektoral: dataRF.elektoral,
              menuBroadcast: dataRF.broadcast,
              menuTandem: dataRF.tandem,
              menuQC: dataRF.qctps,
              menuBuzz: dataRF.buzz,
              menuSurvey: dataRF.survey,
              menuReport: dataRF.report,
              menuAppr: dataRF.approval,
            },
          });
        });

      return () => database().ref(`/ishead`).off('value', onValueChange);
    }
  };

  getDataSalesTrial = async () => {
    const reference = firebase
      .app()
      .database(
        'https://timsesapps-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('/nohead');

    const onValueChange = database()
      .ref('/nohead')
      .on('value', snapshot => {
        //console.log('User data: ', JSON.stringify(snapshot.val()));
        let dataRF = snapshot.val();
        this.setState({
          trialicon: dataRF.trialicon,
          saleswa: dataRF.saleswa,
          akuntrial: dataRF.trialaccount,
          rekappemilu: dataRF.rekappemilu,
        });
      });
    return () => database().ref(`/nohead`).off('value', onValueChange);
  };

  GetDataInfo = async userids => {
    const storeDataInfo = async value => {
      try {
        await AsyncStorage.setItem('@storage_info_Key', JSON.stringify(value));
      } catch (e) {
        // saving error
      }
    };

    this.setState({datainfo: []});
    this.setState({loader: true});
    const self = this;

    let urlapi;
    if (self.state.ishead === 1) {
      urlapi = API_URL + `/infonewhead`;
    } else {
      urlapi = API_URL + `/infonew`;
    }

    var config = {
      method: 'get',
      url: urlapi,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    await axios(config)
      .then(function (response) {
        //console.log("---->AKTS"+JSON.stringify(response.data.data));
        var information = response.data.data;
        storeDataInfo(information);
        let ft = [];
        if (response.data.success === true) {
          response.data.data.forEach((items, index) => {
            self.state.datainfo.push({
              id: items.id,
              datetime: items.waktu,
              deskripsi: items.deskripsi,
              gambar: items.gambar,
              author: items.author,
            });
          });
        } else {
          console.log('errorrrrrrrita');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORAKTSSSSSSSSSSINVVOOO' + error);
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

  GetDataUnread = async () => {
    const storeDataInbox = async value => {
      try {
        await AsyncStorage.setItem('@storage_inbox_Key', JSON.stringify(value));
      } catch (e) {
        // saving error
      }
    };

    const self = this;
    var config = {
      method: 'get',
      url: API_URL + `/unread`,
      headers: {
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    await axios(config)
      .then(function (response) {
        var information = response.data.data;
        //console.log("---->INBOXX"+JSON.stringify(information[0]["unread"]));
        let ft = [];
        if (response.data.success === true) {
          storeDataInbox(information);
          self.setState({
            unreadData: information[0]['unread'],
          });
        } else {
          console.log('errorrrrrrrita');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORAKTINBOXXXX' + error);
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

  getDataStyle = async () => {
    this.setState({
      images: [],
    });
    const reference = firebase
      .app()
      .database(
        'https://timsesapps-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('/style');

    const onValueChange = database()
      .ref('/style')
      .on('value', snapshot => {
        //console.log('User data: ', JSON.stringify(snapshot.val()));
        let dataRF = snapshot.val();
        this.state.images.push(
          dataRF.banner1,
          dataRF.banner2,
          dataRF.banner3,
          dataRF.banner4,
        );
      });
    return () => database().ref(`/style`).off('value', onValueChange);
  };

  onRefresh() {
    this.setState({isFetching: true}, () => {
      this.GetDataInfo();
    });
    this.setState({isFetching: false});
  }

  formatDate(input) {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + '/' + month + '/' + year;
  }

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
        <ScrollView style={styles.container}>
          {/* <View style={{height: 150}}>
            <SliderBox
              images={this.state.images}
              sliderBoxHeight={150}
              circleLoop={true}
              autoplay={true}
              activeOpacity={0.5}
              onCurrentImagePressed={index =>
                console.warn(`image ${index} pressed`)
              }
            />
          </View> */}

          <View
            style={{
              marginTop: 64,
              marginLeft: 20,
              width: '100%',
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '50%',
                borderBottomWidth: 3,
                borderBottomColor: '#f59e0b',
                padding: 5,
              }}>
              <Text
                style={{color: 'black', fontFamily: 'TitilliumWeb-Regular'}}>
                MENU UTAMA RELAWAN
              </Text>
            </View>
            <TouchableOpacity
              onPress={async () => {
                await analytics().logEvent('bukainbox', {
                  id: this.state.username,
                  item: this.state.usernama + ' :Menuju Inbox',
                  description: 'Buka Inbox',
                });
                navigation.navigate('DashboardNavigator', {
                  screen: 'listinbox',
                });
              }}
              style={{
                width: '40%',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <Icon name="bell" type="font-awesome-5" size={17}></Icon>
              {this.state.unreadData > 0 ? (
                <Badge
                  value={this.state.unreadData}
                  status="error"
                  containerStyle={{position: 'absolute', top: 5, left: 130}}
                />
              ) : null}
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 20, marginLeft: 20, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() =>
                this.state.isvalidator === 1 &&
                this.state.menuHead['menuSurvey']
                  ? navigation.navigate('DashboardNavigator', {
                      screen: 'periode',
                    })
                  : console.log('Anda Bukan Validator')
              }
              style={{
                width: 60,
                height: 70,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'white',
                alignItems: 'center',
                backgroundColor:
                  this.state.isvalidator === 1 &&
                  this.state.menuHead['menuSurvey']
                    ? '#f59e0b'
                    : '#fdba74',
              }}>
              <Icon
                name="verified"
                type="material"
                style={{marginTop: 10}}
                size={20}
                color={'#fff'}></Icon>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'TitilliumWeb-Regular',
                  color: 'white',
                }}>
                SURVEI
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.state.menuHead['menuQC']
                  ? navigation.navigate('DashboardNavigator', {
                      screen: 'listqc',
                    })
                  : console.log('Anda Belum Diizinkan')
              }
              style={{
                width: 60,
                height: 70,
                marginLeft: 10,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'white',
                backgroundColor:
                  this.state.isvalidator === 1 && this.state.menuHead['menuQC']
                    ? '#f59e0b'
                    : '#fdba74',
                alignItems: 'center',
              }}>
              <Icon
                name="report"
                type="material"
                style={{marginTop: 10}}
                size={20}
                color={'#fff'}></Icon>
              <Text
                style={{
                  fontSize: 10,
                  textAlign: 'center',
                  fontFamily: 'TitilliumWeb-Regular',
                  color: 'white',
                }}>
                {`Hitung\nSuara`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.state.menuHead['menuRekrut']
                  ? navigation.navigate('DashboardNavigator', {
                      screen: 'listrekrut',
                    })
                  : console.log('Anda Belum Diizinkan')
              }
              style={{
                width: 60,
                height: 70,
                marginLeft: 10,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'white',
                backgroundColor:
                  this.state.isvalidator === 1 &&
                  this.state.menuHead['menuRekrut']
                    ? '#f59e0b'
                    : '#fdba74',
                alignItems: 'center',
              }}>
              <Icon
                name="briefcase-plus"
                type="material-community"
                style={{marginTop: 10}}
                color={'#fff'}></Icon>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'TitilliumWeb-Regular',
                  color: '#fff',
                }}>
                Daftarkan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.state.menuHead['menuBuzz']
                  ? navigation.navigate('DashboardNavigator', {
                      screen: 'listbuzz',
                    })
                  : console.log('Anda Belum Diizinkan')
              }
              style={{
                width: 60,
                height: 70,
                marginLeft: 10,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'white',
                backgroundColor:
                  this.state.isvalidator === 1 &&
                  this.state.menuHead['menuBuzz']
                    ? '#f59e0b'
                    : '#fdba74',
                alignItems: 'center',
              }}>
              <Icon
                name="mark-email-unread"
                type="material"
                style={{marginTop: 10}}
                color="#fff"></Icon>
              <Text
                style={{
                  fontSize: 10,
                  textAlign: 'center',
                  fontFamily: 'TitilliumWeb-Regular',
                  color: '#fff',
                }}>
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                if (
                  (this.state.usertype == 5 || this.state.usertype == 2) &&
                  this.state.menuHead['menuTandem']
                ) {
                  await analytics().logEvent('menutandemdepan', {
                    id: this.state.username,
                    item: this.state.usernama + ' :Menuju Menu Tandem',
                    description: 'Buka Menu Tandem',
                  });

                  navigation.navigate('DashboardNavigator', {
                    screen: 'listtandem',
                  });
                } else {
                  console.log('hanya untuk caleg');
                }
              }}
              style={{
                width: 60,
                height: 70,
                marginLeft: 10,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'white',
                backgroundColor:
                  this.state.usertype == 2 ||
                  (this.state.usertype == 5 &&
                    this.state.menuHead['menuTandem'])
                    ? '#f59e0b'
                    : '#fdba74',
                alignItems: 'center',
              }}>
              <Icon
                name="hand-clap"
                type="material-community"
                style={{marginTop: 10}}
                color="#fff"></Icon>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'TitilliumWeb-Regular',
                  color: '#fff',
                }}>
                Tandem
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 20, marginLeft: 20, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() =>
                this.state.menuHead['menuAppr']
                  ? navigation.navigate('DashboardNavigator', {
                      screen: 'newreg',
                    })
                  : console.log('Anda Tidak Diizinkan')
              }
              style={{
                width: 60,
                height: 70,
                borderWidth: 1,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor: this.state.menuHead['menuAppr']
                  ? '#f59e0b'
                  : '#fdba74',
                borderColor: '#fff',
              }}>
              <Icon
                name="signature"
                type="font-awesome-5"
                style={{marginTop: 10}}
                color="#fff"></Icon>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'TitilliumWeb-Regular',
                  color: '#fff',
                }}>
                Setujui
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                (this.state.usertype === 2 || this.state.usertype === 5) &&
                this.state.menuHead['menuBroadcast']
                  ? navigation.navigate('DashboardNavigator', {
                      screen: 'Broadcastlist',
                    })
                  : console.log('Hanya Untuk Relawan Utama')
              }
              style={{
                width: 60,
                height: 70,
                marginLeft: 10,
                borderWidth: 1,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor:
                  (this.state.usertype == 2 || this.state.usertype == 5) &&
                  this.state.menuHead['menuBroadcast']
                    ? '#f59e0b'
                    : '#fdba74',
                borderColor: '#fff',
              }}>
              <Icon
                name="broadcast"
                type="material-community"
                style={{marginTop: 10}}
                color="#fff"></Icon>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 10,
                  fontFamily: 'TitilliumWeb-Regular',
                  textAlign: 'center',
                }}>
                Blasting WA
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.state.menuHead['menureferral']
                  ? navigation.navigate('DashboardNavigator', {
                      screen: 'relawanlist',
                    })
                  : console.log('Anda Tidak Diizinkan')
              }
              style={{
                width: 60,
                height: 70,
                marginLeft: 10,
                borderWidth: 1,
                borderRadius: 10,
                alignItems: 'center',
                borderColor: 'white',
                backgroundColor: this.state.menuHead['menureferral']
                  ? '#f59e0b'
                  : '#fdba74',
              }}>
              <Icon
                name="user-friends"
                type="font-awesome-5"
                style={{marginTop: 10}}
                color={'#fff'}></Icon>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'TitilliumWeb-Regular',
                  color: '#fff',
                }}>
                Downline
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                (this.state.usertype == 5 || this.state.usertype == 2) &&
                this.state.menuHead['menuReport']
                  ? navigation.navigate('CalegView', {
                      ishead: this.state.ishead,
                    })
                  : console.log('Hanya Untuk Caleg')
              }
              style={{
                width: 60,
                height: 70,
                marginLeft: 10,
                borderWidth: 1,
                borderRadius: 10,
                alignItems: 'center',
                borderColor: 'white',
                backgroundColor:
                  (this.state.usertype == 5 || this.state.usertype == 2) &&
                  this.state.menuHead['menuReport']
                    ? '#f59e0b'
                    : '#fdba74',
              }}>
              <Icon
                name="tasks"
                type="font-awesome-5"
                style={{marginTop: 10}}
                color={'#fff'}></Icon>
              <Text
                style={{
                  color: '#fff',
                  fontSize: w * 0.029,
                  fontFamily: 'TitilliumWeb-Regular',
                }}>
                Insight
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                if (
                  (this.state.usertype == 5 || this.state.usertype == 2) &&
                  this.state.menuHead['menuElektoral']
                ) {
                  await analytics().logEvent('menuelektoral', {
                    id: this.state.username,
                    item: this.state.usernama + ' :Menuju Menu Elektoral',
                    description: 'Buka Menu Elektoral',
                  });
                  navigation.navigate('DashboardNavigator', {
                    screen: 'rekapelektoral',
                  });
                } else {
                  console.log('Hanya Untuk Caleg');
                }
              }}
              style={{
                width: 60,
                height: 70,
                marginLeft: 10,
                borderWidth: 1,
                borderRadius: 10,
                alignItems: 'center',
                borderColor: 'white',
                backgroundColor:
                  (this.state.usertype == 5 || this.state.usertype == 2) &&
                  this.state.menuHead['menuElektoral']
                    ? '#f59e0b'
                    : '#fdba74',
              }}>
              <Icon
                name="percent"
                type="font-awesome-5"
                style={{marginTop: 10}}
                color={'#fff'}></Icon>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'TitilliumWeb-Regular',
                  color: '#fff',
                  textAlign: 'center',
                }}>
                Elektabilitas
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.rekappemilu.indexOf(this.state.kandidatid) > -1 &&
          (this.state.usertype == 5 || this.state.usertype == 2) ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DashboardNavigator', {
                  screen: 'rekappemilu',
                  params: {dapilid: this.state.dapilid},
                })
              }
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <View
                style={{
                  width: '90%',
                  height: 30,
                  borderWidth: 1,
                  borderColor: '#fdba74',
                  borderRadius: 10,
                  backgroundColor: '#fdba74',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: w * 0.034,
                    textAlign: 'center',
                    color: '#10b981',
                    fontWeight: 'bold',
                  }}>
                  MAPPING SUARA PEMILU 2019
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
          <View
            style={{
              marginTop: 20,
              marginLeft: 20,
              borderBottomWidth: 3,
              borderBottomColor: '#f59e0b',
              width: '70%',
              padding: 5,
            }}>
            <Text style={{color: 'black', fontFamily: 'TitilliumWeb-Regular'}}>
              INFORMASI LAPORAN RELAWAN
            </Text>
          </View>

          {this.state.loader ? (
            <View style={{marginTop: 50}}>
              <SkypeIndicator color="#f59e0b" />
            </View>
          ) : this.state.datainfo.length === 0 ? (
            <View style={{marginTop: 10, marginLeft: 25}}>
              <Text style={{fontFamily: 'TitilliumWeb-Regular'}}>
                Belum Ada Data Laporan{' '}
              </Text>
            </View>
          ) : (
            this.state.datainfo.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={async () => {
                  await analytics().logEvent('dlaporan', {
                    id: item.id,
                    item:
                      this.state.usernama +
                      ' :Lihat Detail Laporan :' +
                      item.id,
                    description: item.deskripsi,
                  });

                  navigation.navigate('DashboardNavigator', {
                    screen: 'detail',
                    params: {idlaporan: item.id},
                  });
                }}
                style={{
                  width: '90%',
                  height: 95,
                  flexDirection: 'row',
                  marginLeft: 30,
                  marginTop: 10,
                  borderBottomColor: '#fcba03',
                  borderBottomWidth: 1,
                }}>
                <View style={{width: 100, height: 100}}>
                  {item.gambar == 'aktifitas.png' ? (
                    <Icon
                      name="calendar"
                      type="font-awesome"
                      size={50}
                      style={{alignSelf: 'center', marginTop: 10}}
                    />
                  ) : (
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
                  )}
                </View>
                <View style={{width: '70%', paddingTop: 5}}>
                  <Text
                    style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 12}}>
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
                      {item.deskripsi
                        .replace(/(\r\n|\n|\r)/gm, ' ')
                        .substring(0, 55)}{' '}
                      ..
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      type="font-awesome-5"
                      name="user"
                      size={13}
                      style={{marginTop: 5, marginRight: 6}}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: 'TitilliumWeb-Regular',
                        marginTop: 5,
                      }}>
                      {item.author}{' '}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
        {this.state.trialicon &&
        this.state.akuntrial.indexOf(this.state.userid) > -1 ? (
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'whatsapp://send?text=Hallo Redinesia, Bagaimana Caranya Bergabung&phone=' +
                  this.state.saleswa,
              )
            }
            activeOpacity={0.7}
            style={{
              position: 'absolute',
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              right: 30,
              bottom: 30,
            }}>
            <Icon
              name="whatsapp"
              type="font-awesome-5"
              size={40}
              color={'green'}
            />
            <Text style={{fontWeight: 'bold'}}>Tanya Kami</Text>
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
export default AppHome;
