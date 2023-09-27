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
import DatePicker from 'react-native-date-picker';
import {Icon} from 'react-native-elements';
import {Buffer} from 'buffer';

export default class EventInputScreen extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      deskripsi: '',
      long: '',
      lat: '',
      loader: false,
      tglevent: new Date(),
      open: false,
      place: '',
      title: '',
      tgldb: '',
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {ids} = this.props.route.params;

      this.ProfilesData();
      //this.getLocation();
      this.setState({
        idaktivitas: ids,
      });
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
        this.GetDataEventId(this.state.idaktivitas);
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
    //console.log("TGLLLLLL>>>>",input);
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + '/' + month + '/' + year;
  }

  setDate = ref => {
    const datatgl = JSON.stringify(ref);

    //console.log("=======",ref);
    this.setState({
      tglevent: ref,
      tgldb: this.formatDate(ref.toISOString().split('T')[0]),
    });
  };

  setOpen = ref => {
    this.setState({open: ref});
  };

  setDeskripsi = des => {
    this.setState({deskripsi: des});
  };

  setPlace = des => {
    this.setState({place: des});
  };

  setTitle = t => {
    this.setState({title: t});
  };

  GetDataEventId = id => {
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
      url: API_URL + `/aktifitas/` + id,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        let ft = [];
        const eventdata = response.data.data;
        //console.log("---->AKTSSSS2222"+(eventdata[0]["ak_datetime"]).split(" ")[0]);
        if (response.data.success === true) {
          var objmaps64 = {};
          self.setState({
            tgldb: self.formatDate(eventdata[0]['ak_datetime'].split(' ')[0]),
            tglevent: new Date(eventdata[0]['ak_datetime'].split(' ')[0]),
            title: eventdata[0]['ak_title'],
            deskripsi: eventdata[0]['ak_deskripsi'],
            place: eventdata[0]['ak_place'],
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

  SaveEvent = () => {
    //console.log(JSON.stringify(this.state));

    if (
      this.state.title != '' &&
      this.state.deskripsi != '' &&
      this.state.place != ''
    ) {
      const self = this;
      self.setState({loader: true});
      const {navigation} = this.props;

      var formData = new URLSearchParams();
      formData.append('id', this.state.idaktivitas);
      formData.append(
        'datetime',
        new Date(self.state.tglevent).toISOString().slice(0, 10),
      );
      formData.append('title', this.state.title);
      formData.append('deskripsi', this.state.deskripsi);
      formData.append('place', this.state.place);

      var config = {
        method: 'post',
        url: API_URL + `/aktifitas/edit`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
          Authorization: 'Bearer ' + self.state.token,
        },

        data: formData,
      };

      axios(config)
        .then(function (response) {
          //console.log("---->SAVE EVENT"+JSON.stringify(response.data));
          var profile = response.data.data;

          if (response.data.success === true) {
            alert('Sukses');
            navigation.navigate('DashboardBottomNavigator', {
              screen: 'campaign',
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
        message: 'Form harus diisi!',
        type: 'danger',
      });
    }
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
            Edit Aktifitas{' '}
          </Text>
        </View>
        <ScrollView style={{marginTop: 0, marginLeft: 5}}>
          <View style={styles.formcontainer}>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="calendar-day"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <View style={styles.usernameInput}>
                <Text style={{marginTop: 10}}>{this.state.tgldb}</Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <TouchableOpacity
                  style={styles.eyeInput}
                  onPress={() => this.setOpen(true)}>
                  <Icon
                    name="calendar"
                    type="font-awesome"
                    color="#f59e0b"
                    size={15}
                  />
                </TouchableOpacity>
              </View>
              <DatePicker
                modal
                open={this.state.open}
                date={this.state.tglevent}
                onConfirm={date => {
                  this.setOpen(false);
                  this.setDate(date);
                }}
                onCancel={() => {
                  this.setOpen(false);
                }}
                onDateChange={date => {
                  this.setDate(date),
                    this.setState({
                      setTanggal: true,
                    });
                }}
                title="Pilih Tanggal Event"
                confirmText="Pilih"
                cancelText="Batal"
                mode="date"
                maximumDate={dt}
                minimumDate={new Date()}
                androidVariant="iosClone"
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text>Tempat</Text>
              </View>
              <TextInput
                placeholderTextColor="#707070"
                returnKeyType="next"
                multiline={false}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.place}
                onChangeText={text => this.setPlace(text)}
              />
              {/* <View style={{flexDirection: 'row', marginTop: 10}}>
                                <TouchableOpacity style={styles.eyeInput} onPress={() => navigation.navigate("getlocation")}>
                                    <Icon name="location-arrow" type="font-awesome-5" color="#f59e0b" size={15}/>
                                </TouchableOpacity>
                             </View> */}
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text>Judul Event</Text>
              </View>
              <TextInput
                placeholderTextColor="#707070"
                returnKeyType="next"
                multiline={false}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.title}
                onChangeText={text => this.setTitle(text)}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticonmultiline}>
                <Text style={{textAlignVertical: 'top'}}>Deskripsi</Text>
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
          <TouchableOpacity
            onPress={() => this.SaveEvent()}
            style={{
              height: 80,
              width: '90%',
              marginTop: 10,
              alignSelf: 'center',
            }}>
            <BtnStandard name="Kirim" />
          </TouchableOpacity>
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
