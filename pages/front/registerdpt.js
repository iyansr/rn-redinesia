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
import DeviceInfo from 'react-native-device-info';
import SafeAreaView from 'react-native-safe-area-view';
import axios from 'react-native-axios';
import {Icon} from 'react-native-elements';
import {API_URL} from '@env';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker';
//import { nikParser } from 'nik-parser'
//import { parsenik } from 'parsenik'
import CheckBox from '@react-native-community/checkbox';
import {UIActivityIndicator} from 'react-native-indicators';
import Modal from 'react-native-modal';

class AppRegDpt extends Component {
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
      selectUserdpt: [],
      selectedUserdpt: '',
      selectedValueUserdpt: '',
      tps: 0,
      nikdepan: '',
      nikbelakang: '',
      errorNIK: true,
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
    this.setState({
      referral: ref,
      selectProvince: [],
      selectedProvince: '',
      selectedValueProv: '',
      selectCity: [],
      selectedCity: '',
      selectedValueCity: '',
    });
    //this.getDataReferral(ref)
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

  pecahNik = ref => {
    //console.log("00-0-0-0",ref.substring(7,8));
    var depan = ref.substring(0, 8);
    //var demo = "31750321";
    var belakang = '';
    //var nikfinal = depan+belakang;
    this.setState({nikdepan: depan, nikbelakang: belakang});
    //this.cekNik(nikfinal)
  };

  setNik = ref => {
    var nikfinal = this.state.nikdepan + ref;
    //console.log("phdsifhiodsf",nikfinal);
    this.setState({nik: nikfinal, nikbelakang: ref});
    this.cekNik(nikfinal);
  };
  cekNik = cRef => {
    const star = cRef.includes('********');
    //console.log("ppppp", cRef.length);
    if (cRef.length == 16 && !star) {
      const nik = this.GetDataNikParser(cRef);
      //console.log("NIIIKK",JSON.stringify(nik));
    } else {
    }
    // if(nik.valid == false){
    //     console.log("NIIIKK",JSON.stringify(nik));
    //     this.setState({
    //         errorNIK : true,
    //         //datebirth: this.formatDate((nik.lahir()).toISOString().split('T')[0])
    //     })
    // }else{
    //     this.setState({
    //         errorNIK : false
    //     })
    // }
  };

  setRT = ref => {
    this.setState({rt: ref});
  };

  setRW = ref => {
    this.setState({rw: ref});
  };

  setTempat = ref => {
    this.setState({tmptlahir: ref});
  };

  setTps = ref => {
    this.setState({tps: ref});
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
    // console.log(
    //     this.state.name +"==ref:"+
    //     this.state.referral  +"==hp:"+
    //     this.state.handphone  +"==nikbelkang:"+
    //     this.state.nikbelakang +"==nikasli:"+
    //     this.state.nik  +"==tglhr:"+
    //     this.state.datebirth +"==gender:"+
    //      this.state.selectedValueGender +"==prov:"+
    //      this.state.selectedValueProv +"==kota:"+
    //      this.state.selectedValueCity +"==kec:"+
    //       this.state.selectedValueDistrict +"==idkel:"+
    //       this.state.selectedValueSubDistrict +"==alamt:"+
    //     this.state.alamat +"==hpudhblm:"+
    //     this.state.errorHP +"==tgllhr:"+
    //     this.state.tglLhr +"==rt:"+
    //     this.state.rt +"==rw:"+
    //     this.state.rw +"==cebok:"+
    //     this.state.isSelected +"=====idkel:"+
    //     this.state.idkelurahan
    // );
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
              selectDistrict: [],
              selectedDistrict: '',
              selectedValueDistrict: '',
            });
            self.GetDataCity(items.prov_id, ref);
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
            //console.log(">>>>>>city",items.city_id);
            //console.log(">>>>>>cityddd",index+"-"+items["city_id"]+"-"+items["city_name"]);
            //if(index == items["city_id"]){
            //index = items['city_id']
            //console.log(">>>>>>cityddd",index+"-"+items["city_id"]+"-"+items["city_name"]);
            //self.state.selectCity[index] = index+' - '+items['city_name']
            //}
            self.setState({
              selectedValueCity: items.city_id,
              selectedCity: items.city_name,
              selectDistrict: [],
              selectedDistrict: '',
              selectedValueDistrict: '',
            });
            self.GetDataDistrict(items.city_id, ref);
          });
          // self.setState({
          //     selectCity: [...self.state.selectCity.filter(function (e) {return e != null;})]
          // });
          //console.log("+++++++CITYH"+JSON.stringify(self.state.selectCity.filter(function (e) {return e != null;})));
          //console.log("+++++++ssssbbb"+JSON.stringify(self.state.selectCity));
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
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->DISTRICT"+JSON.stringify(response.data.data));
        var allkelurahan = response.data.data;
        if (response.data.success === true) {
          response.data.data.map((items, index) => {
            //console.log("--->",index);
            //index = items['kel_id']
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

  getDataReferral = ref => {
    const self = this;
    self.setState({
      loadDis: true,
    });
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    formData.append('id', ref);
    //formData.append('id', idKel);
    var config = {
      method: 'post',
      url: API_URL + `/referraldata`,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->DATAREF"+JSON.stringify(response.data.data));
        var refd = response.data.data;
        if (response.data.success === true) {
          //console.log("----+++",refd[0]["k_prov_id_dpt"]);
          self.setState({
            kprovdpt: refd[0]['k_prov_id_dpt'],
            kkabdpt: refd[0]['k_kab_id_dpt'],
            //selectUserdpt: [...self.state.selectUserdpt.filter(function (e) {return e != null;})]
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

  getDataDPT = idKel => {
    const self = this;
    self.setState({
      loadUserDpt: true,
      selectUserdpt: [],
      nikdepan: '',
      nikbelakang: '',
      selectedUserdpt: '',
      selectedValueUserdpt: '',
    });
    const {navigation} = this.props;
    //var formData = new URLSearchParams();
    // formData.append('provid', self.state.kprovdpt);
    // formData.append('kabid', self.state.kkabdpt);
    var frd = {
      filter: self.state.name,
      id: idKel,
    };

    //formData.append('filter', self.state.name);
    //formData.append('id', idKel);
    var config = {
      method: 'post',
      //url: `http://103.181.183.133/apitimses20/public/webservices/getDptByKelurahan`,
      url: `https://apidpt.mscode.id/apitimses20/public/webservices/getDptByKelurahan`,
      data: frd,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        'Content-Type': 'application/json',
      },
    };

    //console.log(config)

    axios(config)
      .then(function (response) {
        var dataDTP = response.data.data;
        //console.log("---->DATADPT"+dataDTP)
        if (dataDTP.length > 0) {
          //console.log("---->DATADPT"+dataDTP)
          self.setState({
            allData: dataDTP,
          });
          //var index = 0;
          dataDTP.map((items, index) => {
            //console.log("---->INDEXESSS",items);
            self.state.selectUserdpt[index] =
              items['nik'] + ' - ' + items['nama'];
          });

          //console.log("OBJECCCCTTTT",JSON.stringify(self.state.selectUserdpt));

          self.setState({
            selectUserdpt: [
              ...self.state.selectUserdpt.filter(function (e) {
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
            loadUserDpt: false,
          });
        }
      })
      .finally(response => {
        self.setState({
          loadUserDpt: false,
        });
      });
  };

  lengkaptnc = () => {
    return alert(
      'Dengan Kesadaran dan Penuh Kesadaran, bersama ini saya mengajukan untuk didaftarkan sebagai anggota Relawan. \r\n Saya menyatakan bahwa semua data yang saya Kirimkan ini adalah benar sebagai bukti pendaftaran dan pendataan yang sah serta dapat digunakan sebagaimana mestinya. \r\n Apabila dikemudian hari saya melanggar aturan keanggotaan, maka saya bersedia diberhentikan dari keanggotaan sesuai dengan ketentuan dan peraturan yang berlaku.',
    );
  };

  GetDataNikParser = nik => {
    this.setState({dataRef: []});
    const self = this;

    self.setState({
      loaderktpparse: true,
    });

    //console.log("fffff",hp);
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    formData.append('nik', nik);
    var config = {
      method: 'post',
      url: API_URL + `/nikparse`,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        //'Authorization': 'Bearer '+self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        var hasil = response.data.data;
        if (response.data.success === true) {
          //console.log("Hasil", JSON.stringify(hasil));
          //console.log("tgllhr", new Date(hasil.jenis_kelamin));
          self.setState({
            nik: hasil.nik,
            //nikdepan : (hasil.nik).substring(0,8),
            //nikbelakang : (hasil.nik).substring(7,8),
            errorNIK: hasil.valid,
            selectedGender:
              hasil.jenis_kelamin == 'LAKI-LAKI' ? 'Pria' : 'Wanita',
            selectedValueGender: hasil.jenis_kelamin == 'LAKI-LAKI' ? 0 : 1,
            datebirth: new Date(hasil.tanggal_lahir),
            tglLhr: hasil.tanggal_lahir,
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
            loaderktpparse: false,
          });
        }
      })
      .finally(response => {
        self.setState({
          loaderktpparse: false,
        });
      });
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
    formData.append('kota', self.state.selectedValueCity);
    formData.append('kec', self.state.selectedValueDistrict.split(' - ')[0]);
    formData.append('kel', this.state.idkelurahan); //self.state.selectedValueSubDistrict.split(" - ")[0]);
    formData.append('email', '');
    formData.append('referal', self.state.referral);
    formData.append('account', self.state.account);
    formData.append('idaccount', '');
    formData.append('status', 0);
    formData.append('owner', self.state.referral);
    formData.append('photoaccount', self.state.photoaccount);
    formData.append('idDpt', self.state.idDptSelected);
    formData.append('noTps', self.state.noTps);
    formData.append('rt', self.state.rt);
    formData.append('rw', self.state.rw);

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

  render() {
    const {navigation} = this.props;
    let h = Dimensions.get('window').height;
    let w = Dimensions.get('window').width;

    const phoneRegExp =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    //console.log("lplplplplp",this.state.selectUserdpt.length)

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
                disabled={
                  this.state.selectDistrict.length > 0 || this.state.name != ''
                    ? false
                    : true
                }
                rowTextStyle={{textAlign: 'left'}}
                onSelect={(selectedItem, index) => {
                  //console.log("====--====",selectedItem, index)
                  this.setState({
                    selectSubDistrict: [],
                    selectedSubDistrict: '',
                    selectedValueSubDistrict: '',
                    selectedDistrict: selectedItem,
                    selectedValueDistrict: selectedItem,
                    idkelr: '',
                    idkelurahan: '',
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
                  //console.log("====--====",selectedItem.split(" - ")[0], index)
                  //this.getDataDPT(selectedItem.split(" - ")[0]);
                  this.setState({
                    selectedSubDistrict: selectedItem,
                    selectedValueSubDistrict: selectedItem,
                    idkelr: this.state.allDataKelurahan[index]['kel_id'],
                    idkelurahan:
                      this.state.allDataKelurahan[index]['subdis_id'],
                  });
                  //this.getDataDPT(selectedItem.split(" - ")[0])
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
                  name="user"
                  type="font-awesome"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <TextInput
                placeholder="Nama"
                placeholderTextColor="#707070"
                returnKeyType="next"
                autoCapitalize="none"
                //onBlur={() => this.getDataDPT(this.state.idkelr)}
                //onKeyPress={() => this.setState({selectUserdpt : []})}
                editable={this.state.idkelurahan ? true : false}
                autoCorrect={false}
                style={styles.usernameInput}
                value={this.state.name}
                onChangeText={text => this.setName(text)}
              />

              {
                <TouchableOpacity
                  onPress={() =>
                    this.state.idkelurahan
                      ? this.getDataDPT(this.state.idkelr)
                      : alert('Data Kelurahan Belum Ada')
                  }>
                  <Icon
                    name="search"
                    type="font-awesome-5"
                    size={15}
                    color="red"
                    style={{
                      height: 45,
                      top: -5,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      zIndex: 10,
                      paddingRight: 100,
                      borderWidth: 0,
                      borderColor: 'black',
                    }}
                  />
                </TouchableOpacity>
                // this.state.selectedValueDistrict == 0 ?
                //     <Text style={styles.errorselect}>{errors.selectdis}</Text>
                // : <View/>
              }
              {
                // errors.named &&
                //     <Text style={styles.error}>{errors.named}</Text>
              }
            </View>
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                {this.state.loadUserDpt ? (
                  <UIActivityIndicator
                    color="#000000"
                    zIndex={999999}
                    size={19}
                  />
                ) : (
                  <Icon
                    name="user"
                    type="font-awesome-5"
                    color="#f59e0b"
                    size={15}
                  />
                )}
              </View>
              <SelectDropdown
                data={this.state.selectUserdpt}
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
                  this.state.selectedUserdpt != ''
                    ? this.state.selectedUserdpt
                    : 'Cari NIK'
                }
                dropdownStyle={{height: 250, fontSize: 12}}
                disabled={this.state.selectUserdpt.length > 0 ? false : true}
                rowTextStyle={{textAlign: 'left', fontSize: 14, color: 'blue'}}
                onSelect={(selectedItem, index) => {
                  //console.log("====--====> IDDPTEHH",this.state.allData[index]["idDpt"])
                  //console.log("====--====",index)
                  this.setState({
                    selectedUserdpt: selectedItem,
                    selectedValueUserdpt: selectedItem,
                    //nik : selectedItem.split(" - ")[0],
                    name: selectedItem.split(' - ')[1],
                    idDptSelected: this.state.allData[index]['idDpt'],
                    noTps: this.state.allData[index]['noTps'],
                    errorNIK: false,
                  });

                  this.pecahNik(selectedItem.split(' - ')[0]);
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
                valueField="value"
                labelField="label"
                search={true}
                searchInputStyle={styles.dropdown1searchInputStyleStyle}
                searchPlaceHolder={'Cari Nama/Nik'}
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
                // defaultValue={values.selectdis}
                defaultValue={this.state.selectedUserdpt}
              />
            </View>
            {/* <View style={styles.action1}>
                        <View style={styles.lefticon}>
                            <Icon name='box' type='font-awesome-5' color='#f59e0b' size={15} />
                        </View>
                            <TextInput
                                placeholder="TPS"
                                placeholderTextColor="#707070"
                                returnKeyType="next"
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.usernameInput}
                                value={this.state.tps}
                                onChangeText={(text) => this.setTps(text)}
                                
                            />
                            {
                            // errors.tmptlahir &&
                            //     <Text style={styles.error}>{errors.tmptlahir}</Text>
                            }
                    </View> */}

            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="credit-card"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  placeholder="NIK DEPAN"
                  placeholderTextColor="#707070"
                  returnKeyType="next"
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  disabled={true}
                  editable={false}
                  autoCorrect={false}
                  style={[styles.usernameInputNIKDepan, {color: 'red'}]}
                  value={this.state.nikdepan}
                />
                <Text
                  style={{
                    width: 10,
                    height: 40,
                    padding: 0,
                    top: 10,
                    fontWeight: 'bold',
                  }}>
                  -
                </Text>
                <TextInput
                  placeholder="Lengkapi NIK"
                  placeholderTextColor="#707070"
                  returnKeyType="next"
                  autoCapitalize="none"
                  //onBlur={(text) => this.cekNik(text)}
                  autoCorrect={false}
                  style={[
                    styles.usernameInputNIK,
                    {
                      color: 'red',
                      paddingLeft: 10,
                      borderColor: this.state.nikbelakang ? 'red' : '#828282',
                    },
                  ]}
                  value={this.state.nikbelakang}
                  onChangeText={text => this.setNik(text)}
                />
                {!this.state.errorNIK && (
                  <Text style={[styles.error, {marginLeft: -52}]}>
                    Lengkapi
                  </Text>
                )}
              </View>
            </View>
            {/* <View style={styles.action1}>
                        <View style={styles.lefticon}>
                            <Icon name='map' type='font-awesome-5' color='#f59e0b' size={15} />
                        </View>
                            <TextInput
                                placeholder="Tempat Lahir"
                                placeholderTextColor="#707070"
                                returnKeyType="next"
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.usernameInput}
                                value={this.state.tmptlahir}
                                onChangeText={(text) => this.setTempat(text)}
                                
                            />
                            {
                            // errors.tmptlahir &&
                            //     <Text style={styles.error}>{errors.tmptlahir}</Text>
                            }
                    </View> */}
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
                // <View style={{flexDirection: 'row'}}>
                // <TouchableOpacity style={styles.eyeInput} onPress={() => this.setOpen(true)}>
                //     <Icon name="calendar" type="font-awesome" color="#f59e0b" size={15}/>
                // </TouchableOpacity>
                //  </View>
              }

              <DatePicker
                modal
                open={this.state.open}
                date={this.state.datebirth}
                onConfirm={date => {
                  //console.log("",date);
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
                                // onSubmit={() => console.log("tesst")}
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
            {/* <View style={styles.action1}>
                        <View style={styles.lefticon}>
                            <Icon name='map' type='font-awesome-5' color='#f59e0b' size={15} />
                        </View>
                        <SelectDropdown
                                data={this.state.selectCity}
                                buttonStyle={{width: '88%',  
                                    height: 40, borderBottomWidth: 1,
                                    borderColor: '#828282',paddingHorizontal: 0, backgroundColor: '#FFFFFF'}}
                                buttonTextStyle={{textAlign: 'left', flex: 1, fontSize: 15}}   
                                defaultButtonText={this.state.selectedCity != "" ? this.state.selectedCity : "Pilih Kota/Kab"}     
                                dropdownStyle={{height: 150, fontSize: 12}}
                                disabled={this.state.selectCity.length > 0 ? false : true}
                                rowTextStyle={{textAlign: 'left'}}
                                onSelect={(selectedItem, index) => {
                                    this.GetDataDistrict(selectedItem.split(" - ")[0], this.state.referral);
                                    //console.log("====--====",selectedItem, index)
                                    this.setState({
                                        selectDistrict: [],
                                        selectedDistrict: "",
                                        selectedValueDistrict: ""
                                    });
                                    this.setState({
                                        selectedCity: selectedItem,
                                        selectedValueCity: selectedItem
                                    })
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
                    </View> */}
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
            <View style={styles.action1}>
              <View style={styles.lefticon}>
                <Icon
                  name="map"
                  type="font-awesome-5"
                  color="#f59e0b"
                  size={15}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  placeholder="RT"
                  placeholderTextColor="#707070"
                  returnKeyType="next"
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  autoCorrect={false}
                  style={[styles.usernameInputRTRW, {color: 'red'}]}
                  value={this.state.rt}
                  onChangeText={text => this.setRT(text)}
                />
                <Text
                  style={{
                    width: 10,
                    height: 40,
                    padding: 0,
                    top: 10,
                    fontWeight: 'bold',
                  }}>
                  -
                </Text>
                <TextInput
                  placeholder="RW"
                  placeholderTextColor="#707070"
                  returnKeyType="next"
                  autoCapitalize="none"
                  //onBlur={(text) => this.cekNik(text)}
                  keyboardType="number-pad"
                  autoCorrect={false}
                  style={[
                    styles.usernameInputRTRW,
                    {
                      color: 'red',
                      paddingLeft: 10,
                      borderColor: this.state.nikbelakang ? 'red' : '#828282',
                    },
                  ]}
                  value={this.state.rw}
                  onChangeText={text => this.setRW(text)}
                />
                {!this.state.errorNIK && (
                  <Text style={[styles.error, {marginLeft: -52}]}>
                    Lengkapi
                  </Text>
                )}
              </View>
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
            <Text
              onPress={() => this.setVisibleModal(this.state.isModalVisible)}
              style={{
                color: 'red',
                fontFamily: 'TitilliumWeb-Regular',
                fontSize: 15,
              }}>
              Selengkapnya
            </Text>
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
          this.state.nikbelakang === '' ||
          this.state.nik === '' ||
          this.state.selectedValueGender == '-' ||
          this.state.selectedValueProv == 0 ||
          this.state.selectedValueCity == 0 ||
          this.state.selectedValueDistrict == 0 ||
          this.state.selectedValueSubDistrict == 0 ||
          this.state.alamat == '' ||
          this.state.errorHP == true ||
          this.state.isSelected == false ||
          this.state.rt == '' ||
          this.state.rw == '' ? (
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
    marginTop: -10,
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

  usernameInputNIKDepan: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 5,
    textAlign: 'left',
    borderBottomWidth: 1,
    borderColor: '#828282',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },

  usernameInputNIK: {
    height: 40,
    backgroundColor: '#FFFFFF',
    width: 210,
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 0,
    textAlign: 'left',
    borderBottomWidth: 1,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },

  usernameInputRTRW: {
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 30,
    textAlign: 'left',
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
export default AppRegDpt;
