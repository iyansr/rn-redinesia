import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import BtnStandard from '../component/BtnStandard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import {Badge} from '@rneui/themed';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import ImageModal from 'react-native-image-modal';

export default class MonitoringScreen extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataLaporan: [],
      isFetching: false,
      userid: 0,
      lat: '-6.4158345',
      long: '106.8213416',
      selectedSentimen: ['success', 'primary', 'error'],
      selectedSentVal: ['Positif', 'Netral', 'Negatif'],
      objimage: [],
      Region: [],
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {idlaporan} = this.props.route.params;
      this.setState({
        idlaporan: idlaporan,
      });
      this.ProfilesData();
    });
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
        //console.log("-->Profilesds", JSON.stringify(datastring[0]["user_id"]));
        if (datastring.session_id != '') {
          this.setState({
            login: true,
            token: datastring[0]['token'],
            userid: datastring[0]['user_id'],
            usernama: datastring[0]['usernama'],
            userimage: datastring[0]['user_photo'],
            kandidat: datastring[0]['k_name'],
          });
          this.GetDataLaporan(this.state.idlaporan);
          //this.GetDataSurvey(datastring[0]["user_id"]);
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataLaporan = idlaporan => {
    const self = this;

    self.setState({
      objimage: [],
    });

    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/laporan/` + idlaporan,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->REPORTSDETAIL"+JSON.stringify(response.data.data));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            //console.log("----datetime122---", items["lap_lat"]);
            self.setState({
              id: items['lap_id'],
              long: items['lap_long'],
              lat: items['lap_lat'],
              kategori: items['kl_nama'],
              pelapor: items['usernama'],
              pelapor_id: items['lap_user_id'],
              waktu: items['lap_datetime'],
              sentimen: self.state.selectedSentVal[items['lap_sentimen']],
              deskripsi: items['lap_deskripsi'],
            });
          });

          response.data.images.forEach((items, index) => {
            //console.log("imggg",items.li_image);
            self.state.objimage.push(items.li_image);
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

  ProsesHapus = () => {
    const {navigation} = this.props;

    return Alert.alert(
      'Apakah Anda Yakin?',
      'Apakah anda yakin Ingin Menghapus Konten Laporan ini?',
      [
        // The "Yes" button
        {
          text: 'YA, Saya Yakin',
          onPress: () => {
            this.HapusLaporan();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'Batal',
          onPress: () => {
            navigation.navigate('DashboardBottomNavigator', {screen: 'home'});
          },
        },
      ],
    );
  };

  HapusLaporan = () => {
    const self = this;
    self.setState({loader: true});
    const {navigation} = this.props;

    var formData = new URLSearchParams();
    formData.append('id', self.state.idlaporan);

    var config = {
      method: 'post',
      url: API_URL + `/laporan/hapus`,
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
          navigation.navigate('DashboardBottomNavigator', {screen: 'home'});
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

  render() {
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />

        <View style={{width: '100%', height: 200}}>
          <MapView
            //style={styles.map}
            style={{flex: 1, zIndex: -999999}}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: parseFloat(this.state.lat),
              longitude: parseFloat(this.state.long),
              latitudeDelta: 0.0008,
              longitudeDelta: 0.0007,
            }}>
            <Marker
              coordinate={{
                latitude: parseFloat(this.state.lat),
                longitude: parseFloat(this.state.long),
              }}
              pinColor={'orange'} // any color
              title="Laporan Kategori :"
              description={this.state.kategori}
            />
          </MapView>
        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: 15,
            alignContent: 'flex-end',
            height: 20,
            justifyContent: 'flex-end',
            flexDirection: 'row',
          }}>
          {this.state.pelapor_id !== this.state.userid ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DashboardNavigator', {
                  screen: 'laporkan',
                  params: {idlaporan: this.state.idlaporan},
                })
              }
              style={{
                width: 100,
                borderWidth: 1,
                borderColor: '#CFCFCF',
                backgroundColor: '#a1534f',
                borderRadius: 19,
                alignSelf: 'flex-end',
                justifyContent: 'center',
                flexDirection: 'row',
                height: 25,
              }}>
              <Icon
                name="exclamation-circle"
                type="font-awesome-5"
                size={16}
                style={{alignSelf: 'center', top: 1}}
                color={'#FFFFFF'}
              />
              <Text
                style={{textAlign: 'right', marginLeft: 5, color: '#FFFFFF'}}>
                Laporkan
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.ProsesHapus()}
              style={{
                width: 80,
                borderWidth: 1,
                borderColor: '#CFCFCF',
                backgroundColor: '#a1534f',
                borderRadius: 19,
                alignSelf: 'flex-end',
                justifyContent: 'center',
                flexDirection: 'row',
                height: 25,
              }}>
              <Icon
                name="trash"
                type="font-awesome-5"
                size={12}
                style={{alignSelf: 'center', top: 3}}
                color={'#FFFFFF'}
              />
              <Text
                style={{textAlign: 'right', marginLeft: 5, color: '#FFFFFF'}}>
                Hapus
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView style={{marginTop: 0, marginLeft: 2}}>
          <View style={styles.formcontainer}>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text style={{fontFamily: 'TitilliumWeb-Regular'}}>
                  Kategori :
                </Text>
              </View>
              <TextInput
                placeholder="Nama Lengkap"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                editable={false}
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.kategori}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text style={{fontFamily: 'TitilliumWeb-Regular'}}>
                  Pelapor :
                </Text>
              </View>
              <TextInput
                placeholder="Nama Lengkap"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                editable={false}
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.pelapor}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text style={{fontFamily: 'TitilliumWeb-Regular'}}>
                  Tanggal/Jam :
                </Text>
              </View>
              <TextInput
                placeholder="Nama Lengkap"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                editable={false}
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.waktu}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text style={{fontFamily: 'TitilliumWeb-Regular'}}>
                  Sentimen :
                </Text>
              </View>
              <TextInput
                placeholder="Nama Lengkap"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                editable={false}
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.sentimen}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{
                    fontFamily: 'TitilliumWeb-Regular',
                    alignItems: 'flex-start',
                  }}>
                  Deskripsi :
                </Text>
              </View>
              <View style={{width: '70%', height: 80}}>
                <Text>{this.state.deskripsi}</Text>
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <ScrollView horizontal={true}>
                {this.state.objimage.map((img, index) => (
                  <View
                    key={index}
                    style={{
                      width: 150,
                      height: 150,
                      borderWidth: 0,
                      borderColor: 'black',
                      paddingTop: 2,
                    }}>
                    <ImageModal
                      resizeMode="contain"
                      imageBackgroundColor="#000000"
                      source={{uri: `data:image/png;base64,${img}`}}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 10,
                        borderWidth: 1,
                        marginRight: 0,
                        marginTop: 10,
                      }}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
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
    marginTop: 0,
    height: Dimensions.get('window').height - 220,
    padding: 20,
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
    fontFamily: 'TitilliumWeb-Regular',
  },
  action1: {
    flexDirection: 'row',
    borderRadius: 12,
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
    fontFamily: 'TitilliumWeb-Regular',
  },
});
