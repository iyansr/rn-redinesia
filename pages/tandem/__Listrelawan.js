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

export default class Listrelawan extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataRef: [],
      isFetching: false,
      userid: 0,
      keyword: '',
    };
  }

  componentDidMount() {
    //this._unsubscribe = this.props.navigation.addListener('focus', () => {
    //this.setState({ dataLaporan:[] });

    const {navigate} = this.props;
    //console.log(this.props);
    this.ProfilesData();
    //this.ListRelawanAsync();

    //});
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
        //console.log("-->Profile123", datastring[0]["k_id"]);
        if (datastring.session_id != '') {
          this.setState({
            userid: datastring[0]['user_id'],
            token: datastring[0]['token'],
            usernama: datastring[0]['usernama'],
            userimage: datastring[0]['user_photo'],
            kandidat: datastring[0]['k_name'],
            kandidat_id: datastring[0]['k_id'],
            userhandphone: datastring[0]['username'],
          });
        }
        this.GetDataRelawan(datastring[0]['k_id']);
        //this.ListRelawanAsync()
      }
    } catch (e) {
      // error reading value
    }
  };

  ListRelawanAsync = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_relawan_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->Profile123", datastring);

        this.setState({
          dataRef: datastring,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataRelawan = idk => {
    // const storeDataListRelawan = async (value) => {
    //     try {
    //         await AsyncStorage.setItem('@storage_relawan_Key', JSON.stringify(value))
    //     } catch (e) {
    //         // saving error
    //     }
    // }
    const self = this;
    self.setState({dataRef: [], loader: true});
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/relawancaleg/` + idk,
      data: formData,
      headers: {
        Authorization: 'Bearer ' + self.state.token,
      },
    };
    //console.log("---->REPORTS"+self.state.token);
    axios(config)
      .then(function (response) {
        //console.log("---->REPORTS"+JSON.stringify(response.data.data));
        var ft = response.data.data;
        if (response.data.success === true) {
          //console.log("---->REPORTS"+JSON.stringify(response.data.data));
          //var objmaps64 = {};
          let listData = [];
          response.data.data.forEach((items, index) => {
            //console.log("----datetime1----", items.lap_datetime);
            self.state.dataRef.push({
              id: items.user_id,
              nama: items.usernama,
              uname: items.username,
              handphone: items.userhp,
              nik: items.user_nik,
              gender: items.user_gender,
              province: items.provinsi,
              kota: items.kota,
              kec: items.kecamatan,
              foto: items.ud_selfi,
              jmlrekrut: items.jml,
            });
          });

          //console.log("PANJANG", listData.length);

          //storeDataListRelawan(listData)
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
    this.setState({isFetching: true}, () => {
      this.GetDataRelawan(this.state.kandidat_id);
    });
    this.setState({isFetching: false});

    this.ListRelawanAsync();
  }

  formatDate(input) {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + '/' + month + '/' + year;
  }

  setKeyword = text => {
    this.setState({
      keyword: text,
    });
  };

  goToDetail = id => {
    //console.log("on progress");

    navigation.navigate('personarelawandetail', {idrelawan: id});
  };

  render() {
    let x = [];
    const filteredData = this.state.keyword
      ? this.state.dataRef.filter(
          x =>
            x.nama.toLowerCase().includes(this.state.keyword.toLowerCase()) ||
            x.handphone
              .toLowerCase()
              .includes(this.state.keyword.toLowerCase()),
        )
      : this.state.dataRef;

    //console.log("----000",filteredData);
    const windowSize = filteredData.length > 50 ? filteredData.length / 4 : 21;
    let num = 100; // This is the number which defines how many data will be loaded for every 'onReachEnd'
    let initialLoadNumber = 40; // This is the number which defines how many data will be loaded on first open

    const renderItem = ({item}) => (
      <View
        keyExtractor={(items, index) => index.toString()}
        onPress={() =>
          this.props.navigation.navigate('DashboardNavigator', {
            screen: 'personarelawandetail',
            params: {idrelawan: item.id, hp: item.uname},
          })
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
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('DashboardNavigator', {
                screen: 'personarelawandetail',
                params: {idrelawan: item.id, hp: item.uname},
              })
            }>
            <Text
              style={{
                color: '#942512',
                fontFamily: 'TitilliumWeb-Regular',
                fontSize: 17,
              }}>
              {item.nama}
            </Text>
          </TouchableOpacity>
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
          <View style={{flexDirection: 'row'}}>
            <Icon
              type="font-awesome-5"
              name="users"
              size={13}
              style={{marginTop: 5, marginRight: 6}}
            />
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'TitilliumWeb-Regular',
                marginTop: 5,
              }}>
              Total Rekrutan :{' '}
              {item.jmlrekrut == 0 ? '-' : item.jmlrekrut + ' Orang'}{' '}
            </Text>
          </View>
        </View>
      </View>
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
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={{marginLeft: 30, marginTop: 20}}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            maxToRenderPerBatch={num}
            updateCellsBatchingPeriod={num / 2}
            removeClippedSubviews={true}
            disableVirtualization={true}
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
