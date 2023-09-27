import React, { Component, useRef, useCallback, Ref, useMemo, RefObject } from 'react'
import { Text, SafeAreaView, TouchableOpacity, StatusBar, StyleSheet, 
        TextInput, View, FlatList, Image, RefreshControl, ScrollView, Button, Alert, Dimensions} from 'react-native'
import { Icon } from 'react-native-elements'
import BtnStandard from '../component/BtnStandard'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from "@env"
import axios from 'react-native-axios';
import {SkypeIndicator} from 'react-native-indicators';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";


export default class Rekap extends Component {
    
    
    constructor(props: Props) {  
        super(props);          
        this.state = {  
            kategori: '',      
            dataRef: [],
            dataPeriode: [],
            isFetching: false,
            userid: 0,
            keyword: "",
            dataPie1: [],
            dataPie2: [],
            dataPie3: [],
            dataPie4: [],
            refreshing: false
        };  
    } 

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
          //this.setState({ dataLaporan:[] });            
          
          const { navigate } = this.props;
          //console.log(this.props);
          this.ProfilesData();
          //this.ListRelawanAsync();
                
        });
      }
    
    UNSAFE_componentWillUnmount() {
        this._unsubscribe();
    }

    ProfilesData = async () => {
        const { navigation } = this.props;
        try {
            const value = await AsyncStorage.getItem('@storage_Key')
            if(value !== null) {
                const datastring = JSON.parse(value);           
                //console.log("-->Profile123", datastring[0]["k_id"]);
                if(datastring.session_id != ""){
                    this.setState({                          
                          userid :datastring[0]["user_id"],
                          token :datastring[0]["token"],
                          usernama :datastring[0]["usernama"],
                          userimage: datastring[0]["user_photo"],
                          kandidat: datastring[0]["k_name"],
                          kandidat_id: datastring[0]["k_id"],
                          ishead: datastring[0]["user_ishead"],
                          userhandphone: datastring[0]["username"]
                    })                  
                }       
                this.GetDataRekap1();   
                this.GetDataRekap2();   
                this.GetDataRekap3();
                this.GetDataRekap4();
                this.GetDataRekap5();
                //this.ListRelawanAsync()     
            }
        } catch(e) {
            // error reading value
        }
        
    }

   

    GetDataRekap1 =  () => {                    
        const self = this;   
        self.setState({ dataPeriode:[], loader: true });
        const { navigation } = this.props;
        let urlapi;
        if(this.state.ishead === 1){
            urlapi = API_URL+`/elektoral1Head`
        }else{
            urlapi = API_URL+`/elektoral1`
        }
        var formData = new URLSearchParams();  
        var config = {
            method: 'get',            
            url: urlapi,                
            data : formData,
            headers: {                 
                'Authorization': 'Bearer '+ self.state.token
              },
        };
               
        axios(config)
            .then(function (response) {                     
                var ft = response.data.data;
                if(response.data.success === true){   
                    
                    let listData = [];
                    (response.data.data).forEach((items,index) =>                                          
                        self.setState({
                            jumlahpendukung: items.jumlahpendukung, 
                            jumlahtersurvey: items.jumlahtersurvey
                        })
                    )
                        
                    //console.log(JSON.stringify(self.state.jumlahpendukung));

                }else{
                    console.log("errorrrrrrrita");
                }            
        })
        .catch(function (error) {
            if (!error.response) {        
                console.log("------ERORAKTsssss"+error);
                //alert("ERROR KONEKSI: SILAHKAN COBA");
            } else {        
                this.setState({
                    loader: false,
                });
            }            
        })
        .finally((response) => {

                this.setState({
                    loader: false,
                });
        });
    
    }

    GetDataRekap2 =  () => {                    
        const self = this;   
        self.setState({ dataPeriode:[], loader: true });
        const { navigation } = this.props;
        let urlapi;
        if(this.state.ishead === 1){
            urlapi = API_URL+`/elektoral2Head`
        }else{
            urlapi = API_URL+`/elektoral2`
        }
        var formData = new URLSearchParams();  
        var config = {
            method: 'get',            
            url: urlapi,                
            data : formData,
            headers: {                 
                'Authorization': 'Bearer '+ self.state.token
              },
        };
               
        axios(config)
            .then(function (response) {                     
                var ft = response.data.data;
                if(response.data.success === true){   
                    
                    let listData = [];
                    (response.data.data).forEach((items,index) =>                                          
                        
                        self.setState({
                            dataPie2: [{
                                name: "Kenal",
                                population: items.kenal,
                                color: "#9b7355",
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            },{
                                name: "Tidak Kenal",
                                population: items.tidakkenal,
                                color: "#679484",
                                legendFontColor: "#679484",
                                legendFontSize: 15
                            }],

                            kenal :items.kenal,
                            warnakenal : "#9b7355",
                            tidakkenal : items.tidakkenal,
                            warnatidakkenal : "#679484",

                        })

                    )

                    //(JSON.stringify(self.state.dataPie2));
                
                }else{
                    console.log("errorrrrrrrita");
                }            
        })
        .catch(function (error) {
            if (!error.response) {        
                console.log("------ERORAKT"+error);
                //alert("ERROR KONEKSI: SILAHKAN COBA");
            } else {        
                this.setState({
                    loader: false,
                });
            }            
        })
        .finally((response) => {

                this.setState({
                    loader: false,
                });
        });
    
    }
    

    GetDataRekap3 =  () => {                    
        const self = this;   
        self.setState({ dataPeriode:[], loader: true });
        const { navigation } = this.props;
        let urlapi;
        if(this.state.ishead === 1){
            urlapi = API_URL+`/elektoral3Head`
        }else{
            urlapi = API_URL+`/elektoral3`
        }
        var formData = new URLSearchParams();  
        var config = {
            method: 'get',            
            url: urlapi,                
            data : formData,
            headers: {                 
                'Authorization': 'Bearer '+ self.state.token
              },
        };
               
        axios(config)
            .then(function (response) {                     
                var ft = response.data.data;
                if(response.data.success === true){   
                    
                    let listData = [];
                    (response.data.data).forEach((items,index) =>                                          
                        
                        self.setState({
                            dataPie1: [{
                                name: "Memilih",
                                population: items.memilih,
                                color: "#9b7355",
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            },
                            {
                                name: "Golput",
                                population: items.golput,
                                color: "#3e2836",
                                legendFontColor: "#3e2836",
                                legendFontSize: 15
                            },
                            {
                                name: "Tdk Memilih",
                                population: items.tidak,
                                color: "#679484",
                                legendFontColor: "#679484",
                                legendFontSize: 15
                            }],

                            memilih :items.memilih,
                            warnamemilih : "#9b7355",
                            golput : items.golput,
                            warnagolput : "#3e2836",
                            tidak : items.tidak,
                            warnatidak : "#679484"
                        })

                    )

                    //console.log(JSON.stringify(self.state.dataPie2));
                
                }else{
                    console.log("errorrrrrrrita");
                }            
        })
        .catch(function (error) {
            if (!error.response) {        
                console.log("------ERORAKT"+error);
                //alert("ERROR KONEKSI: SILAHKAN COBA");
            } else {        
                this.setState({
                    loader: false,
                });
            }            
        })
        .finally((response) => {

                this.setState({
                    loader: false,
                });
        });
    
    }

    GetDataRekap4 =  () => {                    
        const self = this;   
        self.setState({ dataPeriode:[], loader: true });
        const { navigation } = this.props;
        let urlapi;
        if(this.state.ishead === 1){
            urlapi = API_URL+`/elektoral4Head`
        }else{
            urlapi = API_URL+`/elektoral4`
        }
        var formData = new URLSearchParams();  
        var config = {
            method: 'get',            
            url: urlapi,                
            data : formData,
            headers: {                 
                'Authorization': 'Bearer '+ self.state.token
              },
        };
               
        axios(config)
            .then(function (response) {                     
                var ft = response.data.data;
                if(response.data.success === true){   
                    
                    let listData = [];
                    (response.data.data).forEach((items,index) =>                                          
                        
                        self.setState({
                            dataPie3: [{
                                name: "Emosional",
                                population: items.emosional,
                                color: "#9b7355",
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            },
                            {
                                name: "Rasional",
                                population: items.rasional,
                                color: "#3e2836",
                                legendFontColor: "#3e2836",
                                legendFontSize: 15
                            },
                            {
                                name: "Transaksional",
                                population: items.transaksional,
                                color: "#679484",
                                legendFontColor: "#679484",
                                legendFontSize: 15
                            }],

                            emosional :items.emosional,
                            warnaemosional : "#9b7355",
                            rasional : items.rasional,
                            warnarasional : "#3e2836",
                            transaksional : items.transaksional,
                            warnatransaksional : "#679484"
                        })

                    )

                    //console.log(JSON.stringify(self.state.dataPie2));
                
                }else{
                    console.log("errorrrrrrrita");
                }            
        })
        .catch(function (error) {
            if (!error.response) {        
                console.log("------ERORAKT"+error);
                //alert("ERROR KONEKSI: SILAHKAN COBA");
            } else {        
                this.setState({
                    loader: false,
                });
            }            
        })
        .finally((response) => {

                this.setState({
                    loader: false,
                });
        });
    
    }


    GetDataRekap5 =  () => {                    
        const self = this;   
        self.setState({ dataPeriode:[], loader: true });
        const { navigation } = this.props;
        let urlapi;
        if(this.state.ishead === 1){
            urlapi = API_URL+`/elektoral5Head`
        }else{
            urlapi = API_URL+`/elektoral5`
        }
        var formData = new URLSearchParams();  
        var config = {
            method: 'get',            
            url: urlapi,                
            data : formData,
            headers: {                 
                'Authorization': 'Bearer '+ self.state.token
              },
        };
               
        axios(config)
            .then(function (response) {                     
                var ft = response.data.data;
                if(response.data.success === true){   
                    //console.log("SUKAAAA", JSON.stringify(response.data.data));
                    let listData = [];
                    (response.data.data).forEach((items,index) =>                                          
                        
                        self.setState({
                            dataPie4: [{
                                name: "Suka",
                                population: items.suka,
                                color: "#9b7355",
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            },
                            {
                                name: "Tidak Suka",
                                population: items.tidaksuka,
                                color: "#3e2836",
                                legendFontColor: "#3e2836",
                                legendFontSize: 15
                            }],

                            suka :items.suka,
                            warnasuka : "#9b7355",
                            tidaksuka : items.tidaksuka,
                            warnatidaksuka : "#3e2836"
                        })

                    )

                    //console.log(JSON.stringify(self.state.dataPie4));
                
                }else{
                    console.log("errorrrrrrrita");
                }            
        })
        .catch(function (error) {
            if (!error.response) {        
                console.log("------ERORAKT"+error);
                //alert("ERROR KONEKSI: SILAHKAN COBA");
            } else {        
                this.setState({
                    loader: false,
                });
            }            
        })
        .finally((response) => {

                this.setState({
                    loader: false,
                });
        });
    
    }

    // onRefresh() {
     
    //     this.setState({isFetching: true,},() => {this.GetDataPeriode()});
    //     this.setState({ isFetching: false })        
    // }

    onRefresh = () => {

        this.setState({
          refreshing: true
        })
    
        this.ProfilesData();
    
        setTimeout(() => {
          this.setState({
            refreshing: false
          });
        }, 2000);
    
    }

    formatDate (input) {
        var datePart = input.match(/\d+/g),
        year = datePart[0].substring(2), // get only two digits
        month = datePart[1], day = datePart[2];
      
        return day+'/'+month+'/'+year;
      }

      setKeyword = (text) => {

        this.setState({
            keyword: text
        })

      }   

       goToDetail = (id) => {
            //console.log("on progress");
            
            navigation.navigate("personarelawandetail", {idrelawan : id})
        }
    
    render() {
        
        const screenWidth = Dimensions.get("window").width;

        const chartConfig = {
            backgroundGradientFrom: "#1E2923",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#08130D",
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false // optional
          };
    
        return (
            <SafeAreaView style={styles.container}>                
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor='transparent' />   
            
                { this.state.loader ?    
                <View style={{marginTop: 60}}>
                    <SkypeIndicator color='red'/>         
                </View>
                :               
                <ScrollView style={styles.container}
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                >
                <View style={{flexDirection: "row", width: "90%", borderWidth: 0,marginTop: 10, height: 70, alignSelf:"center", justifyContent: "center", alignContent: "center",}}>
                    <View style={{width: "47%", height: 70, borderWidth: 1, borderRadius: 10, borderColor: "#BFBFBF"}}>
                            <Text style={{textAlign:"center", fontFamily: "FredokaOne-Regular", color: "#FFFFFF", backgroundColor: "#2596be"}}>Total Pendukung</Text>
                            <Text style={{textAlign: "center", fontSize: 35}}>{this.state.jumlahpendukung}</Text>
                    </View>
                    <View style={{width:"3%",height: 70}}></View>
                    <View style={{width: "47%", height: 70, borderWidth: 1, borderRadius: 10, borderColor: "#BFBFBF"}}>
                    <Text style={{textAlign:"center", fontFamily: "FredokaOne-Regular", color: "#FFFFFF", backgroundColor: "#2596be"}}>Total Tervalidasi</Text>
                            <Text style={{textAlign: "center", fontSize: 35}}>{this.state.jumlahtersurvey}</Text>
                    </View>
                </View>
                <View style={{flexDirection: "row", width: "90%", borderWidth: 0,marginTop: 10, height: 100, alignSelf:"center", justifyContent: "center", alignContent: "center"}}>
                    <View style={{width: "38%", height: 100, borderWidth: 1, borderRadius: 10, borderColor: "#BFBFBF", alignSelf:"flex-start", justifyContent: "flex-start", alignItems: "flex-start"}}>
                        <PieChart
                            data={this.state.dataPie2}
                            width={screenWidth}
                            height={100}
                            style={{marginLeft: -20}}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            hasLegend={false}
                            backgroundColor={"transparent"}                                                                                
                            />
                    </View>
                    <View style={{width:"3%",height: 100}}></View>
                    <View style={{width: "60%", height: 100, borderWidth: 1, borderRadius: 10, borderColor: "#BFBFBF"}}>
                        <Text style={{textAlign:"center", fontFamily: "FredokaOne-Regular", color: "#FFFFFF", backgroundColor: "#2596be"}}>Popularitas</Text>
                            <View style={{flexDirection: "row", marginTop: 5, marginLeft: 10  }}>
                                <View style={{width: 12, height: 12, marginRight: 5, top: 4, borderRadius: 80, backgroundColor: this.state.warnakenal}}></View>
                                <Text style={{ fontWeight: this.state.kenal > this.state.tidakkenal ? "bold":"", 
                                                textDecorationLine: this.state.kenal > this.state.tidakkenal ? "underline":"" }}>Kenal = {this.state.kenal} ({(this.state.kenal/(this.state.kenal+this.state.tidakkenal) *100).toFixed(1)}%)</Text>
                            </View>
                            <View style={{flexDirection: "row", marginTop: 5, marginLeft: 10}}>
                                <View style={{width: 12, height: 12, marginRight: 5, top: 4, borderRadius: 80, backgroundColor: this.state.warnatidakkenal}}></View>
                                <Text style={{ fontWeight: this.state.kenal < this.state.tidakkenal ? "bold":"", 
                                                textDecorationLine: this.state.kenal < this.state.tidakkenal ? "underline":"" }}>Tdk Kenal = {this.state.tidakkenal} ({(this.state.tidakkenal/(this.state.kenal+this.state.tidakkenal) *100).toFixed(1)}%)</Text>
                            </View>                            
                    </View>
                </View>
                <View style={{flexDirection: "row", width: "90%", borderWidth: 0,marginTop: 10, height: 100, alignSelf:"center", justifyContent: "center", alignContent: "center",}}>
                    <View style={{width: "38%", height: 100, borderWidth: 1, borderRadius: 10, borderColor: "#BFBFBF"}}>
                        <PieChart
                            data={this.state.dataPie4}
                            width={screenWidth}
                            height={100}
                            style={{marginLeft: -20}}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            hasLegend={false}
                            backgroundColor={"transparent"}                                                    
                            absolute
                            />
                    </View>
                    <View style={{width:"3%",height: 100}}></View>
                    <View style={{width: "60%", height: 100, borderWidth: 1, borderRadius: 10, borderColor: "#BFBFBF"}}>
                        <Text style={{textAlign:"center", fontFamily: "FredokaOne-Regular", color: "#FFFFFF", backgroundColor: "#2596be"}}>Suka/Tidak Suka</Text>
                            <View style={{flexDirection: "row", marginTop: 5, marginLeft: 10  }}>
                                <View style={{width: 12, height: 12, marginRight: 5, top: 4, borderRadius: 80, backgroundColor: this.state.warnasuka}}></View>
                                <Text style={{ fontWeight: this.state.suka > this.state.tidaksuka ? "bold":"", 
                                                textDecorationLine: this.state.suka > this.state.tidaksuka ? "underline":"" }}>Suka = {this.state.suka} ({(this.state.suka/(this.state.suka+this.state.tidaksuka) *100).toFixed(0)}%)</Text>
                            </View>
                            <View style={{flexDirection: "row", marginTop: 5, marginLeft: 10}}>
                                <View style={{width: 12, height: 12, marginRight: 5, top: 4, borderRadius: 80, backgroundColor: this.state.warnatidaksuka}}></View>
                                <Text style={{ fontWeight: this.state.tidaksuka > this.state.suka  ? "bold":"", 
                                                textDecorationLine: this.state.tidaksuka > this.state.suka ? "underline":"" }}>Tdk Suka = {this.state.tidaksuka} ({(this.state.tidaksuka/(this.state.suka+this.state.tidaksuka) *100).toFixed(0)}%) </Text>
                            </View>                            
                    </View>
                </View>  
                <View style={{flexDirection: "row", width: "90%", borderWidth: 0,marginTop: 10, height: 100, alignSelf:"center", justifyContent: "center", alignContent: "center",}}>
                    <View style={{width: "38%", height: 100, borderWidth: 1, borderRadius: 10, borderColor: "#BFBFBF"}}>
                        <PieChart
                            data={this.state.dataPie1}
                            width={screenWidth}
                            height={100}
                            style={{marginLeft: -20}}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            hasLegend={false}
                            backgroundColor={"transparent"}                                                    
                            absolute
                            />
                    </View>
                    <View style={{width:"3%",height: 100}}></View>
                    <View style={{width: "60%", height: 100, borderWidth: 1, borderRadius: 10, borderColor: "#BFBFBF"}}>
                        <Text style={{textAlign:"center", fontFamily: "FredokaOne-Regular", color: "#FFFFFF", backgroundColor: "#2596be"}}>Elektabilitas</Text>
                            <View style={{flexDirection: "row", marginTop: 5, marginLeft: 10  }}>
                                <View style={{width: 12, height: 12, marginRight: 5, top: 4, borderRadius: 80, backgroundColor: this.state.warnamemilih}}></View>
                                <Text style={{ fontWeight: this.state.memilih > (this.state.golput||this.state.tidak) ? "bold":"", 
                                                textDecorationLine: this.state.memilih > (this.state.golput||this.state.tidak) ? "underline":"" }}>Memilih = {this.state.memilih} ({(this.state.memilih/(this.state.memilih+this.state.golput+this.state.tidak) *100).toFixed(0)}%)</Text>
                            </View>
                            <View style={{flexDirection: "row", marginTop: 5, marginLeft: 10}}>
                                <View style={{width: 12, height: 12, marginRight: 5, top: 4, borderRadius: 80, backgroundColor: this.state.warnatidak}}></View>
                                <Text style={{ fontWeight: this.state.tidak > (this.state.memilih||this.state.golput) ? "bold":"", 
                                                textDecorationLine: this.state.tidak > (this.state.memilih||this.state.golput) ? "underline":"" }}>Tdk Memilih = {this.state.tidak} ({(this.state.tidak/(this.state.memilih+this.state.golput+this.state.tidak) *100).toFixed(0)}%) </Text>
                            </View>
                            <View style={{flexDirection: "row", marginTop: 5, marginLeft: 10}}>
                                <View style={{width: 12, height: 12, marginRight: 5, top: 4, borderRadius: 80, backgroundColor: this.state.warnagolput}}></View>
                                <Text style={{ fontWeight: this.state.golput > (this.state.memilih||this.state.tidak) ? "bold":"", 
                                                textDecorationLine: this.state.golput > (this.state.memilih||this.state.tidak) ? "underline":"" }}>Golput = {this.state.golput} ({(this.state.golput/(this.state.memilih+this.state.golput+this.state.tidak) *100).toFixed(0)}%)</Text>
                            </View>
                    </View>
                </View>     
                <View style={{flexDirection: "row", width: "90%", borderWidth: 0,marginTop: 10, height: 100, alignSelf:"center", justifyContent: "center", alignContent: "center",}}>
                    <View style={{width: "38%", height: 100, borderWidth: 1, borderRadius: 10, borderColor: "#BFBFBF"}}>
                        <PieChart
                            data={this.state.dataPie3}
                            width={screenWidth}
                            height={100}
                            style={{marginLeft: -20}}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            hasLegend={false}
                            backgroundColor={"transparent"}                                                    
                            absolute
                            />
                    </View>
                    <View style={{width:"3%",height: 100}}></View>
                    <View style={{width: "60%", height: 100, borderWidth: 1, borderRadius: 10, borderColor: "#BFBFBF"}}>
                        <Text style={{textAlign:"center", fontFamily: "FredokaOne-Regular", color: "#FFFFFF", backgroundColor: "#2596be"}}>Type Pemilih</Text>
                            <View style={{flexDirection: "row", marginTop: 5, marginLeft: 10  }}>
                                <View style={{width: 12, height: 12, marginRight: 5, top: 4, borderRadius: 80, backgroundColor: this.state.warnaemosional}}></View>
                                <Text style={{ fontWeight: this.state.emosional > (this.state.rasional||this.state.transaksional) ? "bold":"",
                                                 textDecorationLine: this.state.emosional > (this.state.rasional||this.state.transaksional) ? "underline":"" }}>Emosional = {this.state.emosional} ({(this.state.emosional/(this.state.emosional+this.state.rasional+this.state.transaksional) *100).toFixed(0)}%)</Text>
                            </View>
                            <View style={{flexDirection: "row", marginTop: 5, marginLeft: 10}}>
                                <View style={{width: 12, height: 12, marginRight: 5, top: 4, borderRadius: 80, backgroundColor: this.state.warnarasional}}></View>
                                <Text style={{ fontWeight: this.state.rasional > (this.state.emosional||this.state.transaksional) ? "bold":"", 
                                                textDecorationLine: this.state.rasional > (this.state.emosional||this.state.transaksional) ? "underline":"" }}>Rasional = {this.state.rasional} ({(this.state.rasional/(this.state.emosional+this.state.rasional+this.state.transaksional) *100).toFixed(0)}%)</Text>
                            </View>
                            <View style={{flexDirection: "row", marginTop: 5, marginLeft: 10}}>
                                <View style={{width: 12, height: 12, marginRight: 5, top: 4, borderRadius: 80, backgroundColor: this.state.warnatransaksional}}></View>
                                <Text style={{ fontWeight: this.state.transaksional > (this.state.rasional||this.state.emosional) ? "bold":"",
                                                textDecorationLine: this.state.transaksional > (this.state.emosional||this.state.rasional) ? "underline":"" }}>Transaksi = {this.state.transaksional} ({(this.state.transaksional/(this.state.emosional+this.state.rasional+this.state.transaksional) *100).toFixed(0)}%)</Text>
                            </View>
                    </View>
                </View>                             
                </ScrollView>
                }
                        
            </SafeAreaView>

        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
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