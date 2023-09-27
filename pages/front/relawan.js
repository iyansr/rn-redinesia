import React, {
  Component,
  useRef,
  useCallback,
  Ref,
  useMemo,
  RefObject,
} from 'react';
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
  Button,
} from 'react-native';
import {Icon} from 'react-native-elements';
import BtnStandard from '../component/BtnStandard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import {SkypeIndicator} from 'react-native-indicators';

export default class Relawan extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataRef: [],
      isFetching: false,
      userid: 0,
      jumlahData: 0,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //this.setState({ dataLaporan:[] });
      this.ProfilesData();
      this.DataRekrut();
    });

    setInterval(() => {
      var datetime = new Date();
      this.GetDataRegister(this.state.userhandphone);
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
        //console.log("-->Profilesds", datastring[0]["userhp"]);
        if (datastring.session_id != '') {
          this.setState({
            token: datastring[0]['token'],
            userid: datastring[0]['user_id'],
            usernama: datastring[0]['usernama'],
            userimage: datastring[0]['user_photo'],
            kandidat: datastring[0]['k_name'],
            userhandphone: datastring[0]['username'],
          });
        }
        //this.GetDataRegister(JSON.stringify(datastring[0]["username"]));
        if (this.state.jumlahData == 0) {
          this.GetDataRegister(datastring[0]['username']);
        } else {
          this.DataRekrut();
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  DataRekrut = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_referrals_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        if (datastring.length > 0) {
          //console.log("-->ProfilesdREKRUTsss", datastring);
          this.setState({
            jumlahData: datastring.length,
          })(datastring).forEach((items, index) => {
            self.state.dataRef.push({
              id: items.user_id,
              nama: items.usernama,
              handphone: items.userhp,
              nik: items.user_nik,
              gender: items.user_gender,
              province: items.provinsi,
              kota: items.kota,
              kec: items.kecamatan,
              //"foto": items.ud_selfi
            });
          });
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataRegister = async hp => {
    this.setState({dataRef: []});
    const self = this;
    const storeDataRfrll = async value => {
      try {
        await AsyncStorage.setItem(
          '@storage_referrals_Key',
          JSON.stringify(value),
        );
      } catch (e) {
        // saving error
        console.log('eerrrorrrr', e);
      }
    };
    self.setState({
      loader: true,
    });
    const statehp =
      self.state.userhandphone == '' ? hp : self.state.userhandphone;
    //console.log("fffff",hp);
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/userappref/` + statehp,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    await axios(config)
      .then(function (response) {
        //console.log("---->REPORTS"+JSON.stringify(response.data.data));
        let ft = [];
        var rkrts = response.data.data;
        storeDataRfrll(rkrts);
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            //console.log("----datetime1----", items.lap_datetime);
            self.state.dataRef.push({
              id: items.user_id,
              nama: items.usernama,
              handphone: items.userhp,
              nik: items.user_nik,
              gender: items.user_gender,
              province: items.provinsi,
              kota: items.kota,
              kec: items.kecamatan,
              //"foto": items.ud_selfi
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

  onRefresh() {
    const self = this;
    //console.log("iiiii",this.state.userhandphone);
    this.setState({isFetching: true}, () => {
      this.GetDataRegister();
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

    const renderItem = ({item}) => (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('detilappr', {useridrelawan: item.id})
        }
        style={{
          width: '95%',
          height: 100,
          flexDirection: 'row',
          marginBottom: 10,
          borderBottomColor: '#fcba03',
          borderBottomWidth: 1,
        }}>
        <View style={{width: 100, height: 100}}>
          {item.gender === 0 ? (
            <Image
              source={require('../../assets/images/pria.jpg')}
              style={{
                width: 80,
                height: 80,
                borderRadius: 60,
                borderWidth: 1,
                resizeMode: 'contain',
              }}
            />
          ) : (
            <Image
              source={require('../../assets/images/wanita.jpeg')}
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
        <View style={{width: '65%', paddingTop: 5}}>
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 17}}>
            {item.nama}
          </Text>
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
            {item.handphone}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Icon
              type="font-awesome-5"
              name="map-marker-alt"
              size={13}
              style={{marginTop: 5, marginRight: 6}}
            />
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'TitilliumWeb-Regular',
                marginTop: 5,
              }}>
              {item.province} - {item.kota} {item.kec}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />
        {this.state.loader ? (
          <View style={{marginTop: 60}}>
            <SkypeIndicator color="red" />
          </View>
        ) : (
          <FlatList
            data={this.state.dataRef}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={{marginLeft: 30, marginTop: 20}}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            updateCellsBatchingPeriod={5}
            removeClippedSubviews={false}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  containers: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
});
