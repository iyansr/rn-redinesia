import React, {Component} from 'react';
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
} from 'react-native';
import {Icon} from 'react-native-elements';
//import BtnStandard from '../component/BtnStandard'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import {Badge} from '@rneui/themed';
import {SkypeIndicator} from 'react-native-indicators';

export default class MonitoringScreen extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataLaporan: [],
      isFetching: false,
      userid: 0,
      selectedSentimen: ['success', 'primary', 'error'],
      selectedSentVal: ['+', 'N', '-'],
      loader: false,
      keyword: '',
      jumlahData: 0,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //this.setState({ dataLaporan:[] });
      this.ProfilesData();
      this.DataInfoLaporan();
    });

    setInterval(() => {
      var datetime = new Date();
      this.GetDataLaporan(this.state.userid);
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
        //console.log("-->Profilesds", JSON.stringify(datastring[0]["user_id"]));
        if (datastring.session_id != '') {
          this.setState({
            login: true,
            token: datastring[0]['token'],
            userid: datastring[0]['user_id'],
            usernama: datastring[0]['usernama'],
            userimage: datastring[0]['user_photo'],
            kandidat: datastring[0]['k_name'],
          });

          //this.GetDataLaporan(datastring[0]["user_id"]);
          if (this.state.jumlahData == 0) {
            this.GetDataLaporan(datastring[0]['user_id']);
          } else {
            this.DataInfoLaporan();
          }
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  DataInfoLaporan = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_laporanlist_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->Profilesd", JSON.stringify(datastring));
        if (datastring.length > 0) {
          this.setState({
            jumlahData: datastring.length,
          })(datastring).forEach((items, index) => {
            this.state.dataLaporan.push({
              id: items.lap_id,
              datetime: items.lap_datetime,
              deskripsi: items.lap_deskripsi,
              gambar: items.lap_image,
              total: items.lap_total_image,
              sentimen: items.lap_sentimen,
            });
          });
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataLaporan = userids => {
    const storeDataLaporan = async value => {
      try {
        await AsyncStorage.setItem(
          '@storage_laporanlist_Key',
          JSON.stringify(value),
        );
      } catch (e) {
        // saving error
      }
    };
    this.setState({dataLaporan: [], loader: true});
    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/laporanuser/` + userids,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->REPORTS"+JSON.stringify(response.data.data));
        let ft = [];
        var lpr = response.data.data;
        storeDataLaporan(lpr);
        if (response.data.success === true) {
          var objmaps64 = {};
          var PATTERN = 'atribut';
          response.data.data.forEach((items, index) => {
            //console.log("----datetime1----", items.lap_datetime);
            //console.log("---------dtme----",new Date().toString())

            //self.state.dataLaporan[items.lap_id] = items.lap_datetime
            //console.log("--->GAMBAR"+items.k_foto);
            self.state.dataLaporan.push({
              id: items.lap_id,
              datetime: items.lap_datetime,
              deskripsi: items.lap_deskripsi,
              gambar: items.lap_image,
              total: items.lap_total_image,
              sentimen: items.lap_sentimen,
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
      this.GetDataLaporan(this.state.userid);
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

  render() {
    const {navigation} = this.props;
    let x = [];
    const filteredData = this.state.keyword
      ? this.state.dataLaporan.filter(x =>
          x.deskripsi.toLowerCase().includes(this.state.keyword.toLowerCase()),
        )
      : this.state.dataLaporan;

    const renderItem = ({item}) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('DashboardNavigator', {
            screen: 'detail',
            params: {idlaporan: item.id},
          })
        }
        style={{
          width: '90%',
          height: 100,
          flexDirection: 'row',
          marginBottom: 10,
          borderBottomColor: '#fcba03',
          borderBottomWidth: 1,
        }}>
        <View style={{width: 100, height: 100}}>
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

          <Badge
            status={this.state.selectedSentimen[item.sentimen]}
            value={this.state.selectedSentVal[item.sentimen]}
            containerStyle={{position: 'absolute', top: 5, left: 60}}
          />
        </View>
        <View style={{width: '70%', paddingTop: 5}}>
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 12}}>
            {this.formatDate(item.datetime.split(' ')[0]) +
              ' ' +
              item.datetime.split(' ')[1]}
          </Text>
          <View>
            <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
              {item.deskripsi.substring(0, 40)} ..
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Icon
              type="font-awesome-5"
              name="camera"
              size={13}
              style={{marginTop: 5, marginRight: 6}}
            />
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'TitilliumWeb-Regular',
                marginTop: 5,
              }}>
              {item.total} Gambar
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

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TextInput
            placeholderTextColor="#707070"
            returnKeyType="next"
            autoCapitalize="none"
            onChangeText={text => this.setKeyword(text)}
            style={{
              width: '75%',
              borderWidth: 1,
              borderColor: '#fcba03',
              height: 40,
              marginTop: 10,
              borderRadius: 10,
              backgroundColor: '#f5e0d7',
              fontFamily: 'TitilliumWeb-Regular',
              padding: 10,
            }}
          />
          <View
            style={{
              width: 50,
              height: 40,
              marginLeft: -10,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderRightWidth: 1,
              marginTop: 10,
              zIndex: -99999,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              borderColor: '#CCCCCC',
            }}>
            <Icon
              name="search"
              type="font-awesome-5"
              color="#f59e0b"
              size={20}
              style={{zIndex: 999999, marginTop: 8, marginLeft: 8}}
            />
          </View>
        </View>
        {this.state.loader ? (
          <View style={{marginTop: 60}}>
            <SkypeIndicator color="red" />
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={{marginLeft: 30, marginTop: 30}}
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
});
