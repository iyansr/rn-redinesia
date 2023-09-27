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
  Alert,
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
      dataPeriode: [],
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
        this.GetDataPeriode();
        //this.ListRelawanAsync()
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataPeriode = () => {
    const self = this;
    self.setState({dataPeriode: [], loader: true});
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/allperiode`,
      data: formData,
      headers: {
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        var ft = response.data.data;
        if (response.data.success === true) {
          //console.log(JSON.stringify(response.data.data));

          let listData = [];
          response.data.data.forEach((items, index) => {
            self.state.dataPeriode.push({
              id: items.sp_id,
              jumlah: items.jml,
              periode: items.periode,
              namaperiode: items.sp_namaperiode,
              start: items.sp_periode_startdate,
              end: items.sp_periode_enddate,
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
    this.setState({isFetching: true}, () => {
      this.GetDataPeriode();
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
      ? this.state.dataPeriode.filter(x =>
          x.namaperiode
            .toLowerCase()
            .includes(this.state.keyword.toLowerCase()),
        )
      : this.state.dataPeriode;

    //console.log("----000",filteredData);
    const windowSize = filteredData.length > 50 ? filteredData.length / 4 : 21;
    let num = 100; // This is the number which defines how many data will be loaded for every 'onReachEnd'
    let initialLoadNumber = 40; // This is the number which defines how many data will be loaded on first open

    const renderItem = ({item}) => (
      <TouchableOpacity
        keyExtractor={(items, index) => index.toString()}
        onPress={() =>
          this.props.navigation.navigate('DashboardNavigator', {
            screen: 'listsurvey',
            params: {idperiode: item.id, active: item.periode},
          })
        }
        style={{
          width: '95%',
          height: 60,
          flexDirection: 'row',
          marginBottom: 10,
          borderBottomColor: '#fcba03',
          borderBottomWidth: 1,
        }}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{width: '60%', paddingTop: 5}}>
            <Text
              style={{
                color: item.periode === 1 ? '#942512' : '#CFCFCF',
                fontFamily: 'TitilliumWeb-Regular',
                fontSize: 17,
              }}>
              {item.namaperiode} {item.periode === 0 ? '(Tidak Aktif)' : null}
            </Text>
            <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
              {this.formatDate(item.start)} - {this.formatDate(item.end)}
            </Text>
          </View>

          <View style={{width: '40%'}}>
            <Text
              style={{
                fontSize: 35,
                fontFamily: 'TitilliumWeb-Regular',
                color: item.periode === 1 ? 'red' : '#CFCFCF',
                textAlign: 'right',
              }}>
              {item.jumlah}
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
