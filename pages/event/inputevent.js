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
import PushNotification from 'react-native-push-notification';
import {Icon} from 'react-native-elements';
import {Buffer} from 'buffer';
import analytics from '@react-native-firebase/analytics';

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
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.ProfilesData();
      //this.getLocation();
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
        //console.log("==========ccccc========"+datastring[0].k_name);
        this.setState({
          token: datastring[0].token,
          nama_kandidat: datastring[0].k_name,
          kandidat_id: datastring[0].k_id,
          user_id: datastring[0].user_id,
          usernama: datastring[0].usernama,
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

  formatDate(input) {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + '/' + month + '/' + year;
  }

  setDate = ref => {
    const datatgl = JSON.stringify(ref);

    //console.log("=======",ref);
    this.setState({tglevent: ref, tanggalLahir: ref});
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
      formData.append('user_id', this.state.user_id);
      formData.append('kandidat_id', this.state.kandidat_id);
      formData.append(
        'datetime',
        new Date(self.state.tglevent).toISOString().slice(0, 10),
      );
      formData.append('title', this.state.title);
      formData.append('deskripsi', this.state.deskripsi);
      formData.append('place', this.state.place);

      var config = {
        method: 'post',
        url: API_URL + `/aktifitas/add`,
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

            let tgleventpush = new Date(self.state.tglevent)
              .toISOString()
              .slice(0, 10);
            self.sendPushNotif(self.state.title, tgleventpush);

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

  sendPushNotif = (aktTitle, dt) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'timsesapps', // (required) channelId, if the channel doesn't exist, notification will not trigger.
      ticker: 'Ada Aktifitas Baru', // (optional)
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      //largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
      //largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
      //smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      bigText:
        'Ada Aktifitas Baru Di Kalender. Tanggal ' + dt + '. ' + aktTitle, // (optional) default: "message" prop
      subText: 'Ada Aktifitas Baru', // (optional) default: none
      //bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
      //bigLargeIcon: "ic_launcher", // (optional) default: undefined
      //bigLargeIconUrl: "https://www.example.tld/bigicon.jpg", // (optional) default: undefined
      color: 'green', // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //tag: "some_tag", // (optional) add tag to message
      //group: "group", // (optional) add group to message
      //groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      //ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: 'high', // (optional) set notification priority, default: high
      //visibility: "private", // (optional) set notification visibility, default: private
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      //shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false

      //when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      //usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      //timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

      messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

      //actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      /* iOS only properties */
      //category: "", // (optional) default: empty string
      //subtitle: "Ada Aktifitas Baru Di Kalender!", // (optional) smaller title below notification title

      /* iOS and Android properties */
      //id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: 'Ada Aktifitas Baru Di Kalender', // (optional)
      message:
        'Ada Aktifitas Baru Di Kalender. Tanggal ' + dt + '. ' + aktTitle, // (required)
      //picture: "https://www.example.tld/picture.jpg", // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
      userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      //number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      //repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
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
            Tambah Aktifitas{' '}
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
                <Text style={{marginTop: 10}}>
                  {this.formatDate(
                    this.state.tglevent.toISOString().split('T')[0],
                  )}
                </Text>
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
            onPress={async () => {
              await analytics().logEvent('inputevent', {
                id: this.state.user_id,
                item:
                  this.state.usernama + ' :Input Event :' + this.state.title,
                description: 'Input Event',
              });
              this.SaveEvent();
            }}
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
