import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
//import BtnStandard from '../component/BtnStandard'
//import BtnDisabled from '../component/BtnDisabled'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaView from 'react-native-safe-area-view';
import axios from 'react-native-axios';
import {Icon} from 'react-native-elements';
import {API_URL} from '@env';
//import {UIActivityIndicator} from 'react-native-indicators';
//import Modal from "react-native-modal";
import SelectDropdown from 'react-native-select-dropdown';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import Clipboard from '@react-native-clipboard/clipboard';

class AppLanding extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      judulberita: '',
      //sumber : '',
      link: '',
      selectedSumber: 'Sumber Berita Online',
      selectSumber: [
        'Berita Online Web',
        'Facebook',
        'Twitter',
        'Instagram',
        'Whatsapp',
        'Threads',
      ],
      selectedValueSumber: '-',
    };
  }

  componentDidMount() {
    //console.log("=====SLEBEWW====="+API_URL);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {id} = this.props.route.params;
      this.setState({
        idbuzz: id,
      });
      this.ProfilesData(id);
    });
  }

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  ProfilesData = async id => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->Profilesd", JSON.stringify(datastring));
        if (datastring.session_id != '') {
          this.setState({
            login: true,
            usernama: datastring[0]['usernama'],
            token: datastring[0]['token'],
            userimage: datastring[0]['user_photo'],
            kandidat: datastring[0]['k_name'],
            kandidatid: datastring[0]['k_id'],
            userid: datastring[0]['user_id'],
            usertype: datastring[0]['type'],
            jumlahsurvey: datastring[0]['jumlahsurvey'],
          });
          this.GetDataBuzzId(this.state.idbuzz);
          this.AddButton(datastring[0]['type'], id);
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  AddButton = (type, id) => {
    (type === 2) | (type === 5)
      ? this.props.navigation.setOptions({
          headerRight: () => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => this.Deleted(this.state.judulberita, id)}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                    marginRight: 20,
                  }}>
                  <Icon
                    name="trash"
                    type="font-awesome-5"
                    size={20}
                    color="red"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
          },
        })
      : null;
  };

  GetDataBuzzId = idbuzz => {
    this.setState({dataBuzz: [], loader: true});
    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/buzz/` + idbuzz,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        var buzdata = JSON.parse(JSON.stringify(response.data.data[0]));
        //console.log("---->REPORTSBUZZZ"+buzdata.buzz_id);
        let ft = [];
        if (response.data.success === true) {
          self.setState({
            idbuzz: buzdata.buzz_id,
            datetime: buzdata.buzz_datetime,
            judulberita: buzdata.buzz_judulberita,
            sumber: buzdata.buzz_sumber,
            link: buzdata.buzz_link,
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

  Deleted = (title, id) => {
    const {navigation} = this.props;

    return Alert.alert(
      'Apakah Anda Yakin?',
      'Apakah anda yakin Ingin Menghapus Buzz ' + title + ' ?',
      [
        // The "Yes" button
        {
          text: 'YA, Saya Yakin',
          onPress: async () => {
            this.DeleteBuzz(id);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'Nanti Dulu',
          onPress: () => {
            navigation.navigate('listbuzz');
          },
        },
      ],
    );
  };

  DeleteBuzz = id => {
    const self = this;
    self.setState({loader: true});
    const {navigation} = this.props;

    var formData = new URLSearchParams();
    formData.append('id', id);

    var config = {
      method: 'post',
      url: API_URL + `/buzz/delete`,
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
          navigation.navigate('listbuzz');
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
    let h = Dimensions.get('window').height;
    let w = Dimensions.get('window').width;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <ScrollView style={{marginTop: 0, marginLeft: 2}}>
          <View style={styles.formcontainer}>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="newspaper"
                  type="font-awesome-5"
                  color="#934386"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Judul Berita"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.judulberita}
                onChangeText={text => this.setJudul(text)}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="hashtag"
                  type="font-awesome-5"
                  color="#934386"
                  size={15}
                />
              </View>
              <SelectDropdown
                data={this.state.selectSumber}
                buttonStyle={{
                  width: '88%',
                  height: 40,
                  borderBottomWidth: 1,
                  borderColor: '#828282',
                  paddingHorizontal: 0,
                  backgroundColor: '#FFFFFF',
                }}
                buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                defaultButtonText={
                  this.state.selectedSumber != ''
                    ? this.state.selectedSumber
                    : 'Sumber Media Online'
                }
                dropdownStyle={{height: 100}}
                rowTextStyle={{textAlign: 'left'}}
                onSelect={(selectedItem, index) => {
                  this.setState({
                    selectedSumber: selectedItem,
                    selectedValueSumber: index,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                selectedRowStyle={{backgroundColor: '#f5e0d7'}}
                selectedRowTextStyle={{justifyContent: 'space-between'}}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                defaultValue={this.state.selectedSumber}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticonlink}>
                <Icon
                  name="link"
                  type="font-awesome-5"
                  color="#934386"
                  size={15}
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DashboardNavigator', {
                    screen: 'detailbuzz',
                    params: {links: this.state.link},
                  })
                }
                style={{top: 10}}>
                <Text style={{color: 'blue', fontWeight: 'bold', fontSize: 20}}>
                  LINK
                </Text>
              </TouchableOpacity>
              <View
                onPress={() =>
                  navigation.navigate('DashboardNavigator', {
                    screen: 'detailbuzz',
                    params: {links: this.state.link},
                  })
                }
                style={{top: 10}}>
                <Text style={{color: 'blue', fontWeight: 'bold', fontSize: 20}}>
                  <TouchableOpacity
                    onPress={() => this.copied(this.state.link)}
                    style={{flexDirection: 'row'}}>
                    <Icon
                      type="font-awesome-5"
                      name="copy"
                      size={14}
                      style={{marginLeft: 15}}
                    />
                    <Text style={{marginLeft: 5, top: -3, fontSize: 12}}>
                      Copy Link
                    </Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </View>

            <View style={{marginTop: 30}}>
              <Text style={{fontWeight: 'bold'}}>
                Apa yang harus relawan lakukan :
              </Text>
              <Text>1. Share berita positif dan berikan komentar positif</Text>
              <Text>
                2. Retweet atau teruskan berita kesemua akun sosial media
              </Text>
              <Text>3. Screenshot hasil share dan komentarmu</Text>
              <Text>
                4. Laporkan melalui fitur Laporan/Report pada aplikasi, sertakan
                hasil screnshot
              </Text>
            </View>
          </View>
        </ScrollView>
        <FlashMessage position="bottom" />
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
  formcontainer: {
    //position: 'absolute',
    marginTop: 7,
    height: Dimensions.get('window').height - 100,
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
  lefticonlink: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    alignContent: 'center',
    borderColor: '#828282',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
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
  action: {
    flexDirection: 'row',
  },
  action1: {
    flexDirection: 'row',
    borderRadius: 12,
  },
  action2: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'center',
  },
  action3: {
    flexDirection: 'row',
    borderRadius: 12,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  backgroundImage2: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
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

  passInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#828282',
  },
  eyeInput: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: '#E68127',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    alignContent: 'center',
    borderColor: '#828282',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
  error: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'red',
    paddingHorizontal: 5,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderColor: '#828282',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    fontSize: 12,
    fontFamily: 'TitilliumWeb-Regular',
  },
  errorselect: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'red',
    paddingHorizontal: 5,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderColor: '#828282',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    fontSize: 12,
    fontFamily: 'TitilliumWeb-Regular',
    marginLeft: -60,
  },

  footer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: screen.width * 0.8,
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
