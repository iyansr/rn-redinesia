import React, {Component, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {SkypeIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import {Icon} from 'react-native-elements';

class BroadcastList extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataRef: [],
      isFetching: false,
      kandidat_id: 0,
      loader: false,
      selectSegmen: [
        'Semua Relawan',
        'Semua Pendukung',
        'Pendukung 17 - 23 Tahun',
        'Pendukung 24 - 40 Tahun',
        'Pendukung Diatas 40 Tahun',
        'Pendukung Laki-laki',
        'Pendukung Perempuan',
        'Koordinator Kecamatan',
      ],
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //this.setState({ dataLaporan:[] });
      this.ProfilesData();
    });
  }

  AddButton = () => {
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
              onPress={() =>
                this.props.navigation.navigate('sendbroadcast', {
                  idfrom: 'list',
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
    });
  };

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->Profile123", JSON.stringify(datastring));
        if (datastring.length > 0) {
          this.setState({
            userid: datastring[0]['user_id'],
            token: datastring[0]['token'],
            usernama: datastring[0]['usernama'],
            userimage: datastring[0]['user_photo'],
            kandidat_id: datastring[0]['k_id'],
            userhandphone: datastring[0]['username'],
          });
        }
        this.GetDataBroadcast(datastring[0]['k_id']);
        if (datastring[0]['type'] == 2 || datastring[0]['type'] == 5) {
          this.AddButton();
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataBroadcast = idkandidat => {
    //console.log("><><><><", idkandidat);
    this.setState({dataRef: []});
    const self = this;
    self.setState({
      loader: true,
    });

    //console.log("fffff",hp);
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/broadcast/` + idkandidat,
      data: formData,
      headers: {
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->REPORTSBRD"+JSON.stringify(response.data.data));
        let ft = [];
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            //console.log("----datetime1----", items.lap_datetime);
            self.state.dataRef.push({
              id: items.br_id,
              title: items.br_title,
              konten: items.br_konten,
              datetime: items.br_datetime,
              pengirim: items.usernama,
              count: items.br_count,
              segment: items.br_segment,
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
      this.GetDataBroadcast(this.state.kandidat_id);
    });
    this.setState({isFetching: false});
  }

  render() {
    const {navigation} = this.props;
    let w = Dimensions.get('window').width;

    const renderItem = ({item}) => (
      <TouchableOpacity
        style={{
          width: '95%',
          height: 85,
          flexDirection: 'row',
          marginBottom: 11,
          paddingBottom: 11,
          borderBottomColor: '#fcba03',
          borderBottomWidth: 1,
        }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderWidth: 1,
            justifyContent: 'center',
            borderColor: '#CCCCCC',
          }}>
          <Icon
            name="bullhorn"
            type="font-awesome-5"
            size={30}
            color="#CCCCC2"></Icon>
        </View>
        <View style={{width: '80%', paddingLeft: 10}}>
          <Text style={{fontFamily: 'TitilliumWeb-Regular', fontSize: 14}}>
            {item.title}
          </Text>
          {/* <View style={{flexDirection:'row'}}>                        
                        <Text style={{fontSize: w * 0.023, fontFamily: 'TitilliumWeb-Regular',marginTop: 5, width: w}}>{(item.konten).substring(0,50)}</Text>
                    </View>                     */}
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: w * 0.032,
                fontFamily: 'TitilliumWeb-Regular',
                marginTop: 2,
                width: w,
              }}>
              Pengirim : {item.pengirim}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: w * 0.032,
                fontFamily: 'TitilliumWeb-Regular',
                marginTop: 2,
                width: w,
              }}>
              Total : {item.count}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: w * 0.032,
                fontFamily: 'TitilliumWeb-Regular',
                marginTop: 2,
                width: w,
              }}>
              Segment : {this.state.selectSegmen[item.segment]}
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

export default BroadcastList;
