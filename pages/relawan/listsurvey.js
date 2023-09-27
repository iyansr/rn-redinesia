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
  RefreshControl,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import BtnStandard from '../component/BtnStandard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import {Badge} from '@rneui/themed';
import {SkypeIndicator} from 'react-native-indicators';

export default class ListSurveyScreen extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataSurvey: [],
      isFetching: false,
      userid: 0,
      selectedSentimen: ['success', 'primary', 'error'],
      selectedSentVal: ['+', 'N', '-'],
      loader: false,
      keyword: '',
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const {idperiode, active} = this.props.route.params;
      this.setState({periode_id: idperiode, active: active});
      this.ProfilesData();
      this.AddButton(active, idperiode);
      //console.log("PERRR", idperiode);
    });
  }

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  AddButton = (active, idp) => {
    active === 1
      ? this.props.navigation.setOptions({
          headerRight: () => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('DashboardNavigator', {
                      screen: 'surveyinput',
                      params: {idperiode: idp},
                    })
                  }
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                    marginRight: 20,
                  }}>
                  <Icon
                    name="plus"
                    type="font-awesome-5"
                    size={20}
                    color="red"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
          },
        })
      : null;
  };

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
            kid: datastring[0]['k_id'],
            kandidat: datastring[0]['k_name'],
          });

          this.GetDataSurvey(this.state.periode_id);
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataSurvey = id => {
    this.setState({dataSurvey: [], loader: true});

    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/surveyperiode/` + id,
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
        if (response.data.success === true) {
          var objmaps64 = {};
          let total_data = response.data.data.length;
          response.data.data.forEach((items, index) => {
            //console.log("----datetime1----", items.sjw_elektabilitas);
            //console.log("---------dtme----",new Date().toString())

            //self.state.dataLaporan[items.lap_id] = items.lap_datetime
            //console.log("--->GAMBAR"+items.k_foto);
            self.state.dataSurvey.push({
              id: items.sjw_id,
              datetime: items.sjw_datetime,
              nama: items.usernama,
              gambar: items.sjw_photo,
              total: total_data,
              pilihan: items.sjw_elektabilitas,
              idpengenal: items.userhp,
              elektabilitas: items.sjw_elektabilitas,
              namaref: items.namaref,
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
      this.GetDataSurvey(this.state.userid);
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

  getIconStatus = status => {
    let iconstatus = '';

    if (status === 0) {
      iconstatus = (
        <Icon
          name="circle"
          type="font-awesome-6"
          size={10}
          color="green"
          style={{marginRight: 90}}
        />
      );
    } else if (status === 1) {
      iconstatus = (
        <Icon
          name="circle"
          type="font-awesome-5"
          size={10}
          color="red"
          style={{marginRight: 90}}
        />
      );
    } else {
      iconstatus = (
        <Icon
          name="circle"
          type="font-awesome-5"
          size={10}
          color="red"
          style={{marginRight: 90}}
        />
      );
    }

    return iconstatus;
  };

  setKeyword = text => {
    this.setState({
      keyword: text,
    });
  };

  render() {
    let w = Dimensions.get('window').width;
    const {navigation} = this.props;
    let x = [];
    const filteredData = this.state.keyword
      ? this.state.dataSurvey.filter(
          x =>
            x.nama.toLowerCase().includes(this.state.keyword.toLowerCase()) ||
            x.idpengenal
              .toLowerCase()
              .includes(this.state.keyword.toLowerCase()) ||
            x.namaperiode
              .toLowerCase()
              .includes(this.state.keyword.toLowerCase()),
        )
      : this.state.dataSurvey;

    const renderItem = ({item}) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('DashboardNavigator', {
            screen: 'detailsurveyperuser',
            params: {surveyid: item.id},
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
        </View>
        <View style={{width: '60%', paddingTop: 5}}>
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 12}}>
            {this.formatDate(item.datetime.split(' ')[0]) +
              ' ' +
              item.datetime.split(' ')[1]}
          </Text>
          <View>
            <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
              {item.nama}
            </Text>
            <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 10}}>
              {item.idpengenal}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: w * 0.029,
                fontFamily: 'TitilliumWeb-Regular',
                marginTop: 5,
                width: 200,
              }}>
              Nama Referral : {item.namaref}
            </Text>
          </View>
        </View>
        <View style={{width: '60%', justifyContent: 'center', marginLeft: -40}}>
          {this.getIconStatus(item.elektabilitas)}
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
            onChangeText={text => this.setKeyword(text)}
            autoCapitalize="none"
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
