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
import CheckBox from '@react-native-community/checkbox';
import {Icon} from 'react-native-elements';
import {Buffer} from 'buffer';
import {array} from 'yup';
import BtnDisabled from '../component/BtnDisabled';
import database, {firebase} from '@react-native-firebase/database';
import analytics from '@react-native-firebase/analytics';

export default class InputSurveyScreen extends Component {
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
      nama: '',
      umur: 0,
      identitas: '',
      pertanyaan: [],
      selectKenal: ['Ya', 'Tidak'],
      selectedKenal: '',
      selectedValueKenal: '',
      selectMemilih: ['Memilih Calon', 'Golput', 'Memilih calon lain'],
      selectedMemilih: '',
      selectedValueMemilih: -1,
      selectType: ['Ideologi/Emosional', 'Rasional', 'Transaksional'],
      selectedType: '',
      selectedValueType: -1,
      selectLike: ['Suka', 'Tidak Suka'],
      selectedLike: '',
      selectedValueLike: -1,
      loader: false,
      selectUser: [],
      selectedUser: '',
      selectedValueUser: '',
      loader: false,
      idsurveyuser: '',
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
      loadDis: false,
      selectPeriode: [],
      selectedPeriode: '',
      selectedValuePeriode: '',
      loadPeriode: false,
      isValid: true,
      userid_ref: 0,
      poinValidated: 0,
      nama: '',
      userhp: '',
      totalUser: 0,
      selectedDistrictfromimage: '',
    };
  }

  componentDidMount() {
    //const {prevscreen} = this.props.route.params;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {idperiode} = this.props.route.params;
      this.ProfilesData();
      //this.GetDataPertanyaan();
      //this.ImageData();
      this.getLocation();
      this.DataFirebasePoint();
      this.setState({
        periode_id: idperiode,
      });
      console.log('PERRRINPUT', idperiode);
    });
  }

  ProfilesData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        console.log('==========ccccc========00000' + datastring[0].username);
        this.setState({
          token: datastring[0].token,
          username: datastring[0].username,
          usernama: datastring[0].usernama,
          nama_kandidat: datastring[0].k_name,
          kandidat_id: datastring[0].k_id,
          user_id: datastring[0].user_id,
          referral: datastring[0].user_referal,
        });
        //if(this.state.selectedValueDistrict == ""){
        this.GetDataProvince(datastring[0].username);
        this.ImageData();
        //}
        this.GetDataPeriode();
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  DataFirebasePoint = async () => {
    const reference = firebase
      .app()
      .database(
        'https://timsesapps-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('/point');

    const onValueChange = await database()
      .ref('/point')
      .on('value', snapshot => {
        //console.log('User data: ', JSON.stringify(snapshot.val()));

        let dataRF = snapshot.val();
        //console.log("---<><><><><>RRRRRR",dataRF.validated);
        this.setState({
          poinValidated: dataRF.validated,
        });
      });

    return () => database().ref(`/point`).off('value', onValueChange);
  };

  GetDataProvince = ref => {
    this.setState({
      selectProvince: [],
    });

    //   console.log("---->PROVINCESSSSS"+JSON.stringify(ref));

    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/provinceref/` + ref,
      data: formData,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        //console.log("---->PROVINCESSSSS"+JSON.stringify(ref));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          self.setState({
            selectProvince: [],
          });
          response.data.data.map((items, index) => {
            //console.log("87587587",response.data.data);
            self.setState({
              selectedValueProv: items.prov_id,
              selectedProvince: items.prov_name,
              //selectDistrict: [],
              //selectedDistrict: "",
              //selectedValueDistrict: ""
            });

            if (items.dapil_type !== 2) {
              self.GetDataCity(items.prov_id, ref);
            } else {
              self.GetDataCityPusat(items.prov_id, ref);
            }
            //self.GetDataCity(items.prov_id, ref);
            //}
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
            //loader: false,
          });
        }
      })
      .finally(response => {
        this.setState({
          //loader: false,
        });
      });
  };

  GetDataCity = (id, ref) => {
    console.log('---idcity', ref);
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
        console.log('---->CITY' + JSON.stringify(response.data.data));
        if (response.data.success === true) {
          response.data.data.map((items, index) => {
            self.setState({
              selectedValueCity: items.city_id,
              selectedCity: items.city_name,
              //selectDistrict: [],
              //selectedDistrict: "",
              //selectedValueDistrict: ""
            });
            if (this.state.selectedDistrictfromimage == '') {
              self.GetDataDistrict(items.city_id, ref);
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

  GetDataCityPusat = (id, ref) => {
    console.log('---idcity', ref);

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

  GetDataDistrict = (id, ref) => {
    //console.log("---idcity", id);
    const self = this;
    self.setState({
      loadDis: true,
      idkelurahan: '',
    });
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      //url: API_URL+`/district/`+id,
      url: API_URL + `/districtref/` + id + `/` + ref,
      data: formData,
      headers: {
        Authorization: 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->DISTRICT"+JSON.stringify(response.data.data));
        var allkecamatan = response.data.data;
        if (response.data.success === true) {
          response.data.data.map((items, index) => {
            //console.log(">>>>>>city",items['city_name'], items["city_id"]);
            //console.log(">>>>>>cityddd",index+"-"+items["city_id"]+"-"+items["city_name"]);
            //if(index == items["city_id"]){
            index = items['dis_id'];
            //console.log(">>>>>>districtddd",index+"-"+items["dis_id"]+"-"+items["dis_name"]);
            self.state.selectDistrict[index] =
              index + ' - ' + items['dis_name'];
            //}
          });
          self.setState({
            selectDistrict: [
              ...self.state.selectDistrict.filter(function (e) {
                return e != null;
              }),
            ],
            allDataKecamatan: allkecamatan,
          });
          //console.log("+++++++CITYH"+JSON.stringify(self.state.selectCity.filter(function (e) {return e != null;})));
          //console.log("+++++++ssssbbb"+JSON.stringify(self.state.selectDistrict));
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
        Authorization: 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->DISTRICT"+JSON.stringify(response.data.data));
        var allkelurahan = response.data.data;
        if (response.data.success === true) {
          response.data.data.map((items, index) => {
            //index = items['kel_id']
            //self.state.selectSubDistrict[index] = index+' - '+items['subdis_name']
            self.state.selectSubDistrict[index] = items['subdis_name'];
          });
          self.setState({
            selectSubDistrict: [
              ...self.state.selectSubDistrict.filter(function (e) {
                return e != null;
              }),
            ],
            allDataKelurahan: allkelurahan,
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

  GetDataAllUser = kel => {
    this.setState({
      userselected: '',
      loadUser: true,
    });
    const self = this;
    //console.log("tokeeen", self.state.token);
    const {navigation} = this.props;

    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/usersurvey/` + kel,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->DATAUSER"+JSON.stringify(response.data.data));
        var allUserData = response.data.data;
        if (response.data.success === true) {
          if (allUserData.length == 0)
            alert('Pada Kelurahan Tersebut Belum Ada Pendukung');

          var gdr;
          response.data.data.map((items, index) => {
            gdr = items['user_gender'] == 0 ? 'Laki-laki' : 'Perempuan';
            self.state.selectUser[index] = items['usernama'] + ' (' + gdr + ')';
          });
          self.setState({
            selectUser: [
              ...self.state.selectUser.filter(function (e) {
                return e != null;
              }),
            ],
            allDataUser: allUserData,
            totalUser: allUserData.length,
          });
          //console.log("OBJECTIBV", JSON.stringify(self.state.selectUser));
        } else {
          console.log('NOK');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORAKTGETUSERRR' + error);
          //alert("ERROR KONEKSI: SILAHKAN COBA");
        } else {
          self.setState({
            loadUser: false,
          });
        }
      })
      .finally(response => {
        self.setState({
          loadUser: false,
        });
      });
  };

  ImageData = async () => {
    const self = this;
    const selectedbkat = this.state.selectedKategori;
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Kamera_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        console.log(
          '==========kamerassss========' + JSON.stringify(datastring),
        );
        //var objmaps64 = [];
        //(datastring).forEach((items,index) => {
        self.state.imagesbase64.push({
          name: 'image' + Date.now(),
          filename: Date.now() + '.png',
          type: 'image/png',
          uri: datastring['img'],
          images64: datastring['ibase64'],
          selectedDistrictfromimage: datastring['idkec'],
          selectedValueDistrictfromimage: datastring['idkec'],
        });
        //console.log("=====ITEMS 65==="+ items["img"]);
        // });

        this.setState({
          imagesnormal: datastring.img,
          //images64 : array64
        });
        this.removeItemValue('@storage_Kamera_Key');
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  removeItemValue = async key => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  };

  GetDataPertanyaan = () => {
    this.setState({
      pertanyaan: [],
    });

    const self = this;
    const {navigation} = this.props;

    self.setState({loader: true});
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/pertanyaan`,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->AKTSTANYA"+JSON.stringify(response.data.data));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            self.state.pertanyaan.push({
              ps_id: items.ps_id,
              pertanyaan: items.ps_pertanyaan,
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

  GetDataPeriode = () => {
    this.setState({
      periode: [],
      loadPeriode: true,
    });

    const self = this;

    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/periode`,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log('---->PERIODEEE' + JSON.stringify(response.data.data));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach(items => {
            let index = items['sp_id'];
            self.state.selectPeriode[index] = items['sp_namaperiode'];
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
            loadPeriode: false,
          });
        }
      })
      .finally(response => {
        this.setState({
          loadPeriode: false,
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

  calculateAge = dateString => {
    // birthday is a date
    // var ageDifMs = Date.now() - birthday.getTime();
    // var ageDate = new Date(ageDifMs); // miliseconds from epoch
    // return Math.abs(ageDate.getUTCFullYear() - 1970);
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    //console.log("dddddddd", age);
    return age.toString();
  };

  SendReport = () => {
    const InjectPoint = () => {
      //console.log(nama,hp);
      this.setState({loader: true});

      var formData = new URLSearchParams();
      formData.append('poin', this.state.poinValidated);
      formData.append(
        'deskripsi',
        'Tambah ' +
          this.state.poinValidated +
          ' Poin, Validasi User :' +
          this.state.nama +
          ' - ' +
          this.state.identitas +
          ', Telah Sukses.',
      );
      formData.append('useridref', this.state.userid_ref);
      //console.log(JSON.stringify(formData));

      var config = {
        method: 'post',
        url: API_URL + `/giftpoint`,
        data: formData,
        headers: {
          //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
          Authorization: 'Bearer ' + this.state.token,
        },
      };

      axios(config)
        .then(function (response) {
          //console.log("---->AKTS"+JSON.stringify(response.data.data));
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

    const self = this;
    self.setState({loader: true});
    const {navigation} = this.props;
    //let img64 = this.state.images64;

    // /console.log("--->images64save1"+JSON.stringify(this.state.imagesbase64[0].images64));
    let arrayImageAll = [];
    // this.state.imagesbase64.map((img) => {
    //     let bufferObjimageall = Buffer.from(img.images64, "utf8");
    //     let base64StringAll = bufferObjimageall.toString("base64");
    //     arrayImageAll.push(base64StringAll);
    // })

    //console.log("ARRAYYYYY",JSON.stringify(self.state.imagesbase64));

    let bufferObjimageDepan = Buffer.from(
      self.state.imagesbase64[0].images64,
      'utf8',
    );
    let base64StringSurvey = bufferObjimageDepan.toString('base64');

    var formData = new URLSearchParams();
    formData.append('id', this.state.identitas);
    formData.append('nama', this.state.nama);
    formData.append('umur', this.calculateAge(this.state.umur));
    formData.append('photosurvey', base64StringSurvey);
    formData.append('popularitas', this.state.selectedValueKenal);
    formData.append('elektabilitas', this.state.selectedValueMemilih);
    formData.append('like', this.state.selectedValueLike);
    formData.append('type', this.state.selectedValueType);
    formData.append('calonlain', this.state.calonlain);
    formData.append('long', this.state.long);
    formData.append('lat', this.state.lat);
    formData.append('user_id', this.state.user_id);
    formData.append('survey_user_id', this.state.iduserselected);
    formData.append('kandidat_id', this.state.kandidat_id);
    formData.append('idpendukung', this.state.iduserselected);
    formData.append('idperiode', this.state.periode_id);
    //formData.append('isvalid', this.state.isValid === true ? 1 : 0);

    var config = {
      method: 'post',
      url: API_URL + `/survey/addjawaban`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
      data: formData,
    };

    axios(config)
      .then(function (response) {
        //console.log("---->SAVE LAPORAN"+JSON.stringify(response.data));
        var profile = response.data.data;

        if (response.data.success === true) {
          //alert(JSON.stringify(profile));
          if (self.state.selectedValueMemilih == 0) {
            InjectPoint();
          }
          showMessage({
            message: 'Data survey telah terkirim',
            type: 'danger',
          });
          navigation.navigate('DashboardNavigator', {
            screen: 'listsurvey',
            params: {idperiode: self.state.periode_id},
          });
          // AsyncStorage.removeItem('@storage_Kamera_Key');
          // self.setState({
          //     imagesbase64:[],
          //     deskripsi: '',
          //     selectedValueKat: ''
          // })
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

  setValidation = () => {
    this.setState({
      isValid: !this.state.isValid,
    });
  };

  render() {
    let i = 0;
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
            style={{marginTop: 5, marginLeft: 35}}
          />
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 15}}>
            {' '}
            Input Survey{' '}
          </Text>
        </View>
        <ScrollView style={{marginTop: 0, marginLeft: 5}}>
          <View style={styles.formcontainer}>
            {/* <View style={styles.action1}>
                        <View style={styles.lefticon}>
                            <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>Nama </Text>
                            </View>
                            <TextInput        
                                placeholder="Masukan Nama Pemilih"                    
                                placeholderTextColor="#CCCCCC"
                                returnKeyType="next"
                                multiline={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.usernameInput}
                                value={this.state.nama}                                
                                onChangeText={(text) => {                                    
                                    this.setState({
                                        nama: text
                                    }) 
                                }}
                            />
                    </View>     */}
            {/* <View style={styles.action1}>
                        <View style={styles.lefticon}>
                            <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>Pilih Periode </Text>
                            </View>
                            { this.state.loadPeriode ? 
                            <UIActivityIndicator color='#000000' zIndex={999999} size={15} style={{top: -5}}/> 
                            :                            
                            <SelectDropdown
                                data={this.state.selectPeriode}
                                buttonStyle={{width: '60%',  
                                    height: 40, borderBottomWidth: 1,
                                    borderColor: '#828282',paddingHorizontal: 0, backgroundColor: '#FFFFFF'}}
                                buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}  
                                defaultButtonText={this.state.selectedPeriode != "" ? this.state.selectedPeriode : "-- Pilih Periode --"}     
                                dropdownStyle={{height: 140, fontSize: 12}}
                                disabled={this.state.selectPeriode.length > 0 ? false : true}
                                rowTextStyle={{textAlign: 'left'}}
                                onSelect={(selectedItem, index) => {
                                    this.setState({                                        
                                        selectedPeriode: selectedItem,
                                        selectedValuePeriode: index                                        
                                    });
                                   
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    //console.log("--> after select"+selectedItem, index);
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
                                defaultValue={this.state.selectedPeriode}
                            />
                            }
                    </View> */}
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
                  Kota/Kab{' '}
                </Text>
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
                  if (this.state.selectedDistrictfromimage == '') {
                    this.GetDataDistrict(
                      selectedItem.split(' - ')[0],
                      this.state.referral,
                    );
                  }
                  //console.log("====--====",selectedItem, index)
                  this.setState({
                    selectDistrict: [],
                    selectedDistrict: '',
                    selectedValueDistrict: '',
                    selectSubDistrict: [],
                    selectedSubDistrict: '',
                    selectedValueSubDistrict: '',
                    selectUser: [],
                    selectedUser: '',
                    selectedValueUser: '',
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
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
                  Kecamatan{' '}
                </Text>
              </View>
              {this.state.loadDis ? (
                <UIActivityIndicator
                  color="#000000"
                  zIndex={999999}
                  size={15}
                  style={{top: -5}}
                />
              ) : (
                <SelectDropdown
                  data={this.state.selectDistrict}
                  buttonStyle={{
                    width: '60%',
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
                      : '-- Pilih Kecamatan --'
                  }
                  dropdownStyle={{height: 140, fontSize: 12}}
                  disabled={this.state.selectDistrict.length > 0 ? false : true}
                  rowTextStyle={{textAlign: 'left'}}
                  onSelect={(selectedItem, index) => {
                    this.setState({
                      selectSubDistrict: [],
                      selectedSubDistrict: '',
                      selectedValueSubDistrict: '',
                      selectedDistrict: selectedItem,
                      selectedValueDistrict: selectedItem,
                      idkecamatan: this.state.allDataKecamatan[index]['dis_id'],
                      idkelr: '',
                      idkelurahan: '',
                      selectUser: [],
                      selectedUser: '',
                      selectedValueUser: '',
                    });
                    this.GetDataSubDistrict(selectedItem.split(' - ')[0]);
                    //console.log("====--====",selectedItem, index)
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
              )}
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
                  Kelurahan{' '}
                </Text>
              </View>
              {this.state.loadDis ? (
                <UIActivityIndicator
                  color="#000000"
                  zIndex={999999}
                  size={15}
                  style={{top: -5}}
                />
              ) : (
                <SelectDropdown
                  data={this.state.selectSubDistrict}
                  buttonStyle={{
                    width: '60%',
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
                      : '-- Pilih Kelurahan --'
                  }
                  dropdownStyle={{height: 200, fontSize: 12}}
                  disabled={
                    this.state.selectSubDistrict.length > 0 ? false : true
                  }
                  rowTextStyle={{textAlign: 'left'}}
                  onSelect={(selectedItem, index) => {
                    this.setState({
                      selectedSubDistrict: selectedItem,
                      selectedValueSubDistrict: selectedItem,
                      idkelr: this.state.allDataKelurahan[index]['kel_id'],
                      idkelurahan:
                        this.state.allDataKelurahan[index]['subdis_id'],
                      selectUser: [],
                      selectedUser: '',
                      selectedValueUser: '',
                    });

                    // this.getDataDPT(selectedItem.split(" - ")[0])
                    this.GetDataAllUser(
                      this.state.allDataKelurahan[index]['subdis_id'],
                    );
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
              )}
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
                  Nama Pendukung{' '}
                </Text>
              </View>
              {this.state.loadUser ? (
                <UIActivityIndicator
                  color="#000000"
                  zIndex={999999}
                  size={15}
                  style={{top: -5}}
                />
              ) : (
                <SelectDropdown
                  data={this.state.selectUser}
                  buttonStyle={{
                    width: '60%',
                    height: 40,
                    borderBottomWidth: 1,
                    borderColor: '#828282',
                    paddingHorizontal: 0,
                    backgroundColor: '#FFFFFF',
                  }}
                  buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                  defaultButtonText={
                    this.state.selectedUser != ''
                      ? this.state.selectedUser
                      : '-- Pilih Nama --'
                  }
                  dropdownStyle={{height: 200, fontSize: 12}}
                  disabled={this.state.selectUser.length > 0 ? false : true}
                  rowTextStyle={{
                    textAlign: 'left',
                    fontSize: 14,
                    color: 'blue',
                  }}
                  onSelect={(selectedItem, index) => {
                    console.log(
                      '====--====TFFLLLLL',
                      this.state.allDataUser[index]['user_tgl_lahir'],
                    );
                    // this.setState({
                    //     selectedSubDistrict: selectedItem,
                    //     selectedValueSubDistrict: selectedItem,
                    //     idkelr : selectedItem.split(" - ")[0],
                    // })

                    this.setState({
                      selectedUser: selectedItem,
                      selectedValueUser: selectedItem,
                      iduserselected: this.state.allDataUser[index]['user_id'],
                      nama: this.state.allDataUser[index]['usernama'],
                      identitas: this.state.allDataUser[index]['userhp'],
                      userid_ref: this.state.allDataUser[index]['idref'],
                      umur:
                        this.state.allDataUser[index]['user_tgl_lahir'] ==
                          null ||
                        this.state.allDataUser[index]['user_tgl_lahir'] ==
                          undefined ||
                        this.state.allDataUser[index]['user_tgl_lahir'] == ''
                          ? 0
                          : this.state.allDataUser[index]['user_tgl_lahir'],
                    });

                    // this.getDataDPT(selectedItem.split(" - ")[0])
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
                  defaultValue={this.state.selectedUser}
                />
              )}
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
                  Umur{' '}
                </Text>
              </View>
              <TextInput
                placeholder="Umur Pemilih"
                placeholderTextColor="#CCCCCC"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.usernameInput}
                keyboardType="number-pad"
                value={
                  this.state.umur == 0
                    ? '0'
                    : this.calculateAge(this.state.umur)
                }
                onChangeText={text => {
                  this.setState({
                    umur: text,
                  });
                }}
              />
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
                  HP/Whatsapp{' '}
                </Text>
              </View>
              <TextInput
                placeholder="No.HP/Whatsapp Pemilih"
                placeholderTextColor="#CCCCCC"
                returnKeyType="next"
                multiline={true}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
                style={styles.usernameInput}
                value={this.state.identitas}
                onChangeText={text => {
                  this.setState({
                    identitas: text,
                  });
                }}
              />
            </View>
            {/* <View style={styles.action1}>
                        <View style={styles.lefticon}>
                            <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>Data Valid? </Text>
                            </View>
                            <CheckBox
                                value={!this.state.isValid}
                                //onValueChange={this.setSelection()}
                                style={{top: 6}}
                                onValueChange={(newValue) => this.setValidation(newValue)}                            
                                />
                            <Text style={{top: 10}}>Tidak </Text><Text style={{color: "red", fontSize: 12, fontFamily: "Play-Bold"}}>(*) Tidak Sesuai</Text>    
                    </View>  */}

            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Text
                  style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
                  Kenal Calon{' '}
                </Text>
              </View>
              <SelectDropdown
                data={this.state.selectKenal}
                buttonStyle={{
                  width: '60%',
                  height: 40,
                  borderBottomWidth: 1,
                  borderColor: '#828282',
                  paddingHorizontal: 0,
                  backgroundColor: '#FFFFFF',
                }}
                buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                defaultButtonText={
                  this.state.selectedKenal != ''
                    ? this.state.selectedKenal
                    : 'Pilih'
                }
                dropdownStyle={{height: 100}}
                rowTextStyle={{textAlign: 'left'}}
                onSelect={(selectedItem, index) => {
                  //console.log("--> after selected kenal"+selectedItem, index);
                  this.setState({
                    selectedKenal: selectedItem,
                    selectedValueKenal: index,
                    selectedLike: '',
                    selectedValueLike: -1,
                    selectedMemilih: '',
                    selectedValueMemilih: -1,
                    selectedType: '',
                    selectedValueType: -1,
                    calonlain: '',
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
                defaultValue={this.state.selectedKenal}
              />
            </View>
            {this.state.selectedValueKenal === 0 ? (
              <View style={styles.action1}>
                <View style={styles.lefticon}>
                  <Text
                    style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
                    Suka{' '}
                  </Text>
                </View>
                <SelectDropdown
                  data={this.state.selectLike}
                  buttonStyle={{
                    width: '60%',
                    height: 40,
                    borderBottomWidth: 1,
                    borderColor: '#828282',
                    paddingHorizontal: 0,
                    backgroundColor: '#FFFFFF',
                  }}
                  buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                  defaultButtonText={
                    this.state.selectedLike != ''
                      ? this.state.selectedLike
                      : 'Pilih'
                  }
                  dropdownStyle={{height: 100}}
                  rowTextStyle={{textAlign: 'left'}}
                  onSelect={(selectedItem, index) => {
                    //console.log("--> after selected kenal"+selectedItem, index);
                    this.setState({
                      selectedLike: selectedItem,
                      selectedValueLike: index,
                      selectedMemilih: '',
                      selectedValueMemilih: -1,
                      selectedType: '',
                      selectedValueType: -1,
                      calonlain: '',
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
                  defaultValue={this.state.selectedLike}
                />
              </View>
            ) : null}
            {this.state.selectedValueLike === 0 ? (
              <View style={styles.action1}>
                <View style={styles.lefticon}>
                  <Text
                    style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
                    Status{' '}
                  </Text>
                </View>
                <SelectDropdown
                  data={this.state.selectMemilih}
                  buttonStyle={{
                    width: '60%',
                    height: 40,
                    borderBottomWidth: 1,
                    borderColor: '#828282',
                    paddingHorizontal: 0,
                    backgroundColor: '#FFFFFF',
                  }}
                  buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                  defaultButtonText={
                    this.state.selectedMemilih != ''
                      ? this.state.selectedMemilih
                      : 'Pilih'
                  }
                  dropdownStyle={{height: 150}}
                  rowTextStyle={{textAlign: 'left'}}
                  onSelect={(selectedItem, index) => {
                    //console.log("--> after select status"+selectedItem, index);
                    this.setState({
                      selectedMemilih: selectedItem,
                      selectedValueMemilih: index,
                      selectedType: '',
                      selectedValueType: -1,
                      calonlain: '',
                    });
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // console.log("--> after select status"+selectedItem, index);
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
                  defaultValue={this.state.selectedMemilih}
                />
              </View>
            ) : null}
            {this.state.selectedValueMemilih === 2 ? (
              <View style={styles.action1}>
                <View style={styles.lefticon}>
                  <Text
                    style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
                    Calon Lain{' '}
                  </Text>
                </View>
                <TextInput
                  placeholder="Nama Calon Lain"
                  placeholderTextColor="#CCCCCC"
                  returnKeyType="next"
                  multiline={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.usernameInput}
                  value={this.state.calonlain}
                  onChangeText={text => {
                    this.setState({
                      calonlain: text,
                    });
                  }}
                />
              </View>
            ) : (
              <View />
            )}

            {this.state.selectedValueMemilih === 0 ? (
              <View style={styles.action1}>
                <View style={styles.lefticon}>
                  <Text
                    style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
                    Type Pemilih?{' '}
                  </Text>
                </View>
                <SelectDropdown
                  data={this.state.selectType}
                  buttonStyle={{
                    width: '60%',
                    height: 40,
                    borderBottomWidth: 1,
                    borderColor: '#828282',
                    paddingHorizontal: 0,
                    backgroundColor: '#FFFFFF',
                  }}
                  buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}
                  defaultButtonText={
                    this.state.selectedType != ''
                      ? this.state.selectedType
                      : 'Pilih'
                  }
                  dropdownStyle={{height: 150}}
                  rowTextStyle={{textAlign: 'left'}}
                  onSelect={(selectedItem, index) => {
                    //console.log("--> after select type"+selectedItem, index);
                    this.setState({
                      selectedType: selectedItem,
                      selectedValueType: index,
                      calonlain: '',
                    });
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // console.log("--> after select type"+selectedItem, index);
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
                  defaultValue={this.state.selectedType}
                />
              </View>
            ) : (
              <View />
            )}

            <View style={{marginTop: 10, width: '40%'}}>
              <Text style={{marginLeft: 5, fontFamily: 'TitilliumWeb-Regular'}}>
                Gambar :
              </Text>
              {this.state.imagesbase64.length === 0 &&
              this.state.selectedValueDistrict != '' &&
              this.state.selectedValueSubDistrict != '' ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('DashboardNavigator', {
                      screen: 'fotosurvey',
                      params: {
                        idkec: this.state.idkecamatan,
                        idkel: this.state.idkelurahan,
                        idperiode: this.state.periode_id,
                      },
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
                    source={{uri: `data:image/png;base64,${item['images64']}`}}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 10,
                      borderWidth: 1,
                      marginRight: 0,
                      marginTop: -70,
                    }}
                  />
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

          {(this.state.selectedValueKenal === 1 &&
            this.state.periode_id !== '' &&
            this.state.imagesbase64.length > 0 &&
            this.state.identitas !== '') ||
          (this.state.selectedValueKenal === 0 &&
            this.state.selectedValueLike === 1 &&
            this.state.periode_id !== '' &&
            this.state.imagesbase64.length > 0 &&
            this.state.identitas !== '') ||
          (this.state.selectedValueKenal === 0 &&
            this.state.selectedValueLike === 0 &&
            this.state.identitas !== '' &&
            this.state.periode_id !== '' &&
            //&& this.state.umur != ""
            this.state.nama !== '' &&
            this.state.iduserselected !== '' &&
            this.state.selectedValueMemilih !== -1 &&
            this.state.selectedValueType !== -1 &&
            this.state.imagesbase64.length > 0) ||
          (this.state.selectedValueKenal === 0 &&
            this.state.selectedValueLike === 0 &&
            this.state.identitas !== '' &&
            this.state.periode_id !== '' &&
            //&& this.state.umur != ""
            this.state.nama !== '' &&
            this.state.iduserselected !== '' &&
            this.state.selectedValueMemilih > 0 &&
            //&& this.state.selectedValueType !== -1
            this.state.imagesbase64.length > 0) ? (
            //  ||   (this.state.selectedValueKenal=== 0 &&
            //         this.state.selectedValueLike === 0
            //         && this.state.identitas !== ""
            //         && this.state.selectedValuePeriode !== ""
            //         //&& this.state.umur != ""
            //         && this.state.nama !== ""
            //         && this.state.iduserselected !== ""
            //         && this.state.selectedValueMemilih > 0
            //         && this.state.selectedValueType !== -1
            //         && this.state.imagesbase64.length > 0 )
            <TouchableOpacity
              onPress={async () => {
                await analytics().logEvent('inputsurvey', {
                  id: this.state.identitas,
                  item:
                    this.state.usernama +
                    ' :Input Survey Data :' +
                    this.state.identitas,
                  description: 'Input Survey',
                });
                this.SendReport();
              }}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
              }}>
              <BtnStandard name="Kirim" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => console.log('Disabled')}
              style={{
                height: 80,
                width: '90%',
                marginTop: 10,
              }}>
              <BtnDisabled name="Kirim" />
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
    marginTop: 0,
    height: Dimensions.get('window').height - 30,
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
    alignContent: 'flex-start',
    borderColor: '#828282',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    paddingTop: 10,
    width: '40%',
  },
  lefticonmultiline: {
    height: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
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
});
