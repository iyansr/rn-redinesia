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
//import { Badge } from "@rneui/themed";
import {SkypeIndicator} from 'react-native-indicators';

export default class MonitoringScreen extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataBuzz: [],
      isFetching: false,
      userid: 0,
      loader: false,
      keyword: '',
      selectSumber: [
        'Berita Online Web',
        'Facebook',
        'Twitter',
        'Instagram',
        'Whatsapp',
      ],
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
          this.AddButton(datastring[0]['type']);
          this.GetDataBuzz();
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  AddButton = type => {
    (type === 2) | (type === 5)
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
                  onPress={() => this.props.navigation.navigate('addbuzz')}
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

  GetDataBuzz = () => {
    this.setState({dataBuzz: [], loader: true});
    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/buzz`,
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
          response.data.data.forEach((items, index) => {
            self.state.dataBuzz.push({
              id: items.buzz_id,
              datetime: items.buzz_datetime,
              judul: items.buzz_judulberita,
              sumber: items.buzz_sumber,
              link: items.buzz_link,
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
      this.GetDataBuzz();
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
      ? this.state.dataBuzz.filter(
          x =>
            x.judul.toLowerCase().includes(this.state.keyword.toLowerCase()) ||
            this.state.selectSumber[x.sumber]
              .toLowerCase()
              .includes(this.state.keyword.toLowerCase()) ||
            x.link.toLowerCase().includes(this.state.keyword.toLowerCase()),
        )
      : this.state.dataBuzz;

    const renderItem = ({item}) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('DashboardNavigator', {
            screen: 'detaildatabuzz',
            params: {id: item.id},
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
        <View style={{width: 70, height: 70}}>
          <Icon
            name="newspaper"
            type="font-awesome-5"
            size={25}
            color={'#942512'}
          />
        </View>
        <View style={{width: '90%', paddingTop: 5}}>
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 12}}>
            {this.formatDate(item.datetime.split(' ')[0]) +
              ' ' +
              item.datetime.split(' ')[1]}
          </Text>
          <View>
            <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 15}}>
              {item.judul.replace(/(\r\n|\n|\r)/gm, ' ')}{' '}
            </Text>
            <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
              Sumber : {this.state.selectSumber[item.sumber]}{' '}
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
