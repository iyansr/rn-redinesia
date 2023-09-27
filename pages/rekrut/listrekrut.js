import React, {
  Component,
  useRef,
  useCallback,
  Ref,
  useMemo,
  RefObject,
  createRef,
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
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import BtnStandard from '../component/BtnStandard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import {SkypeIndicator} from 'react-native-indicators';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';

const actionSheetRef = createRef();

export default class NewReg extends Component {
  constructor(props: Props) {
    super(props);
    //this.actionSheetRef = createRef();
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

      const handleOpenPress = () => actionSheetRef.current?.show();
      this.ProfilesData();
      this.DataRekrut();
      this.props.navigation.setOptions({
        headerRight: () => {
          return (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={handleOpenPress}
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
      });
      //const actionSheetRef = createRef();
    });
    setInterval(() => {
      var datetime = new Date();
      //actionSheetRef.current?.show();
      this.GetDataRegister(
        this.state.userhandphone,
        this.state.typeUser,
        this.state.k_id,
      );
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
        //console.log("-->Profile123", datastring.session_id);
        //console.log("----jmldatassss",this.state.jumlahData);
        if (datastring.session_id != '') {
          this.setState({
            token: datastring[0]['token'],
            userid: datastring[0]['user_id'],
            usernama: datastring[0]['usernama'],
            userimage: datastring[0]['user_photo'],
            kandidat: datastring[0]['k_name'],
            k_id: datastring[0]['k_id'],
            userhandphone: datastring[0]['username'],
            typeUser: datastring[0]['type'],
          });
        }
        if (this.state.jumlahData == 0) {
          this.GetDataRegister(
            datastring[0]['username'],
            datastring[0]['type'],
            datastring[0]['k_id'],
          );
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
      const value = await AsyncStorage.getItem('@storage_rekrut_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        if (datastring.length > 0) {
          //console.log("-->ProfilesdREKRUTsss", datastring);
          this.setState({
            jumlahData: datastring.length,
          })(datastring).forEach((items, index) => {
            this.state.dataRef.push({
              id: items.user_id,
              nama: items.usernama,
              handphone: items.userhp,
              nik: items.user_nik,
              gender: items.user_gender,
              province: items.provinsi,
              kota: items.kota,
              kec: items.kecamatan,
              //"foto": items.ud_selfi,
              owner_id: items.user_owner,
              owner_name: items.owner_name,
            });
          });
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataRegister = async (hp, tpeu, kdid) => {
    const {navigation} = this.props;
    this.setState({dataRef: [], loader: true});
    const storeDataRekrutmen = async value => {
      try {
        await AsyncStorage.setItem(
          '@storage_rekrut_Key',
          JSON.stringify(value),
        );
      } catch (e) {
        // saving error
        console.log('eerrrorrrr', e);
      }
    };
    const self = this;
    const statehp =
      self.state.userhandphone == '' ? hp : self.state.userhandphone;
    const typeuser = self.state.typeUser == '' ? tpeu : self.state.typeUser;
    const kddt_id = self.state.k_id == '' ? kdid : self.state.k_id;

    console.log('fffff', typeuser);
    let url;
    if (typeuser == 2 || typeuser == 5) {
      url = API_URL + `/userdukungref/` + statehp;
    } else {
      url = API_URL + `/userdukung/` + statehp;
    }

    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: url, //API_URL+`/userdukung/`+statehp,
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
        storeDataRekrutmen(rkrt);
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
              //"foto": items.ud_selfi,
              owner_id: items.user_owner,
              owner_name: items.owner_name,
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

  handleClick = ref => {
    actionSheetRef.current?.hide();
    const {navigation} = this.props;
    if (ref === 1) {
      navigation.navigate('rekrutdpt');
    } else {
      navigation.navigate('rekrut');
    }
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

  setKeyword = text => {
    this.setState({
      keyword: text,
    });
  };

  EditPress = () => {
    //console.log("edit");
  };

  render() {
    let w = Dimensions.get('window').width;
    const {navigation} = this.props;
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

    const renderItem = ({item}) => (
      <TouchableOpacity
        onLongPress={() =>
          navigation.navigate('editrekrutdata', {useridrelawan: item.id})
        }
        onPress={() =>
          navigation.navigate('detailrekrut', {idrelawan: item.id})
        }
        style={{
          width: '95%',
          height: 100,
          flexDirection: 'row',
          marginBottom: 10,
          borderBottomColor: '#fcba03',
          borderBottomWidth: 1,
        }}>
        {/* <TouchableOpacity onPress={() => console.log("select user edit")} style={{width: '95%', height: 100, flexDirection: 'row', marginBottom: 10, borderBottomColor: '#fcba03', borderBottomWidth: 1}}> */}
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
        <View style={{width: '65%', paddingTop: 0, alignSelf: 'flex-start'}}>
          <Text
            style={{
              fontFamily: 'TitilliumWeb-Regular',
              fontSize: w * 0.036,
              width: w,
            }}>
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
              {item.kec}
            </Text>
          </View>
          {this.state.owner_id != 0 ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'TitilliumWeb-Regular',
                  marginTop: 5,
                }}>
                Rekruter :
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'TitilliumWeb-Regular',
                  marginTop: 5,
                }}>
                {' '}
                {item.owner_name}
              </Text>
            </View>
          ) : null}
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
        <>
          <ActionSheet ref={actionSheetRef}>
            <View
              style={{
                alignContent: 'center',
                width: '90%',
                height: 140,
                marginLeft: 50,
                marginTop: 30,
              }}>
              <TouchableOpacity
                onPress={() => this.handleClick(1)}
                style={{
                  flexDirection: 'row',
                  width: '80%',
                  height: 40,
                  borderWidth: 1,
                  borderColor: '#89959d',
                  backgroundColor: '#c4cace',
                  elevation: 5,
                  borderRadius: 18,
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <View style={{width: 60, paddingTop: 1}}>
                  <Icon
                    type="font-awesome-5"
                    name="database"
                    color={'#f59e0b'}
                    size={22}
                  />
                </View>
                <View style={{width: 220}}>
                  <Text
                    style={{
                      fontSize: 20,
                      marginLeft: 3,
                      fontFamily: 'Play-Regular',
                      fontWeight: 'bold',
                    }}>
                    DATA DPT 2019
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleClick(0)}
                style={{
                  flexDirection: 'row',
                  width: '80%',
                  height: 40,
                  marginTop: 15,
                  borderWidth: 1,
                  borderColor: '#89959d',
                  backgroundColor: '#c4cace',
                  elevation: 5,
                  borderRadius: 18,
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <View style={{width: 60, paddingLeft: 10, paddingTop: 1}}>
                  <Icon
                    type="font-awesome-5"
                    name="user-plus"
                    color={'#f59e0b'}
                    size={22}
                  />
                </View>
                <View style={{width: 220}}>
                  <Text
                    style={{
                      fontSize: w * 0.048,
                      marginLeft: 3,
                      fontFamily: 'Play-Regular',
                      fontWeight: 'bold',
                    }}>
                    DATA NON DPT (BARU)
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ActionSheet>
        </>
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
