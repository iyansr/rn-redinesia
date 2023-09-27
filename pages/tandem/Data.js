import React, {Component, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
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
import {Svg, Text as TextSVG} from 'react-native-svg';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

//import AgeGraph from './AgeGraph'

export default class Overview extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      kategori: '',
      dataRef: [],
      isFetching: false,
      kandidat_id: 0,
      loader: false,
      total_relawan: 0,
      total_pendukung: 0,
      jmlTargetSuara: 100,
      dataGender: [],
      dataUsiaGen: [],
      muda: 20,
      dewasa1: 11,
      dewasa2: 29,
      dewasa3: 17,
      tua: 12,
      dataUsia: [],
      dataHarian: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      dataTanggalHarian: [],
    };
  }

  componentDidMount() {
    //this._unsubscribe = this.props.navigation.addListener('focus', () => {
    //  const { idkandidat } = this.props.route.params;
    //console.log(idkandidat);
    // this.setState({
    //     kandidat: idkandidat
    // });
    const {idkandidat} = this.props;
    this.setState({
      idkandidat: idkandidat,
    });
    this.ProfilesData();
    //});
  }

  UNSAFE_componentWillUnmount() {
    this.ProfilesData();
    //this._unsubscribe();
  }

  ProfilesData = async () => {
    const {navigation} = this.props;
    const {idkandidat} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->Profile123", JSON.stringify(datastring));
        if (datastring.length > 0) {
          this.setState({
            userid: datastring[0]['user_id'],
            usernama: datastring[0]['usernama'],
            token: datastring[0]['token'],
            userimage: datastring[0]['user_photo'],
            kandidat_id: datastring[0]['k_id'],
            userhandphone: datastring[0]['username'],
            dapil_id: datastring[0]['dapil_id'],
          });

          //this.GetDataByGender(datastring[0]["k_id"]);
          this.GetDataByGender(idkandidat);
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataByGender = (id, dapilid) => {
    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    //formData.append('uname',hp);
    var config = {
      method: 'get',
      url: API_URL + `/totalbygenderdetail/` + id,
      //url: API_URL+`/totalbygenderdetail/`+id,
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
          //console.log("dataReportBYGENDERRRR",JSON.stringify(response.data.data));
          //let dataReport = response.data.data
          //console.log("datareport", dataReport);
          response.data.data.forEach((items, index) => {
            self.state.dataGender.push({
              id: items.subdis_id,
              //"kelurahan": items.subdis_name,
              kelurahan: items.subdis_name,
              total: items.jumlah,
              pria: items.laki2,
              wanita: items.wanita,
            });
          });
        } else {
          console.log('errorrrrrrrita');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORABYGENDER' + error);
          //alert("ERROR KONEKSI: SILAHKAN COBA");
        } else {
          this.setState({
            loaderdatareport: false,
          });
        }
      })
      .finally(response => {
        this.setState({
          loaderdatareport: false,
        });
      });
  };

  render() {
    //console.log("dataausssssssiiiiiaaaGHGHGHGHGHGH",JSON.stringify(this.state.datalabelsHarian));
    //console.log("Pilih usia: ",JSON.stringify(this.state.dataHarian.splice(0,10)));

    const {navigation} = this.props;
    const screenWidth = Dimensions.get('window').width;
    const height = 220;
    const data = {
      labels: ['Relawan', 'Pendukung'],
      data: this.state.dataRef,
      colors: ['purple', 'red'],
    };

    const chartConfigs = {
      backgroundGradientFrom: '#fb8c00',
      backgroundGradientTo: '#fffab1',
      backgroundGradientFromOpacity: 9,
      backgroundGradientToOpacity: 0.5,
      propsForLabels: {fontFamily: 'TitilliumWeb-Regular', fontSize: 10},
      color: (opacity = 1) => `rgba(20, 102, 10, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(20, 102, 10, ${opacity})`,
      //color: (opacity = 5) => `red`,
      hideLegend: true,
      style: {
        borderRadius: 16,
      },
    };

    const dataUsia = {
      labels: ['< 20', '21 < 30', '31 < 40', '41 < 50', '> 51'],
      datasets: [
        {
          data: this.state.dataUsiaGen,
          //data: this.state.dataUsia
        },
      ],
    };

    const chartConfigUsia = {
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      barPercentage: 0.7,
      height: 5000,
      fillShadowGradient: `rgba(1, 122, 205, 1)`,
      fillShadowGradientOpacity: 1,
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(1, 122, 205, 1)`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,

      style: {
        borderRadius: 16,
        fontFamily: 'Bogle-Regular',
      },
      propsForBackgroundLines: {
        strokeWidth: 1,
        stroke: '#e3e3e3',
        strokeDasharray: '0',
      },
      propsForLabels: {
        fontFamily: 'Bogle-Regular',
      },
    };

    const graphStyleUsia = {
      marginVertical: 20,
      ...chartConfigUsia.style,
    };

    const dataHarianLine = {
      labels: this.state.dataTanggalHarian, //["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: this.state.dataHarian.slice(-10), //[20, 45, 28, 80, 99, 43, 21, 32, 33, 12],
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 2, // optional
        },
      ],
      legend: ['Rekrut Harian'], // optional
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <ScrollView>
          <View>
            {/* <View style={{justifyContent: "center"}}>
                       <ProgressChart
                        data={data}
                        width={screenWidth}
                        height={220}
                        strokeWidth={20}
                        radius={50}
                        withCustomBarColorFromData={true}
                        chartConfig={chartConfigs}
                        hideLegend={true}                              
                        />
                    </View> */}
            {/* <View style={{top: -100}}>
                        <View style={{marginLeft: 20, flexDirection: "row", width: "80%", marginTop: 10}}>                            
                                <View><Text>Progress :</Text></View>                            
                        </View>
                        <View style={{marginLeft: 20, flexDirection: "row", width: "80%", marginTop: 10}}>
                                <View style={{width: 55, height: 25, borderRadius: 60, backgroundColor: "red", marginRight:5, justifyContent: "center"}}>
                                    <Text style={{alignSelf: "center", color: "white", fontSize: 10}}>
                                        {((parseInt(this.state.total_pendukung)/parseInt(this.state.jmlTargetSuara))*100).toFixed(3)}%
                                    </Text>
                                </View>
                                <View style={{marginTop: 5}}><Text style={{fontFamily: "TitilliumWeb-Regular"}}>Pendukung </Text></View>                            
                        </View>
                        <View style={{marginLeft: 20, flexDirection: "row", width: "80%"}}>
                                <View style={{width: 55, height: 25, borderRadius: 60, backgroundColor: "purple", marginRight:5, justifyContent: "center"}}>
                                <Text style={{alignSelf: "center", color: "white", fontSize: 10}}>
                                    {((parseInt(this.state.total_relawan)/parseInt(this.state.jmlTargetSuara))*100).toFixed(3)}%
                                </Text>
                                </View>
                                <View style={{marginTop: 5}}><Text style={{fontFamily: "TitilliumWeb-Regular"}}>Relawan</Text></View>                            
                        </View>
                    </View> */}
            {/* <View style={{marginTop: -80}}>
                        <View style={{alignItems: "center", width: "100%", marginTop: 10}}>
                            <Text style={{fontFamily: "TitilliumWeb-Regular", fontSize: 15, color: "#942512"}}>Total Dukungan</Text>
                        </View>
                        <View style={{alignSelf: "center", width: "70%", marginTop: 6, borderWidth: 1, borderRadius: 10, height: 60}}>
                            <Text style={{fontFamily: "TitilliumWeb-Regular", fontSize: 42, color: "#942512", alignSelf: "center"}}>{this.state.total_pendukung+this.state.total_relawan} ({(((this.state.total_pendukung+this.state.total_relawan)/this.state.jmlTargetSuara)*100).toFixed(1)}%)</Text>
                        </View>
                    </View> */}
          </View>
          <View>
            {/* <View style={{width: "100%", marginLeft: 40, marginTop: 20}}>
                        <Text>
                            <Icon name="info" type="font-awesome-5" size={12} color="#942512" style={{paddingRight: 10}} />
                            Sususan Demografi Gender Pendukung</Text>
                         <View style={{width: "70%", height: 10, borderBottomWidth: 1, borderBottomColor: "#942512", }}></View>   
                    </View>
                    <View style={{width: "100%", marginLeft: 20, marginTop: 20, flexDirection: "row"}}>
                        <Icon name="venus-mars"  type="font-awesome-5" size={15} color="#942512" />
                        <Text style={{fontSize: 15, fontWeight: "bold"}}>Gender</Text>                         
                    </View>
                    <View style={{width: "100%", flexDirection: "row", marginLeft: 5, marginTop: 5}}>
                        <View style={{width: "28%"}}>                            
                        <Text style={{marginRight: 10, alignSelf: "flex-end", fontFamily: "TitilliumWeb-Regular", color: "#942512", fontSize: 20}}>Wanita</Text>
                        </View>    
                        <View style={{paddingLeft: 5}}>
                            <Text style={{fontSize: 20, fontFamily: "TitilliumWeb-Regular", alignSelf: "center", color:"#942512"}}> {this.state.total_pendukung_wanita} ({((parseInt(this.state.total_pendukung_wanita)/parseInt(this.state.total_pendukung+this.state.total_relawan))*100).toFixed(1)}%)</Text>
                        </View>
                     </View>
                     <View style={{width: "100%", flexDirection: "row", marginLeft: 5, marginTop: 5}}>
                        <View style={{width: "28%"}}>                            
                        <Text style={{marginRight: 10, alignSelf: "flex-end", fontFamily: "TitilliumWeb-Regular", color: "#942512", fontSize: 20}}>Pria</Text>
                        </View>    
                        <View style={{paddingLeft: 5}}>
                            <Text style={{fontSize: 20, fontFamily: "TitilliumWeb-Regular", alignSelf: "center", color:"#942512"}}> {this.state.total_pendukung_pria} ({((parseInt(this.state.total_pendukung_pria)/parseInt(this.state.total_pendukung+this.state.total_relawan))*100).toFixed(1)}%)</Text>
                        </View>
                     </View> */}
            {/* <View style={{width: "100%", marginLeft: 20, marginTop: 20, flexDirection: "row"}}>
                        <Icon name="dove" type="font-awesome-5" size={15} color="#942512" />
                        <Text style={{fontSize: 15, fontWeight: "bold"}}>Agama</Text>                         
                    </View>
                    <View style={{width: "100%", flexDirection: "row", marginLeft: 5, marginTop: 5}}>
                        <View style={{width: "28%"}}>                            
                                <Text style={{marginRight: 10, alignSelf: "flex-end", fontFamily: "TitilliumWeb-Regular", color: "#942512", fontSize: 20}}>Muslim</Text>
                        </View>    
                        <View style={{paddingLeft: 5}}>
                            <Text style={{fontSize: 20, fontFamily: "TitilliumWeb-Regular", alignSelf: "center", color:"#942512"}}> 993 (93%)</Text>
                        </View>
                     </View>
                     <View style={{width: "100%", flexDirection: "row", marginLeft: 5, marginTop: 5}}>
                        <View style={{width: "28%"}}>                            
                            <Text style={{marginRight: 10, alignSelf: "flex-end", fontFamily: "TitilliumWeb-Regular", color: "#942512", fontSize: 20}}>Kristen</Text>
                        </View>    
                        <View style={{paddingLeft: 5}}>
                            <Text style={{fontSize: 20, fontFamily: "TitilliumWeb-Regular", alignSelf: "center", color:"#942512"}}> 285 (6%)</Text>
                        </View>
                     </View>
                     <View style={{width: "100%", flexDirection: "row", marginLeft: 5, marginTop: 5}}>
                        <View style={{width: "28%"}}>                            
                            <Text style={{marginRight: 10, alignSelf: "flex-end", fontFamily: "TitilliumWeb-Regular", color: "#942512", fontSize: 20}}>Hindu</Text>
                        </View>    
                        <View style={{paddingLeft: 5}}>
                            <Text style={{fontSize: 20, fontFamily: "TitilliumWeb-Regular", alignSelf: "center", color:"#942512"}}> 2 (1%)</Text>
                        </View>
                     </View> */}
          </View>
          <View style={{paddingLeft: 25, marginBottom: 100}}>
            <View style={{width: '110%', marginLeft: 20, marginTop: 20}}>
              <Text>
                <Icon
                  name="info"
                  type="font-awesome-5"
                  size={12}
                  color="#942512"
                  style={{paddingRight: 10}}
                />
                Sususan Demografi Wilayah Kelurahan
              </Text>
              <View
                style={{
                  width: '70%',
                  height: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#942512',
                }}></View>
            </View>
            <View
              style={{
                width: '95%',
                height: 30,
                backgroundColor: 'yellow',
                marginTop: 10,
                flexDirection: 'row',
                elevation: 5,
              }}>
              {/* <View style={{width: "30%", paddingLeft: 10, borderWidth: 1, borderColor: "#CCCCCC"}}>
                                <Text style={{fontWeight: "bold"}}>Kecamatan</Text>
                            </View> */}
              <View
                style={{
                  width: '40%',
                  paddingLeft: 10,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                }}>
                <Text style={{fontWeight: 'bold'}}>Kelurahan</Text>
              </View>
              <View
                style={{
                  width: '20%',
                  paddingLeft: 10,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                }}>
                <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>L</Text>
              </View>
              <View
                style={{
                  width: '20%',
                  paddingLeft: 10,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                }}>
                <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>P</Text>
              </View>
              <View
                style={{
                  width: '20%',
                  paddingLeft: 10,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                }}>
                <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>
                  TOTAL
                </Text>
              </View>
            </View>
            {this.state.dataGender.map((items, index) => (
              <View
                key={items.id}
                style={{
                  width: '95%',
                  height: 40,
                  backgroundColor: 'white',
                  marginTop: 0,
                  flexDirection: 'row',
                  elevation: 5,
                }}>
                {/* <View style={{width: "30%", paddingLeft: 10, borderWidth: 1, borderColor: "#CCCCCC"}}>
                                <Text style={{fontWeight: "bold"}}>{items.kecamatan}</Text>
                            </View> */}
                <View
                  style={{
                    width: '40%',
                    paddingLeft: 10,
                    borderWidth: 1,
                    borderColor: '#CCCCCC',
                  }}>
                  <Text style={{fontWeight: 'bold'}}>{items.kelurahan}</Text>
                </View>
                <View
                  style={{
                    width: '20%',
                    paddingLeft: 10,
                    borderWidth: 1,
                    borderColor: '#CCCCCC',
                  }}>
                  <Text style={{alignSelf: 'center'}}>
                    {items.pria === null ? 0 : items.pria}
                  </Text>
                </View>
                <View
                  style={{
                    width: '20%',
                    paddingLeft: 10,
                    borderWidth: 1,
                    borderColor: '#CCCCCC',
                  }}>
                  <Text style={{alignSelf: 'center'}}>
                    {items.wanita === null ? 0 : items.wanita}
                  </Text>
                </View>
                <View
                  style={{
                    width: '20%',
                    paddingLeft: 10,
                    borderWidth: 1,
                    borderColor: '#CCCCCC',
                  }}>
                  <Text style={{alignSelf: 'center'}}>{items.total}</Text>
                </View>
              </View>
            ))}
            {/* <View style={{width: "95%", height: 40, backgroundColor: "white", marginTop: 0, flexDirection: "row", elevation: 5}}>
                            <View style={{width: "30%", paddingLeft: 10, borderWidth: 1, borderColor: "#CCCCCC"}}>
                                <Text>Cilegon</Text>
                            </View>
                            <View style={{width: "20%", paddingLeft: 10, borderWidth: 1, borderColor: "#CCCCCC"}}>
                                <Text style={{alignSelf: "center"}}>18</Text>
                            </View>
                            <View style={{width: "20%", paddingLeft: 10, borderWidth: 1, borderColor: "#CCCCCC"}}>
                                <Text style={{alignSelf: "center"}}>128</Text>
                            </View>
                            <View style={{width: "30%", paddingLeft: 10, borderWidth: 1, borderColor: "#CCCCCC"}}>
                                <Text style={{alignSelf: "center"}}>146</Text>
                            </View>
                    </View> */}
            {/* <View style={{width: "95%", height: 40, backgroundColor: "white", marginTop: 0, flexDirection: "row", elevation: 5}}>
                            <View style={{width: "30%", paddingLeft: 10, borderWidth: 1, borderColor: "#CCCCCC"}}>
                                <Text>Serang Timur</Text>
                            </View>
                            <View style={{width: "20%", paddingLeft: 10, borderWidth: 1, borderColor: "#CCCCCC"}}>
                                <Text style={{alignSelf: "center"}}>70</Text>
                            </View>
                            <View style={{width: "20%", paddingLeft: 10, borderWidth: 1, borderColor: "#CCCCCC"}}>
                                <Text style={{alignSelf: "center"}}>118</Text>
                            </View>
                            <View style={{width: "30%", paddingLeft: 10, borderWidth: 1, borderColor: "#CCCCCC"}}>
                                <Text style={{alignSelf: "center"}}>188</Text>
                            </View>
                    </View> */}
          </View>
          {/* <View style={{paddingLeft: 25}}>
                    <View style={{width: "100%", marginLeft: 20, marginTop: 20}}>
                        <Text>
                            <Icon name="info" type="font-awesome-5" size={12} color="#942512" style={{paddingRight: 10}} />
                            Sususan Demografi Berdasarkan Usia</Text>
                         <View style={{width: "70%", height: 10, borderBottomWidth: 1, borderBottomColor: "#942512", }}></View>   
                    </View>                    
                </View> */}
          {/* <View> */}
          {
            //     this.state.dataUsiaGen.length > 0 ?
            // <BarChart
            //     style={graphStyleUsia}
            //     data={dataUsia}
            //     width={screenWidth}
            //     height={220}
            //     fromZero={true}
            //     withInnerLines={true}
            //     yAxisLabel=""
            //     chartConfig={chartConfigUsia}
            //     verticalLabelRotation={0}
            // /> : null
          }
          {/* </View> */}
        </ScrollView>
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

//export default Overview;
