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

export default class Listqc extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataRef: [],
      isFetching: false,
      userid: 0,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //this.setState({ dataLaporan:[] });
      this.ProfilesData();
    });
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

        if (datastring.length > 0) {
          this.setState({
            token: datastring[0]['token'],
            userid: datastring[0]['user_id'],
            usernama: datastring[0]['usernama'],
            userimage: datastring[0]['user_photo'],
            kandidat: datastring[0]['k_name'],
            userhandphone: datastring[0]['username'],
          });
        }
        this.GetDataQC(JSON.stringify(datastring[0]['user_id']));
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataQC = iduser => {
    //console.log("><><><><", iduser);
    this.setState({dataRef: []});
    const self = this;
    self.setState({
      loader: true,
    });
    const uid = self.state.userid === 0 ? iduser : self.state.userid;
    //console.log("fffff",hp);
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/qctpsuser/` + uid,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            //console.log("----datetime1----", items.lap_datetime);
            self.state.dataRef.push({
              id: items.qc_id,
              tps: items.qc_no_tps,
              total_dpt: items.qc_total_dpt_real,
              total_suara_all: items.qc_total_suara_masuk,
              total_suara_caleg: items.qc_suara_sah_caleg,
              username: items.usernama,
              gambar: items.qc_gbr_perolehan,
              long: items.qc_long,
              lat: items.qc_lat,
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
      this.GetDataQC();
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
          navigation.navigate('DashboardNavigator', {
            screen: 'editqc',
            params: {idqc: item.id, pscreen: 'list'},
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
          {item.foto == '' ? (
            <Image
              source={require('../../assets/images/NoImageAvailableIcon.png')}
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
              source={{uri: `data:image/png;base64,${item.gambar}`}}
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
        <View style={{width: '45%', paddingTop: 5}}>
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 17}}>
            No. TPS : {item.tps}
          </Text>
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
            Raihan Suara:{item.total_suara_caleg}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Icon
              type="font-awesome-5"
              name="calculator"
              size={13}
              style={{marginTop: 5, marginRight: 6}}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'TitilliumWeb-Regular',
                marginTop: 5,
              }}>
              suara masuk : {item.total_suara_all}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Icon
              type="font-awesome-5"
              name="calculator"
              size={13}
              style={{marginTop: 5, marginRight: 6}}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'TitilliumWeb-Regular',
                marginTop: 5,
              }}>
              Total DPT : {item.total_dpt}
            </Text>
          </View>
        </View>
        <View style={{width: '100%', justifyContent: 'center'}}>
          <Text
            style={{
              fontFamily: 'TitilliumWeb-Regular',
              fontSize: 25,
              color:
                (item.total_suara_caleg / item.total_suara_all) * 100 < 40
                  ? 'red'
                  : 'blue',
            }}>
            {((item.total_suara_caleg / item.total_suara_all) * 100).toFixed(1)}{' '}
            %
          </Text>
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
