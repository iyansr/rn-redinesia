import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';
import BtnStandard from '../component/BtnStandard';
import BtnDisabled from '../component/BtnDisabled';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import DeviceInfo from 'react-native-device-info';
import SafeAreaView from 'react-native-safe-area-view';
import axios from 'react-native-axios';
import {Icon} from 'react-native-elements';
import {API_URL} from '@env';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker';
//import { nikParser } from 'nik-parser'
import CheckBox from '@react-native-community/checkbox';
import {UIActivityIndicator} from 'react-native-indicators';
import Modal from 'react-native-modal';

class AppLanding extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      kodename: '',
      pekerjaan: '',
      lokasikerja: '',
      email: '',
      referral: '',
      handphone: '',
      nik: '',
      tmptlahir: '',
      selectedGender: 'Jenis Kelamin',
      selectGender: ['Pria', 'Wanita'],
      selectedValueGender: '-',
      datebirth: new Date('1940-01-01'),
      open: false,
      tanggalLahir: '',
      selectProvince: [],
      selectedProvince: '',
      selectedValueProv: '',
      selectCity: [],
      selectedCity: '',
      selectedValueCity: '',
      selectDistrict: [],
      selectedDistrict: '',
      selectedValueDistrict: '',
      selectSubDistrict: [],
      selectedSubDistrict: '',
      selectedValueSubDistrict: '',
      alamat: '',
      isSelected: false,
      account: '',
      idaccount: 0,
      photoaccount: '',
      loader: false,
      isModalVisible: false,
      isRefModalVisible: false,
    };
  }

  componentDidMount() {
    //console.log("=====SLEBEWW====="+API_URL);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.ProfilesDataWhenGoogle();
    });
  }

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  ProfilesDataWhenGoogle = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_google_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("==========ooooo========"+JSON.stringify(datastring["user"]["photo"]));
        this.setState({
          session_id: datastring['idToken'],
          name: datastring['user']['name'],
          email: datastring['user']['email'],
          account: 'Google',
          idaccount: datastring['user']['id'],
          photoaccount: datastring['user']['photo'],
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

  setReferall = ref => {
    this.setState({referral: ref});
    this.GetDataProvince(ref);
  };
  setName = ref => {
    this.setState({name: ref});
  };
  setPhone = ref => {
    this.setState({handphone: ref});
    //console.log("--->V", this.validasiNomorSeluler(ref));
    if (this.validasiNomorSeluler(ref) == true) {
      this.setState({
        errorHP: false,
      });
    } else {
      this.setState({
        errorHP: true,
      });
    }
  };

  validasiNomorSeluler = phone => {
    phone = this.normalisasiNomorHP(phone);
    return this.tesNomorHP(phone) && !!this.deteksiOperatorSeluler(phone);
  };

  normalisasiNomorHP = phone => {
    phone = String(phone).trim();
    if (phone.startsWith('+62')) {
      phone = '0' + phone.slice(3);
    } else if (phone.startsWith('62')) {
      phone = '0' + phone.slice(2);
    }
    return phone.replace(/[- .]/g, '');
  };

  tesNomorHP = phone => {
    if (!phone || !/^08[1-9][0-9]{7,10}$/.test(phone)) {
      return false;
    }
    return true;
  };

  deteksiOperatorSeluler = phone => {
    const prefix = phone.slice(0, 4);
    if (['0831', '0832', '0833', '0838'].includes(prefix)) return 'axis';
    if (['0895', '0896', '0897', '0898', '0899'].includes(prefix))
      return 'three';
    if (['0817', '0818', '0819', '0859', '0878', '0877'].includes(prefix))
      return 'xl';
    if (
      ['0814', '0815', '0816', '0855', '0856', '0857', '0858'].includes(prefix)
    )
      return 'indosat';
    if (
      [
        '0812',
        '0813',
        '0852',
        '0853',
        '0821',
        '0823',
        '0822',
        '0851',
        '0811',
      ].includes(prefix)
    )
      return 'telkomsel';
    if (
      [
        '0881',
        '0882',
        '0883',
        '0884',
        '0885',
        '0886',
        '0887',
        '0888',
        '0889',
      ].includes(prefix)
    )
      return 'smartfren';
    return null;
  };

  setNik = ref => {
    this.setState({nik: ref});
    //this.cekNik(ref)
  };
  cekNik = cRef => {
    //const nik =  nikParser(cRef)
    //console.log(nik.province());
    if (nik.isValid() == false) {
      this.setState({
        errorNIK: false,
      });
    } else {
      this.setState({
        errorNIK: false,
      });
    }
  };
  setTempat = ref => {
    this.setState({tmptlahir: ref});
  };

  setEmail = ref => {
    this.setState({email: ref});
    this.validateEmail(ref);
  };

  validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      //console.log("Email is Not Correct");
      this.setState({errorEmail: true});
      return false;
    } else {
      this.setState({errorEmail: false});
      //console.log("Email is Correct");
    }
  };

  setDate = ref => {
    const datatgl = JSON.stringify(ref);

    //console.log("=======",ref);
    this.setState({datebirth: ref, tanggalLahir: ref});
  };

  setAlamat = ref => {
    this.setState({alamat: ref});
  };

  setOpen = ref => {
    this.setState({open: ref});
  };

  formatDate(input) {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + '/' + month + '/' + year;
  }

  setSelection = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    });
  };

  GetDataProvince = ref => {
    this.setState({
      selectProvince: [],
      selectedProvince: '',
      selectedValueProv: '',
      selectCity: [],
      selectedCity: '',
      selectedValueCity: '',
      selectDistrict: [],
      selectedDistrict: '',
      selectedValueDistrict: '',
      selectSubDistrict: [],
      selectedSubDistrict: '',
      selectedValueSubDistrict: '',
    });

    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/provinceref/` + ref,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->PROVINCE"+JSON.stringify(response.data.data));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          self.setState({
            selectProvince: [],
          });
          response.data.data.map((items, index) => {
            //index = index+1;
            //console.log(">>>>>>ddd",items.prov_id);
            //if(index>0){
            //self.state.selectProvince[items['prov_id']] =  items['prov_name'];
            self.setState({
              selectedValueProv: items.prov_id,
              selectedProvince: items.prov_name,
              selectedDapilType: items.dapil_type,
              selectDistrict: [],
              selectedDistrict: '',
              selectedValueDistrict: '',
            });
            if (items.dapil_type !== 2) {
              self.GetDataCity(items.prov_id, ref);
            } else {
              self.GetDataCityPusat(items.prov_id, ref);
            }
            //}
          });

          // self.setState({
          //     selectProvince: [...self.state.selectProvince.filter(function (e) {return e != null;})]
          // });

          //console.log("+++++++ssss"+JSON.stringify(self.state.selectProvince));
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

  GetDataCity = (id, ref) => {
    //console.log("---idcity", id);
    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/cityref/` + id + `/` + ref,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->CITY"+JSON.stringify(response.data.data));
        if (response.data.success === true) {
          response.data.data.map((items, index) => {
            self.setState({
              selectedValueCity: items.city_id,
              selectedCity: items.city_name,
              selectDistrict: [],
              selectedDistrict: '',
              selectedValueDistrict: '',
            });
            self.GetDataDistrict(items.city_id, ref);
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

  // DAPIL TYPE GET CITY
  GetDataCityPusat = (id, ref) => {
    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/cityrefpusat/` + id + `/` + ref,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->CITY"+JSON.stringify(response.data.data));
        if (response.data.success === true) {
          response.data.data.map((items, index) => {
            index = items['city_id'];
            self.state.selectCity[index] = index + ' - ' + items['city_name'];
          });
          self.setState({
            selectCity: [
              ...self.state.selectCity.filter(function (e) {
                return e != null;
              }),
            ],
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
  // END OF DAPIL TYPE GET CITY

  GetDataDistrict = (id, ref) => {
    //console.log("---idcity", id);
    const self = this;
    self.setState({
      loadDis: true,
    });
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/districtref/` + id + `/` + ref,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->DISTRICT"+JSON.stringify(response.data.data));
        if (response.data.success === true) {
          response.data.data.map((items, index) => {
            index = items['dis_id'];
            self.state.selectDistrict[index] =
              index + ' - ' + items['dis_name'];
          });
          self.setState({
            selectDistrict: [
              ...self.state.selectDistrict.filter(function (e) {
                return e != null;
              }),
            ],
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
            loadDis: false,
          });
        }
      })
      .finally(response => {
        self.setState({
          loadDis: false,
        });
      });
  };

  GetDataSubDistrict = id => {
    //console.log("---idcity", id);
    const self = this;
    self.setState({
      loadSubDis: true,
    });
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/subdistrict/` + id,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->DISTRICT"+JSON.stringify(response.data.data));
        if (response.data.success === true) {
          response.data.data.map((items, index) => {
            index = items['subdis_id'];
            self.state.selectSubDistrict[index] =
              index + ' - ' + items['subdis_name'];
          });
          self.setState({
            selectSubDistrict: [
              ...self.state.selectSubDistrict.filter(function (e) {
                return e != null;
              }),
            ],
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
            loadSubDis: false,
          });
        }
      })
      .finally(response => {
        self.setState({
          loadSubDis: false,
        });
      });
  };

  lengkaptnc = () => {
    return alert(
      'Dengan Kesadaran dan Penuh Kesadaran, bersama ini saya mengajukan untuk didaftarkan sebagai anggota Relawan. \r\n Saya menyatakan bahwa semua data yang saya Kirimkan ini adalah benar sebagai bukti pendaftaran dan pendataan yang sah serta dapat digunakan sebagaimana mestinya. \r\n Apabila dikemudian hari saya melanggar aturan keanggotaan, maka saya bersedia diberhentikan dari keanggotaan sesuai dengan ketentuan dan peraturan yang berlaku.',
    );
  };

  registrationProcess = () => {
    //console.log("valuueeehhh",value);
    const self = this;
    self.setState({
      loader: true,
    });
    const storeData = async value => {
      try {
        await AsyncStorage.setItem('@storage_regis_Key', JSON.stringify(value));
      } catch (e) {
        // saving error
      }
    };

    const {navigation} = this.props;
    //var formData = new FormData();
    var formData = new URLSearchParams();
    formData.append('nama', self.state.name);
    formData.append('handphone', self.state.handphone);
    formData.append('type', 3);
    formData.append('rkandidat', '0');
    formData.append('nik', self.state.nik);
    formData.append('tempatlahir', self.state.tmptlahir);
    formData.append(
      'birthdate',
      new Date(self.state.datebirth).toISOString().slice(0, 10),
    );
    formData.append('gender', self.state.selectedValueGender);
    formData.append('alamat', self.state.alamat);
    formData.append('prov', self.state.selectedValueProv);
    if (self.state.selectedDapilType === 2) {
      formData.append('kota', self.state.selectedValueCity.split(' - ')[0]);
    } else {
      formData.append('kota', self.state.selectedValueCity);
    }
    formData.append('kec', self.state.selectedValueDistrict.split(' - ')[0]);
    formData.append('kel', self.state.selectedValueSubDistrict.split(' - ')[0]);
    formData.append('email', '');
    formData.append('referal', self.state.referral);
    formData.append('account', self.state.account);
    formData.append('idaccount', '');
    formData.append('status', 0);
    formData.append('owner', self.state.referral);
    formData.append('photoaccount', self.state.photoaccount);

    //console.log((new Date(tgllahir)).getUTCFullYear() +"-"+(new Date(tgllahir)).getUTCMonth() + 1+"-"+ (new Date(tgllahir)).getDate());
    //console.log(JSON.stringify(formData));
    var config = {
      method: 'post',
      url: API_URL + `/user/add`,
      //url: `http://192.168.18.6:3001/user/login`,

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },
      data: formData,
    };

    axios(config)
      .then(function (response) {
        var profile = response.data.data;
        //console.log("---->", JSON.stringify(response.data.data))
        if (response.data.success === true) {
          //alert("sukses");
          storeData(profile);
          navigation.navigate('otp');
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
          console.log('------ERORlaporan' + error);
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

  setVisibleModal = vdata => {
    this.setState({
      isModalVisible: !vdata,
    });
  };

  setVisibleRefModal = vdata => {
    this.setState({
      isRefModalVisible: !vdata,
    });
  };

  render() {
    const {navigation} = this.props;
    let h = Dimensions.get('window').height;
    let w = Dimensions.get('window').width;

    const phoneRegExp =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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
                  name="qrcode"
                  type="font-awesome"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Kode Referal Relawan Utama"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                name="kodereferral"
                value={this.state.referral}
                onChangeText={text => this.setReferall(text)}
              />
              {this.state.kodename !== '' ? (
                <Text
                  style={{marginTop: 10, fontFamily: 'TitilliumWeb-Regular'}}>
                  {this.state.kodename}
                </Text>
              ) : (
                <View />
              )}
              {
                // errors.kodereferral &&
                //     <Text style={styles.error}>{errors.kodereferral}</Text>
              }
            </View>

            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="user"
                  type="font-awesome"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Nama Lengkap"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.name}
                onChangeText={text => this.setName(text)}
              />
              {
                // errors.named &&
                //     <Text style={styles.error}>{errors.named}</Text>
              }
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="whatsapp"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="No.Handphone Whatsapp"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                name="phoneNumber"
                keyboardType="phone-pad"
                style={styles.usernameInput}
                onChangeText={text => this.setPhone(text)}
                value={this.state.handphone}
              />
              {this.state.errorHP && (
                <Text style={styles.error}>Masih Salah</Text>
              )}
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="credit-card"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="NIK"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="number-pad"
                //onBlur={(text) => this.cekNik(text)}
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.nik}
                onChangeText={text => this.setNik(text)}
              />
              {this.state.errorNIK && (
                <Text style={styles.error}>KTP Salah</Text>
              )}
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="map"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Tempat Lahir"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.tmptlahir}
                onChangeText={text => this.setTempat(text)}
              />
              {
                // errors.tmptlahir &&
                //     <Text style={styles.error}>{errors.tmptlahir}</Text>
              }
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="birthday-cake"
                  type="font-awesome"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <View style={styles.usernameInput}>
                <Text style={{marginTop: 10}}>
                  {this.formatDate(
                    this.state.datebirth.toISOString().split('T')[0],
                  )}
                </Text>
              </View>
              {
                // this.formatDate((this.state.datebirth).toISOString().split('T')[0])  == '01/01/40'
                //         ?
                //     <View style={{flexDirection: 'row'}}>
                //     <Text style={styles.error}>Wajib Diisi</Text>
                //     <TouchableOpacity style={styles.eyeInput} onPress={() => this.setOpen(true)}>
                //         <Icon name="calendar" type="font-awesome" color="#f59e0b" size={15}/>
                //     </TouchableOpacity>
                //     </View>
                //     :
                <View style={{flexDirection: 'row'}}>
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
              }

              <DatePicker
                modal
                open={this.state.open}
                date={this.state.datebirth}
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
                title="Pilih Tanggal Lahir"
                confirmText="Pilih"
                cancelText="Batal"
                mode="date"
                maximumDate={new Date('2009-01-01')}
                minimumDate={new Date('1950-01-01')}
                androidVariant="iosClone"
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="venus-mars"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <SelectDropdown
                data={this.state.selectGender}
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
                  this.state.selectedGender != ''
                    ? this.state.selectedGender
                    : 'Jenis Kelamin'
                }
                dropdownStyle={{height: 100}}
                rowTextStyle={{textAlign: 'left'}}
                onSelect={(selectedItem, index) => {
                  //console.log(selectedItem, index)
                  this.setState({
                    selectedGender: selectedItem,
                    selectedValueGender: index,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  //console.log("--> after select"+selectedItem, index);
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                  //return this.state.selectedKategori
                }}
                selectedRowStyle={{backgroundColor: '#f5e0d7'}}
                selectedRowTextStyle={{justifyContent: 'space-between'}}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  //console.log("----9999"+item);
                  return item;
                }}
                //defaultValue={values.selectgdr}
                defaultValue={this.state.selectedGender}
              />
              {
                // this.state.selectedValueGender == '-' ?
                //     <Text style={styles.errorselect}>{errors.selectgdr}</Text>
                //     : <View/>
              }
            </View>
            {/* <View style={styles.action1}>
                        <View style={styles.lefticon}>
                            <Icon name='map' type='font-awesome-5' color='#f59e0b' size={15} />
                        </View>
                            <SelectDropdown
                                data={this.state.selectProvince}
                                buttonStyle={{width: '88%',  
                                    height: 40, borderBottomWidth: 1,
                                    borderColor: '#828282',paddingHorizontal: 0, backgroundColor: '#FFFFFF'}}
                                buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}   
                                defaultButtonText={this.state.selectedProvince != "" ? this.state.selectedProvince : "Pilih Provinsi"}     
                                dropdownStyle={{height: 120, fontSize: 12}}
                                disabled={this.state.selectProvince.length > 0 ? false : true}
                                rowTextStyle={{textAlign: 'left'}}
                                onSelect={(selectedItem, index) => {                                    
                                    //console.log("====--====",selectedItem, index)
                                    this.setState({
                                        selectCity: [],
                                        selectedCity: "",
                                        selectedValueCity: "",
                                        selectDistrict: [],
                                        selectedDistrict: "",
                                        selectedValueDistrict: ""
                                    });
                                    
                                    this.GetDataCity(index, this.state.referral);
                                    this.setState({
                                        selectedProvince: selectedItem,
                                        selectedValueProv: index
                                    })
                                    
                                }}
                                //onBlur={handleBlur('selectprov')}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    //console.log("--> after select dr pro"+this.state.selectedValueCity);
                                    // text represented after item is selected
                                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                                    return selectedItem
                                    //return this.state.selectedKategori
                                }}
                                selectedRowStyle={{backgroundColor: '#f5e0d7'}}
                                selectedRowTextStyle={{fontFamily: 'TitilliumWeb-Regular'}}
                                rowTextForSelection={(item, index) => {
                                    // text represented for each item in dropdown
                                    // if data array is an array of objects then return item.property to represent item in dropdown
                                    //console.log("----9999"+item);
                                    return item
                                }}
                                // search={true}
                                // //onSubmit={() => console.log("tesst")}
                                // searchInputStyle={styles.dropdown1searchInputStyleStyle}
                                // searchPlaceHolder={'Cari'}
                                // searchPlaceHolderColor={'darkgrey'}
                                // renderSearchInputLeftIcon={() => {
                                //     return <Icon type='font-awesome-5' name={'search'} color={'#444'} size={18} />;
                                // }}
                                //defaultValue={values.selectprov}
                                defaultValue={this.state.selectedProvince}
                            />
                            
                            {
                            // this.state.selectedValueProv == 0 ?
                            //     <Text style={styles.errorselect}>{errors.selectprov}</Text>
                            //     : <View/>
                            }
                    </View> */}
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="map"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <SelectDropdown
                data={this.state.selectCity}
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
                  this.state.selectedCity != ''
                    ? this.state.selectedCity
                    : 'Pilih Kota/Kab'
                }
                dropdownStyle={{height: 150, fontSize: 12}}
                disabled={this.state.selectCity.length > 0 ? false : true}
                rowTextStyle={{textAlign: 'left'}}
                onSelect={(selectedItem, index) => {
                  this.GetDataDistrict(
                    selectedItem.split(' - ')[0],
                    this.state.referral,
                  );
                  //console.log("====--====",selectedItem, index)
                  this.setState({
                    selectDistrict: [],
                    selectedDistrict: '',
                    selectedValueDistrict: '',
                  });
                  this.setState({
                    selectedCity: selectedItem,
                    selectedValueCity: selectedItem,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  //console.log("--> after select"+selectedItem, index);
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                  //return this.state.selectedKategori
                }}
                selectedRowStyle={{backgroundColor: '#f5e0d7'}}
                selectedRowTextStyle={{fontFamily: 'TitilliumWeb-Regular'}}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  //console.log("----9999"+item);
                  return item;
                }}
                // search={true}
                // searchInputStyle={styles.dropdown1searchInputStyleStyle}
                // searchPlaceHolder={'Cari'}
                // searchPlaceHolderColor={'darkgrey'}
                // renderSearchInputLeftIcon={() => {
                //     return <Icon type='font-awesome-5' name={'search'} color={'#444'} size={18} />;
                // }}
                defaultValue={this.state.selectedCity}
              />
              {
                // this.state.selectedValueCity == 0 ?
                //     <Text style={styles.errorselect}>{errors.selectci}</Text>
                // : <View/>
              }
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                {this.state.loadDis ? (
                  <UIActivityIndicator
                    color="#000000"
                    zIndex={999999}
                    size={19}
                  />
                ) : (
                  <Icon
                    name="map"
                    type="font-awesome-5"
                    color="#f59e0b"
                    size={15}
                  />
                )}
              </View>
              <SelectDropdown
                data={this.state.selectDistrict}
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
                  this.state.selectedDistrict != ''
                    ? this.state.selectedDistrict
                    : 'Pilih Kecamatan'
                }
                dropdownStyle={{height: 180, fontSize: 12}}
                disabled={this.state.selectDistrict.length > 0 ? false : true}
                rowTextStyle={{textAlign: 'left'}}
                onSelect={(selectedItem, index) => {
                  //console.log("====--====",selectedItem, index)
                  this.setState({
                    selectSubDistrict: [],
                    selectedSubDistrict: '',
                    selectedValueSubDistrict: '',
                    selectedDistrict: selectedItem,
                    selectedValueDistrict: selectedItem,
                  });
                  this.GetDataSubDistrict(selectedItem.split(' - ')[0]);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  //console.log("--> after select"+selectedItem, index);
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                  //return this.state.selectedKategori
                }}
                selectedRowStyle={{backgroundColor: '#f5e0d7'}}
                selectedRowTextStyle={{fontFamily: 'TitilliumWeb-Regular'}}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  //console.log("----9999"+item);
                  return item;
                }}
                // search={true}
                // searchInputStyle={styles.dropdown1searchInputStyleStyle}
                // searchPlaceHolder={'Cari'}
                // searchPlaceHolderColor={'darkgrey'}
                // renderSearchInputLeftIcon={() => {
                //     return <Icon type='font-awesome-5' name={'search'} color={'#444'} size={18} />;
                // }}
                //defaultValue={values.selectdis}
                defaultValue={this.state.selectedDistrict}
              />
              {
                // this.state.selectedValueDistrict == 0 ?
                //     <Text style={styles.errorselect}>{errors.selectdis}</Text>
                // : <View/>
              }
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                {this.state.loadSubDis ? (
                  <UIActivityIndicator
                    color="#000000"
                    zIndex={999999}
                    size={19}
                  />
                ) : (
                  <Icon
                    name="map"
                    type="font-awesome-5"
                    color="#f59e0b"
                    size={15}
                  />
                )}
              </View>
              <SelectDropdown
                data={this.state.selectSubDistrict}
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
                  this.state.selectedSubDistrict != ''
                    ? this.state.selectedSubDistrict
                    : 'Pilih Kelurahan'
                }
                dropdownStyle={{height: 200, fontSize: 12}}
                disabled={
                  this.state.selectSubDistrict.length > 0 ? false : true
                }
                rowTextStyle={{textAlign: 'left'}}
                onSelect={(selectedItem, index) => {
                  //console.log("====--====",selectedItem, index)
                  this.setState({
                    selectedSubDistrict: selectedItem,
                    selectedValueSubDistrict: selectedItem,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  //console.log("--> after select"+selectedItem, index);
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                  //return this.state.selectedKategori
                }}
                selectedRowStyle={{backgroundColor: '#f5e0d7'}}
                selectedRowTextStyle={{fontFamily: 'TitilliumWeb-Regular'}}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  //console.log("----9999"+item);
                  return item;
                }}
                search={true}
                searchInputStyle={styles.dropdown1searchInputStyleStyle}
                searchPlaceHolder={'Cari'}
                searchPlaceHolderColor={'darkgrey'}
                renderSearchInputLeftIcon={() => {
                  return (
                    <Icon
                      type="font-awesome-5"
                      name={'search'}
                      color={'#444'}
                      size={18}
                    />
                  );
                }}
                //defaultValue={values.selectdis}
                defaultValue={this.state.selectedSubDistrict}
              />
              {
                // this.state.selectedValueDistrict == 0 ?
                //     <Text style={styles.errorselect}>{errors.selectdis}</Text>
                // : <View/>
              }
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="home"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Alamat"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.alamat}
                onChangeText={text => this.setAlamat(text)}
              />
              {
                // errors.alamat &&
                //     <Text style={styles.error}>{errors.alamat}</Text>
              }
            </View>
            {/* <View style={styles.action1}>
                        <View style={styles.lefticon}>
                            <Icon name='at' type='font-awesome-5' color='#f59e0b' size={15} />
                        </View>
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#707070"
                                returnKeyType="next"
                                autoCapitalize="none"
                                keyboardType='email-address'
                                autoCorrect={false}
                                style={styles.usernameInput}
                                value={this.state.email}
                                onChangeText={(text) => this.setEmail(text)}                                
                            />
                            {
                            this.state.errorEmail &&
                                 <Text style={styles.error}>Email Salah</Text>
                            }
                    </View>     */}
          </View>
        </ScrollView>
        <View style={styles.action3}>
          <View style={styles.leftcheck}>
            <CheckBox
              value={this.state.isSelected}
              //onValueChange={this.setSelection()}
              onValueChange={newValue => this.setSelection(newValue)}
            />
          </View>
          <View style={{width: '70%'}}>
            <Text style={{marginTop: 5}}>
              Saya Setuju Dengan Syarat Dan Ketentuan yang berlaku.{' '}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                onPress={() => this.setVisibleModal(this.state.isModalVisible)}
                style={{
                  color: 'red',
                  fontFamily: 'TitilliumWeb-Regular',
                  fontSize: 15,
                }}>
                Selengkapnya
              </Text>
              <Text
                style={{
                  color: 'red',
                  fontFamily: 'TitilliumWeb-Regular',
                  fontSize: 15,
                }}>
                {' '}
                |{' '}
              </Text>
              <Text
                onPress={() =>
                  this.setVisibleRefModal(this.state.isRefModalVisible)
                }
                style={{
                  color: 'red',
                  fontFamily: 'TitilliumWeb-Regular',
                  fontSize: 15,
                }}>
                Apa itu Kode Referral?
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.action2}>
          {this.state.loader ? (
            <UIActivityIndicator
              color="#000000"
              zIndex={999999}
              size={20}
              style={{left: 30, bottom: 10}}
            />
          ) : (
            <View style={{marginLeft: 35}} />
          )}
          {this.state.name === '' ||
          this.state.referral === '' ||
          this.state.handphone === '' ||
          this.state.nik === '' ||
          this.state.tmptlahir === '' ||
          this.formatDate(this.state.datebirth.toISOString().split('T')[0]) ==
            '01/01/40' ||
          this.state.selectedValueGender == '-' ||
          this.state.selectedValueProv == 0 ||
          this.state.selectedValueCity == 0 ||
          this.state.selectedValueDistrict == 0 ||
          this.state.selectedValueSubDistrict == 0 ||
          this.state.errorEmail == true ||
          this.state.alamat == '' ||
          this.state.errorHP == true ||
          this.state.isSelected == false ? (
            <TouchableOpacity
              onPress={() => console.log('Belum Lengkap')}
              disabled={true}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
              }}>
              <BtnDisabled name="Daftar" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.registrationProcess()}
              disabled={false}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
              }}>
              <BtnStandard name="Daftar" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={{marginTop: -20, alignItems: 'center'}}
          onPress={() => navigation.navigate('login')}>
          <Text style={{color: '#000000', fontFamily: 'TitilliumWeb-Regular'}}>
            {' '}
            Batal Daftar
          </Text>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.isModalVisible}
          onBackButtonPress={() =>
            this.setVisibleModal(this.state.isModalVisible)
          }>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.nameText}>Informasi Penting</Text>
              <Text style={styles.followText}></Text>
            </View>
            <View
              style={{
                height: 250,
                backgroundColor: 'white',
                paddingVertical: 10,
                padding: 10,
              }}>
              <Text
                style={{fontFamily: 'TitilliumWeb-Regular', marginBottom: 5}}>
                1. Dengan Penuh Kesadaran, bersama ini saya mengajukan untuk
                didaftarkan sebagai anggota Relawan.{' '}
              </Text>
              <Text
                style={{fontFamily: 'TitilliumWeb-Regular', marginBottom: 5}}>
                2. Saya menyatakan bahwa semua data yang saya Kirimkan ini
                adalah benar sebagai bukti pendaftaran dan pendataan yang sah
                serta dapat digunakan sebagaimana mestinya.
              </Text>
              <Text
                style={{fontFamily: 'TitilliumWeb-Regular', marginBottom: 5}}>
                3. Apabila dikemudian hari saya melanggar aturan keanggotaan,
                maka saya bersedia diberhentikan dari keanggotaan sesuai dengan
                ketentuan dan peraturan yang berlaku.
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
                  OK Saya Mengerti
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.isRefModalVisible}
          onBackButtonPress={() =>
            this.setVisibleRefModal(this.state.isRefModalVisible)
          }>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.nameText}>Mengenai Kode Referral</Text>
              <Text style={styles.followText}></Text>
            </View>
            <View
              style={{
                height: 250,
                backgroundColor: 'white',
                paddingVertical: 10,
                padding: 10,
              }}>
              <Text
                style={{fontFamily: 'TitilliumWeb-Regular', marginBottom: 5}}>
                1. Kode Referral Merupakan Kode Yang Dimiliki Oleh Setiap
                Relawan{' '}
              </Text>
              <Text
                style={{fontFamily: 'TitilliumWeb-Regular', marginBottom: 5}}>
                2. Pastikan anda memiliki Kode Referral untuk mendaftar menjadi
                relawan
              </Text>
              <Text
                style={{fontFamily: 'TitilliumWeb-Regular', marginBottom: 5}}>
                3. Silahkan Tanyakan Kepada Relawan Pengguna Redinesia Apabila
                Anda Ingin Mengetahui Kode Referral
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
                onPress={() =>
                  this.setVisibleRefModal(this.state.isRefModalVisible)
                }>
                <Text
                  style={{
                    alignSelf: 'center',
                    top: 4,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  OK Saya Mengerti
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
  formcontainer: {
    //position: 'absolute',
    marginTop: 7,
    height: Dimensions.get('window').height - 110,
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
    marginTop: 0,
    marginBottom: 10,
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
