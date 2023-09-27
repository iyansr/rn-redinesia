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
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import BtnStandard from '../component/BtnStandard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import {SkypeIndicator} from 'react-native-indicators';
import Modal from 'react-native-modal';

export default class Inbox extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataRef: [],
      dataInbox: [],
      isFetching: false,
      userid: 0,
      keyword: '',
      isModalVisible: false,
      infoDetail: [
        {
          id: 0,
          datetime: '',
          title: '',
          deskripsi: '',
          type: 0,
          url: null,
          user_id: 0,
          status: 0,
        },
      ],
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.ProfilesData();
    });
  }

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  setVisibleModal = (vdata, iddata) => {
    this.setState({
      isModalVisible: !vdata,
    });

    if (iddata > 0) {
      this.onRefresh();
      let dataselected = this.state.dataInbox.filter(x => x.id === iddata);
      //console.log("--->", JSON.stringify(dataselected));
      this.setState({
        infoDetail: dataselected,
      });
      this.ReadInbox(iddata);
    }
  };

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
        this.GetDataInbox();
        this.GetDataUnread();
        //this.ListRelawanAsync()
      }
    } catch (e) {
      // error reading value
    }
  };

  AddButton = iddata => {
    //console.log("---->000000000",iddata);
    this.setState({
      ReadyDelete: true,
      selectedIDHapus: iddata,
    });
    iddata > 0
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
                  onPress={() => this.removeData(iddata)}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                    marginRight: 20,
                  }}>
                  <Icon
                    name="trash"
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

  removeData = id => {
    return Alert.alert('HAPUS PESAN', 'Apakah anda yakin Ingin Hapus Pesan?', [
      // The "Yes" button
      {
        text: 'Ya',
        onPress: () => {
          //this.processApprove(status)
          this.HapusInbox(id);
          this.onRefresh();

          this.props.navigation.setOptions({
            headerRight: () => {
              return null;
            },
          });
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'Tidak',
        onPress: () => {
          this.setState({
            ReadyDelete: false,
          });

          this.props.navigation.setOptions({
            headerRight: () => {
              return null;
            },
          });
        },
      },
    ]);
  };

  GetDataInbox = () => {
    const self = this;
    self.setState({loader: true, dataInbox: []});
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/inbox`,
      data: formData,
      headers: {
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        var ft = response.data.data;
        if (response.data.success === true) {
          //console.log("---->", JSON.stringify(ft));
          let listData = [];
          //let jumlahData = response.data.jumlah
          //self.setState({jumlahInbox : jumlahData})
          response.data.data.forEach((items, index) => {
            self.state.dataInbox.push({
              id: items.inbox_id,
              datetime: items.inbox_datetime,
              title: items.inbox_title,
              deskripsi: items.inbox_deskripsi,
              type: items.inbox_type,
              url: items.inbox_url,
              user_id: items.inbox_user_id,
              status: items.inbox_status,
            });
          });
        } else {
          console.log('errorrrrrrrita');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORAKT 22222' + error);
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

  ReadInbox = async id => {
    const self = this;
    //console.log("-----",id);
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'post',
      url: API_URL + `/read/` + id,
      data: formData,
      headers: {
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    await axios(config)
      .then(function (response) {
        var ft = response.data.data;
        if (response.data.success === true) {
          // this.onRefresh();
          // console.log("READ")
        } else {
          console.log('errorrrrrrrita');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORAKT 22222' + error);
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

  HapusInbox = async id => {
    const self = this;
    //console.log("-----???>>>",id);
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'post',
      url: API_URL + `/deleteinbox/` + id,
      data: formData,
      headers: {
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    await axios(config)
      .then(function (response) {
        var ft = response.data.data;
        if (response.data.success === true) {
          // this.onRefresh();
          //console.log("READ")
        } else {
          console.log('errorrrrrrrita');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORAKT 22222' + error);
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

  GetDataUnread = async () => {
    const storeDataInbox = async value => {
      try {
        await AsyncStorage.setItem('@storage_inbox_Key', JSON.stringify(value));
      } catch (e) {
        // saving error
      }
    };

    const self = this;
    var config = {
      method: 'get',
      url: API_URL + `/unread`,
      headers: {
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    await axios(config)
      .then(function (response) {
        var information = response.data.data;
        //console.log("---->INBOXX"+JSON.stringify(information[0]["unread"]));
        let ft = [];
        if (response.data.success === true) {
          storeDataInbox(information);
          self.setState({
            unreadData: information[0]['unread'],
          });
        } else {
          console.log('errorrrrrrrita');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORAKTINBOXXXX' + error);
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
      this.GetDataInbox();
    });
    this.props.navigation.setOptions({
      headerRight: () => {
        return null;
      },
    });
    this.setState({isFetching: false, ReadyDelete: false});
  }

  formatDate(input) {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2],
      time = datePart[3] + ':' + datePart[4] + ':' + datePart[5];

    return day + '/' + month + '/' + year + ' ' + time;
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
    const {navigation} = this.props;
    let x = [];
    const filteredData = this.state.keyword
      ? this.state.dataInbox.filter(x =>
          x.title.toLowerCase().includes(this.state.keyword.toLowerCase()),
        )
      : this.state.dataInbox;

    //console.log("----000",filteredData);
    const windowSize = filteredData.length > 50 ? filteredData.length / 4 : 21;
    let num = 100; // This is the number which defines how many data will be loaded for every 'onReachEnd'
    let initialLoadNumber = 40; // This is the number which defines how many data will be loaded on first open
    let idx = 0;
    const lyr = Dimensions.get('screen');
    const renderItem = ({item}) =>
      item.user_id == 0 && item.status == 1 ? (
        <TouchableOpacity
          key={idx++}
          onPress={() =>
            item.type === 2
              ? navigation.navigate(item.url)
              : navigation.navigate('detailurlinbox', {url: item.url})
          }
          style={{
            width: '90%',
            height: 60,
            flexDirection: 'row',
            paddingBottom: 15,
            borderBottomColor: '#fcba03',
            borderBottomWidth: 1,
          }}>
          <View
            style={{
              width: 35,
              height: 35,
              borderWidth:
                this.state.ReadyDelete && this.state.selectedIDHapus === item.id
                  ? 3
                  : 1,
              borderColor:
                item.status === 1
                  ? 'red'
                  : this.state.ReadyDelete &&
                    this.state.selectedIDHapus === item.id
                  ? 'red'
                  : '#BFBFBF',
              marginTop: 10,
              borderRadius: 10,
              justifyContent: 'center',
            }}>
            <Icon
              name="exclamation-circle"
              type="font-awesome-5"
              size={20}
              color="orange"></Icon>
          </View>
          <View style={{width: '90%', paddingLeft: 10, marginTop: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 12, fontFamily: 'Play-Bold'}}>
                {this.formatDate(item.datetime)}
              </Text>
            </View>
            <Text
              style={{
                fontFamily:
                  item.status === 1
                    ? 'FredokaOne-Regular'
                    : 'TitilliumWeb-Regular',
                fontSize: 14,
              }}>
              {item.title}
            </Text>
            {/* <View style={{flexDirection:'row', width: "85%"}}>                        
                        <Text style={{fontSize: 12, color: item.status === 1 ? "#CCCCCC":"#BFBFBF", fontWeight: "bold", fontFamily: 'TitilliumWeb-Regular',marginTop: 5}}>{(item.deskripsi).substring(0,80)} ...</Text>
                    </View>                                                            */}
          </View>
        </TouchableOpacity>
      ) : item.user_id > 0 ? (
        <TouchableOpacity
          key={idx++}
          onLongPress={() => this.AddButton(item.id)}
          onPress={() =>
            item.type === 0
              ? this.setVisibleModal(this.state.isModalVisible, item.id)
              : item.type === 2
              ? navigation.navigate(item.url)
              : navigation.navigate('detailurlinbox', {url: item.url})
          }
          style={{
            width: '90%',
            height: 60,
            flexDirection: 'row',
            paddingBottom: 15,
            borderBottomColor: '#fcba03',
            borderBottomWidth: 1,
          }}>
          <View
            style={{
              width: 35,
              height: 35,
              borderWidth:
                this.state.ReadyDelete && this.state.selectedIDHapus === item.id
                  ? 3
                  : 1,
              borderColor:
                item.status === 1
                  ? 'red'
                  : this.state.ReadyDelete &&
                    this.state.selectedIDHapus === item.id
                  ? 'red'
                  : '#BFBFBF',
              marginTop: 10,
              borderRadius: 10,
              justifyContent: 'center',
            }}>
            {item.status === 1 ? (
              <Icon
                name="envelope"
                type="font-awesome-5"
                size={20}
                color={
                  this.state.ReadyDelete &&
                  this.state.selectedIDHapus === item.id
                    ? 'red'
                    : '#CCCCC2'
                }></Icon>
            ) : (
              <Icon
                name="envelope-open"
                type="font-awesome-5"
                size={20}
                color={
                  this.state.ReadyDelete &&
                  this.state.selectedIDHapus === item.id
                    ? 'red'
                    : '#CCCCC2'
                }></Icon>
            )}
          </View>
          <View style={{width: '90%', paddingLeft: 10, marginTop: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 12, fontFamily: 'Play-Bold'}}>
                {this.formatDate(item.datetime)}
              </Text>
            </View>
            <Text
              style={{
                fontFamily:
                  item.status === 1
                    ? 'FredokaOne-Regular'
                    : 'TitilliumWeb-Regular',
                fontSize: 14,
              }}>
              {item.title}
            </Text>
            {/* <View style={{flexDirection:'row', width: "100%"}}>                        
                        <Text style={{fontSize: 12, color: item.status === 1 ? "#CCCCCC":"#BFBFBF", fontWeight: "bold", fontFamily: 'TitilliumWeb-Regular',marginTop: 5}}>{(item.deskripsi).substring(0,50)} ...</Text>
                    </View>                                                            */}
          </View>
        </TouchableOpacity>
      ) : null;

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
        <Modal
          isVisible={this.state.isModalVisible}
          onBackButtonPress={() =>
            this.setVisibleModal(this.state.isModalVisible, 0)
          }>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.nameText}>
                {this.state.infoDetail[0]['title']}
              </Text>
              <Text style={styles.followText}></Text>
            </View>
            <View
              style={{
                height: 200,
                backgroundColor: 'white',
                paddingVertical: 10,
                padding: 10,
              }}>
              <ScrollView>
                <View style={{width: '100%'}}>
                  <Text
                    style={{
                      fontFamily: 'TitilliumWeb-Regular',
                      marginBottom: 5,
                    }}>
                    {this.state.infoDetail[0]['deskripsi']}
                  </Text>
                </View>
              </ScrollView>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: 30,
                  borderWidth: 1,
                  marginRight: 2,
                  backgroundColor: 'orange',
                }}
                onPress={() =>
                  this.setVisibleModal(this.state.isModalVisible, 0)
                }>
                <Text
                  style={{
                    alignSelf: 'center',
                    top: 4,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Tutup
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
});
