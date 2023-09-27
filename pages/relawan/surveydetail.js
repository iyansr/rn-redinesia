import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  Alert,
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
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Clipboard from '@react-native-clipboard/clipboard';

export default class SurveyDetailcreen extends Component {
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
      jawaban: [],
      loader: false,
      lat: '-6.4158345',
      long: '106.8213416',
      selectKenal: ['Ya', 'Tidak'],
      selectMemilih: ['Akan Memilih Calon', 'Golput', 'Memilih calon lain'],
      selectType: ['Ideologi/Emosional', 'Rasional', 'Transaksional'],
      selectLike: ['Suka', 'Tidak Suka'],
      selectValid: ['Data Baru', 'Data Valid', 'Data Tidak Valid'],
      reason: '',
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {surveyid} = this.props.route.params;
      this.setState({
        survey_id_detail: surveyid,
      });
      this.ProfilesData();
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

        this.GetDataSurveyPerID(this.state.survey_id_detail);
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataSurveyPerID = idsurvey => {
    const self = this;
    const {navigation} = this.props;
    //console.log("tokeeen", self.state.token);

    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/survey/detail/` + idsurvey,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->AKTSTANYASURVEYs"+JSON.stringify(response.data.data));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            self.setState({
              namapenduduk: items.sjw_nama,
              umur: items.sjw_umur,
              long: items.sjw_long,
              lat: items.sjw_lat,
              photo: items.sjw_photo,
              pengenal: items.sjw_handphone,
              popularitas: items.sjw_popular,
              elektabilitas: items.sjw_elektabilitas,
              like: items.sjw_like,
              type: items.sjw_type,
              calonlain: items.sjw_pilihannamacalonlain,
              isvalid: items.sjw_status_valid,
              tgllahir: self.formatDate(items.user_tgl_lahir),
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
        }
      })
      .finally(response => {});
  };

  Validated = nama => {
    const {navigation} = this.props;

    return Alert.alert(
      'Valid?',
      'Apakah Data Survey Dengan Nama ' + nama + ' Valid?',
      [
        // The "Yes" button
        {
          text: 'YA, Valid',
          onPress: () => {
            this.ValidationProcess(1);
          },
        },
        {
          text: 'Tidak Valid',
          onPress: () => {
            this.ValidationProcess(2);
          },
        },
        {
          text: 'Nanti Dulu',
          onPress: () => {
            navigation.navigate('listsurvey');
          },
        },
      ],
    );
  };

  ValidationProcess = value => {
    const self = this;
    self.setState({loader: true});
    const {navigation} = this.props;

    var formData = new URLSearchParams();
    formData.append('validator_id', this.state.user_id);
    formData.append('status_valid', value);
    formData.append('reason', this.state.reason);
    formData.append('id', this.state.survey_id_detail);

    var config = {
      method: 'post',
      url: API_URL + `/validated`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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

          navigation.navigate('listsurvey');
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

  formatDate(input) {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + '/' + month + '/' + year;
  }

  render() {
    const w = Dimensions.get('window').width;
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
              title="Nama :"
              description={
                this.state.namapenduduk + '(' + this.state.tgllahir + ')'
              }
            />
          </MapView>
        </View>

        <ScrollView style={{marginTop: 0, marginLeft: 5}}>
          <View style={styles.formcontainer}>
            <View
              style={{flexDirection: 'row', marginTop: 10, paddingLeft: 10}}>
              <View
                style={{
                  width: 130,
                  height: 130,
                  borderWidth: 0,
                  borderColor: 'black',
                  paddingTop: 2,
                }}>
                <Image
                  source={{uri: `data:image/png;base64,${this.state.photo}`}}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 10,
                    borderWidth: 1,
                    marginRight: 0,
                  }}
                />
              </View>
              <View style={{width: '100%'}}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      marginTop: 10,
                      justifyContent: 'center',
                      height: 40,
                      backgroundColor: '#f7f5f5',
                      width: '20%',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'TitilliumWeb-Regular',
                        fontSize: 16,
                        alignSelf: 'center',
                      }}>
                      Nama
                    </Text>
                  </View>
                  <View
                    style={
                      (styles.action1,
                      {
                        marginTop: 10,
                        justifyContent: 'center',
                        paddingLeft: 5,
                        backgroundColor: '#FFFCF2',
                        height: 40,
                        width: '35%',
                      })
                    }>
                    <Text
                      style={{
                        fontFamily: 'TitilliumWeb-Regular',
                        fontSize: w * 0.03,
                      }}>
                      {this.state.namapenduduk}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      marginTop: 10,
                      justifyContent: 'center',
                      height: 40,
                      backgroundColor: '#f7f5f5',
                      width: '20%',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'TitilliumWeb-Regular',
                        fontSize: 16,
                        alignSelf: 'center',
                      }}>
                      Umur
                    </Text>
                  </View>
                  <View
                    style={
                      (styles.action1,
                      {
                        marginTop: 10,
                        justifyContent: 'center',
                        paddingLeft: 5,
                        backgroundColor: '#FFFCF2',
                        height: 40,
                        width: '35%',
                      })
                    }>
                    <Text
                      style={{
                        fontFamily: 'TitilliumWeb-Regular',
                        fontSize: 16,
                      }}>
                      {this.state.umur}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  Identitas/No. HP{' '}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  paddingLeft: 5,
                  backgroundColor: '#FFFCF2',
                  height: 40,
                  width: '45%',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'TitilliumWeb-Regular',
                    color: 'red',
                    width: '100%',
                  }}>
                  {this.state.pengenal}
                  <TouchableOpacity
                    onPress={() => this.copied(this.state.pengenal)}>
                    <Icon
                      type="font-awesome-5"
                      name="copy"
                      size={14}
                      style={{marginLeft: 15}}
                    />
                  </TouchableOpacity>
                </Text>
              </View>
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                  Kenal Calon?{' '}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  paddingLeft: 5,
                  backgroundColor: '#FFFCF2',
                  height: 40,
                  width: '45%',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'TitilliumWeb-Regular',
                    color: 'red',
                  }}>
                  {this.state.selectKenal[this.state.popularitas]}
                </Text>
              </View>
            </View>
            {this.state.popularitas === 0 ? (
              <View style={styles.action1}>
                <View style={styles.lefticon}>
                  <Text
                    style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                    Suka Calon{' '}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    paddingLeft: 5,
                    backgroundColor: '#FFFCF2',
                    height: 40,
                    width: '45%',
                  }}>
                  <Text
                    style={{fontSize: 16, fontFamily: 'TitilliumWeb-Regular'}}>
                    {this.state.selectLike[this.state.like]}
                  </Text>
                </View>
              </View>
            ) : null}
            {this.state.popularitas === 0 ? (
              <View style={styles.action1}>
                <View style={styles.lefticon}>
                  <Text
                    style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                    Status Pilihan{' '}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    paddingLeft: 5,
                    backgroundColor: '#FFFCF2',
                    height: 40,
                    width: '45%',
                  }}>
                  <Text
                    style={{fontSize: 16, fontFamily: 'TitilliumWeb-Regular'}}>
                    {this.state.selectMemilih[this.state.elektabilitas]}
                  </Text>
                </View>
              </View>
            ) : null}
            {this.state.elektabilitas == 0 ? (
              <View style={styles.action1}>
                <View style={styles.lefticon}>
                  <Text
                    style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                    Type Pemilih{' '}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    paddingLeft: 5,
                    backgroundColor: '#FFFCF2',
                    height: 40,
                    width: '45%',
                  }}>
                  <Text
                    style={{fontSize: 16, fontFamily: 'TitilliumWeb-Regular'}}>
                    {this.state.selectType[this.state.type]}
                  </Text>
                </View>
              </View>
            ) : null}
            {this.state.elektabilitas == 2 ? (
              <View style={styles.action1}>
                <View style={styles.lefticon}>
                  <Text
                    style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
                    Nama Calon Lain{' '}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    paddingLeft: 5,
                    backgroundColor: '#FFFCF2',
                    height: 40,
                    width: '45%',
                  }}>
                  <Text
                    style={{fontSize: 16, fontFamily: 'TitilliumWeb-Regular'}}>
                    {this.state.calonlain}
                  </Text>
                </View>
              </View>
            ) : (
              <View />
            )}
            {/* <View style={styles.action1}>
                        <View style={styles.lefticon}>
                            <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>Status Validasi </Text>
                            </View>
                            <View style={{justifyContent: 'center', paddingLeft: 5, backgroundColor: "#FFFCF2", height: 40, width: "45%"}}>
                                <Text style={{fontSize: 16, fontFamily: 'TitilliumWeb-Regular'}}>{this.state.selectValid[this.state.isvalid]}</Text>
                            </View>
                    </View> */}
          </View>
        </ScrollView>
        {/* <View style={{marginTop: 20, width: "95%", flexDirection: 'row', justifyContent: 'center'}}>        
                    { this.state.loader ? 
                        <UIActivityIndicator color='#FFFFFF' zIndex={999999} size={20} style={{left: 30, bottom: 10}} /> 
                        : <View style={{ marginLeft: 35}}/>
                    }                
                        <TouchableOpacity
                            onPress={() => this.state.isvalid == 0 ? this.Validated(this.state.namapenduduk) : console.log("Data Sudah Divalidasi")}                                
                                disabled = {
                                    this.state.isvalid == 0 ? false : true
                                }
                                style={{                                    
                                    height: 80,                                
                                    width: '90%',                                
                                    marginTop: 10, 
                                    alignSelf: "center"
                                }}>
                            { this.state.isvalid  == 0 ?
                            <BtnStandard name="Validasi" />
                            :
                            <BtnDisabled name="Validasi" />
                            }
                        </TouchableOpacity>                        
                    </View>       
                    <FlashMessage position="bottom" />      */}
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
    height: Dimensions.get('window').height - 360,
    paddingLeft: 20,
    paddingTop: 10,
    borderRadius: 25.5,
  },
  lefticon: {
    height: 40,
    //backgroundColor: '#FFFFFF',
    marginBottom: 0,
    color: 'black',
    paddingHorizontal: 10,
    borderBottomWidth: 0,
    marginBottom: 5,
    //alignContent: "center",
    borderColor: '#828282',
    // alignSelf: "center",
    // alignItems: "center",
    justifyContent: 'center',
    width: '50%',
    backgroundColor: '#f7f5f5',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  lefticonmultiline: {
    height: 45,
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
    color: 'black',
    //paddingHorizontal: 10,
    //borderBottomWidth: 1,
    //alignContent: "center",
    borderColor: '#828282',
    // alignSelf: "center",
    // alignItems: "center",

    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    textAlignVertical: 'top',
  },
  usernameInput: {
    //flex: 1,
    height: 40,
    width: '50%',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
    justifyContent: 'center',
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
    flexDirection: 'row',
    borderRadius: 12,
  },
  actionJawaban: {
    //flexDirection: 'row',
    paddingLeft: 10,
    borderRadius: 12,
  },
});
