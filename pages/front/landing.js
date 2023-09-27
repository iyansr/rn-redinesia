import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Dimensions,
  Linking,
  Image,
} from 'react-native';
import BtnStandard from '../component/BtnStandard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import SafeAreaView from 'react-native-safe-area-view';
import axios from 'react-native-axios';
import {API_URL} from '@env';
import {Icon} from 'react-native-elements';
import Modal from 'react-native-modal';
import analytics from '@react-native-firebase/analytics';
import database, {firebase} from '@react-native-firebase/database';

class AppLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pekerjaan: '',
      lokasikerja: '',
      routing: false,
      email: '',
      login: false,
      session_id: null,
      isModalVisible: false,
      bglanding: '',
      ctitle: '#FFFFFF',
      title1: '',
      title2: '',
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.ProfilesData();
      // this.getCurrentUser();
      // /this.isSignedIn();
      this.GetConfig();
    });
  }

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  GetConfig = async () => {
    const self = this;
    var config = {
      method: 'get',
      url: API_URL + `/config`,
    };
    await axios(config)
      .then(function (response) {
        //console.log("---->AKTS"+JSON.stringify(response.data.data));
        var configdata = response.data.data;
        self.setState({
          registerdpt: configdata[0].registerdpt,
          messageWa: configdata[0].whatsapp_message,
          waSales: configdata[0].wa_sales,
        });
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

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("==========ooooo========"+JSON.stringify(datastring[0].user_id));
        this.setState({
          session_id: datastring[0].user_id,
        });
      } else {
        this.setState({
          session_id: null,
        });
      }
      this.getDataStyle();
    } catch (e) {
      // error reading value
    }
  };

  getDataStyle = async () => {
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
        this.setState({
          bglanding: dataRF.bglanding,
          ctitle: dataRF.ctitle,
          title1: dataRF.title1,
          title2: dataRF.title2,
        });
      });
    return () => database().ref(`/style`).off('value', onValueChange);
  };

  goToNext = (statuslogin, sessionId) => {
    //console.log("=====LOGINSTATE====="+statuslogin);
    //console.log("=====SESSIONSTATE====="+sessionId);
    //console.log("=====SLEBEWW====="+API_URL);
    const {navigation} = this.props;
    if (sessionId === null) {
      navigation.navigate('login');
    } else {
      if (statuslogin == true) {
        navigation.navigate('DashboardBottomNavigator');
      } else {
        navigation.navigate('login');
      }
      //navigation.navigate('login')
    }
  };

  setVisibleModal = vdata => {
    this.setState({
      isModalVisible: !vdata,
    });
  };

  render() {
    const {navigation} = this.props;
    let h = Dimensions.get('window').height;
    let w = Dimensions.get('window').width;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          hjn
          backgroundColor="transparent"
        />
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: '#f59e0b',
          }}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 18,
                // fontWeight: 'bold',
                textAlign: 'center',
                color: '#fff',
                fontFamily: 'FredokaOne-Regular',
              }}>
              Selamat Datang Di
            </Text>
            <Text
              style={{
                fontSize: 36,
                marginBottom: 20,
                textAlign: 'center',
                color: '#fff',
                fontFamily: 'FredokaOne-Regular',
              }}>
              Redinesia
            </Text>
          </View>
          <Image
            style={{
              flex: 1,
              resizeMode: 'contain',
              alignSelf: 'center',
              width: '100%',
              marginBottom: 32,
            }}
            source={require('../../assets/images/home_illu.png')}
          />

          <View
            style={{
              paddingHorizontal: 24,
              paddingBottom: 64,
            }}>
            <TouchableOpacity
              onPress={() => this.goToNext(true, this.state.session_id)}
              style={{
                width: '100%',
              }}>
              <BtnStandard name="Login" style={{backgroundColor: '#11b7ae'}} />
            </TouchableOpacity>
            <View
              style={{
                marginTop: 20,
                flex: 1,
                flexDirection: 'row',
                alignContent: 'center',
                width: '100%',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                onPress={async () => {
                  await analytics().logEvent('landingsendwa', {
                    id: 1,
                    item: 'Mengirim WA Bertanya Ttg Redinesia',
                    description: 'Landing Page, Mengirim WA Tentang Redinesia',
                  });
                  Linking.openURL(
                    'whatsapp://send?text=' +
                      this.state.messageWa +
                      '&phone=' +
                      this.state.waSales +
                      '',
                  );
                }}
                style={{
                  width: '60%',
                }}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    marginLeft: 10,
                    flexDirection: 'row',
                    width: '80%',
                    borderWidth: 1,
                    borderColor: '#f59e0b',
                    justifyContent: 'center',
                    height: 40,
                    borderRadius: 12,
                  }}>
                  <Icon
                    name="whatsapp"
                    type="font-awesome-5"
                    size={22}
                    color="green"
                    style={{alignSelf: 'center', top: 4}}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: '#f59e0b',
                      marginLeft: 10,
                      fontSize: 12,
                      fontFamily: 'TitilliumWeb-Regular',
                    }}>
                    TENTANG REDINESIA
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await analytics().logEvent('landingopenmodaldisclaimer', {
                    id: 1,
                    item: 'Membuka Modal Disclaimer di Landing Page',
                    description: 'Membuka Disclaimer Modal',
                  });
                  this.setVisibleModal(this.state.isModalVisible);
                }}
                style={{
                  width: '55%',
                }}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    marginLeft: -15,
                    flexDirection: 'row',
                    width: '75%',
                    borderWidth: 1,
                    borderColor: '#f59e0b',
                    justifyContent: 'center',
                    height: 40,
                    borderRadius: 12,
                  }}>
                  <Icon
                    name="info-circle"
                    type="font-awesome-5"
                    size={22}
                    color="#f59e0b"
                    style={{alignSelf: 'center', top: 6}}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: '#f59e0b',
                      marginLeft: 10,
                      fontSize: 12,
                      fontFamily: 'TitilliumWeb-Regular',
                    }}>
                    DISCLAIMER
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              marginTop: 20,
              paddingBottom: 32,
              fontSize: 12,
              textAlign: 'center',
              color: '#f59e0b',
            }}>
            Versi {DeviceInfo.getVersion()}
          </Text>
        </View>

        <Modal
          isVisible={this.state.isModalVisible}
          onBackButtonPress={() =>
            this.setVisibleModal(this.state.isModalVisible)
          }>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.nameText}>Informasi Disclaimer</Text>
              <Text style={styles.followText}></Text>
            </View>
            <View
              style={{
                height: 500,
                backgroundColor: 'white',
                paddingVertical: 10,
                padding: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'TitilliumWeb-Regular',
                  marginBottom: 5,
                  textAlign: 'justify',
                }}>
                -{' '}
                <Text style={{color: '#f59e0b', fontWeight: 'bold'}}>
                  Redinesia
                </Text>{' '}
                adalah aplikasi yang bertujuan untuk membantu calon anggota
                legislatif dalam merekrut pendukung dan mengelola relawan yang
                memungkinkan para Kandidat untuk memantau kinerja mereka secara
                real time.{' '}
              </Text>
              <Text
                style={{
                  fontFamily: 'TitilliumWeb-Regular',
                  marginBottom: 5,
                  textAlign: 'justify',
                }}>
                - Dengan semua fitur yang disediakan oleh{' '}
                <Text style={{color: '#f59e0b', fontWeight: 'bold'}}>
                  Redinesia
                </Text>
                , Kandidat dapat dengan mudah melakukan tracking aktivitas dan
                interaksi mereka dengan masyarakat, serta memantau progres
                dukungan yang telah mereka terima.{' '}
              </Text>
              <Text
                style={{
                  fontFamily: 'TitilliumWeb-Regular',
                  marginBottom: 5,
                  textAlign: 'justify',
                }}>
                - Aplikasi{' '}
                <Text style={{color: '#f59e0b', fontWeight: 'bold'}}>
                  Redinesia
                </Text>{' '}
                <Text style={{fontWeight: 'bold'}}>
                  tidak mewakili dan tidak terkait dengan entitas Pemerintah
                  atau Partai Apapun
                </Text>
                ,{' '}
                <Text style={{color: '#f59e0b', fontWeight: 'bold'}}>
                  Redinesia
                </Text>{' '}
                hanya sebagai alat bantu bagi calon anggota legislatif dalam
                mengelola dukungan.
              </Text>
              <Text
                style={{
                  fontFamily: 'TitilliumWeb-Regular',
                  marginBottom: 5,
                  textAlign: 'justify',
                }}>
                - Pada Fitur{' '}
                <Text style={{color: '#f59e0b', fontWeight: 'bold'}}>
                  Redinesia
                </Text>{' '}
                rekrut pendukung menggunakan DPT 2019, data tersebut kami ambil
                dari open-data KPU 2019.
              </Text>
              <Text
                style={{
                  fontFamily: 'TitilliumWeb-Regular',
                  marginBottom: 5,
                  textAlign: 'justify',
                }}>
                - Terms, Condition dan disclaimer:{' '}
                <Text
                  style={{color: '#f59e0b'}}
                  onPress={() =>
                    Linking.openURL('https://mytimses.com/terms.html')
                  }>
                  https://Redinesia.com/terms.html
                </Text>
              </Text>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={{
                  width: '100%',
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
                  OK, Saya Mengerti
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
  logoContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action2: {
    flexDirection: 'row',
    width: '100%',
  },
  backgroundImage2: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  card: {
    backgroundColor: '#fff',
    width: screen.width * 0.9,
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
});
export default AppLanding;
