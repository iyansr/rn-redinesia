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

export default class NewReg extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataRef: [],
      isFetching: false,
      userid: 0,
      keyword: '',
      jumlahData: 0,
      loader: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //this.setState({ dataLaporan:[] });
      //console.log("----jmldata",this.state.jumlahData);
      this.ProfilesData();
      this.DataTandem();
    });
    // setInterval(() => {
    //     //var datetime = new Date()
    //     this.GetDataTandem();
    // }, 150000)
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
        //console.log("-->Profile123", datastring.session_id);
        //console.log("----jmldatassss",this.state.jumlahData);
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
        if (this.state.jumlahData == 0) {
          this.GetDataTandem();
        } else {
          this.DataTandem();
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  DataTandem = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_tandem_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        if (datastring.length > 0) {
          //console.log("-->ProfilesdREKRUTsss", datastring);
          this.setState({
            jumlahData: datastring.length,
          })(datastring).forEach((items, index) => {
            this.state.dataRef.push({
              id: items.k_id,
              name: items.k_name,
              gender: items.k_gender,
              dapil: items.dapil_nama,
            });
          });
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataTandem = async () => {
    const {navigation} = this.props;
    this.setState({dataRef: [], loader: true});
    const storeDataTandem = async value => {
      try {
        await AsyncStorage.setItem(
          '@storage_tandem_Key',
          JSON.stringify(value),
        );
      } catch (e) {
        // saving error
        console.log('eerrrorrrr', e);
      }
    };
    const self = this;
    //console.log("fffff",hp);

    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/tandem`,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    await axios(config)
      .then(function (response) {
        //console.log("---->REPORTS"+JSON.stringify(response.data.data));
        //let ft = [];
        var rkrt = response.data.data;
        storeDataTandem(rkrt);
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            //console.log("----datetime1----", items.lap_datetime);
            self.state.dataRef.push({
              id: items.k_id,
              name: items.k_name,
              gender: items.k_gender,
              dapil: items.dapil_nama,
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

  onRefresh() {
    const self = this;
    //console.log("iiiii",this.state.userhandphone);
    this.setState({isFetching: true}, () => {
      this.GetDataTandem();
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

  EditPress = () => {
    console.log('edit');
  };

  render() {
    const {navigation} = this.props;

    let x = [];
    const filteredData = this.state.keyword
      ? this.state.dataRef.filter(x =>
          x.name.toLowerCase().includes(this.state.keyword.toLowerCase()),
        )
      : this.state.dataRef;

    const renderItem = ({item}) => (
      // <TouchableOpacity onPress={() => navigation.navigate("DashboardNavigator", {screen: "tandemoverview", params: {idkandidat : item.id}})} style={{width: '95%', height: 70, flexDirection: 'row', marginBottom: 10, borderBottomColor: '#fcba03', borderBottomWidth: 1, marginTop: 20}}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('calegviewtandem', {idkandidat: item.id})
        }
        style={{
          width: '95%',
          height: 70,
          flexDirection: 'row',
          marginBottom: 10,
          borderBottomColor: '#fcba03',
          borderBottomWidth: 1,
          marginTop: 20,
        }}>
        {/* <TouchableOpacity onPress={() => console.log("select user edit")} style={{width: '95%', height: 100, flexDirection: 'row', marginBottom: 10, borderBottomColor: '#fcba03', borderBottomWidth: 1}}> */}
        <View style={{width: 50, height: 100}}>
          {item.gender === 1 ? (
            <Image
              source={require('../../assets/images/pria.jpg')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 60,
                borderWidth: 1,
                resizeMode: 'contain',
              }}
            />
          ) : (
            <Image
              source={require('../../assets/images/wanita.jpeg')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 60,
                borderWidth: 1,
                resizeMode: 'contain',
              }}
            />
          )}
        </View>
        <View style={{width: '65%', paddingTop: 0, alignSelf: 'flex-start'}}>
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 16}}>
            {item.name}
          </Text>
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 15}}>
            Dapil : {item.dapil}
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
