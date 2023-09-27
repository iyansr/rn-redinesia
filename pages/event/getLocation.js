import React, { Component } from 'react'
import { Text, SafeAreaView, View, StyleSheet, StatusBar, Dimensions, TextInput, TouchableOpacity, Image, ScrollView, Focus } from 'react-native'
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import GetLocation from 'react-native-get-location'
import BtnStandard from '../component/BtnStandard';
import Geocoder from 'react-native-geocoding';
import { Icon } from 'react-native-elements';


export default class EventLocationScreen extends Component {

    constructor(props: Props) {  
        super(props);  
        this.state = {  
            lat: '-6.4158345',
            long: '106.8213416',
            marker : {"latitude": -6.180250912402649, "longitude": 106.82137794792652}
        };  
    } 

  componentDidMount() {        
    this._unsubscribe = this.props.navigation.addListener('focus', () => {      
        this.getLocation();
        //this.geocodeMaps();
    });
  }

  geocodeMaps = (lat,long) => {

    Geocoder.init("AIzaSyDTCvfHm-Fw1n_PIpbe2tVh7f8E863cw6g"); // use a valid API key
    Geocoder.from({latitude: lat , longitude: long})
        .then(json => {
                var addressComponent = json.results[0].address_components[0];
                //console.log("TESTLOC",JSON.stringify(json));
        })
        .catch(error => console.warn(error));        
  }

  getLocation = async () => {

       await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
        .then(location => {
            //console.log("--->LOVV",location);
            this.setState({
                long: location.longitude,
                lat: location.latitude,
                marker : {"latitude": location.latitude, "longitude" : location.longitude}
            })

            //this.geocodeMaps(location.latitude, location.longitude);
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })

  }


  getMarkingLocation = (markerposition) => {

    //console.log("MARKINGLOC", markerposition["latitude"]);

    this.setState({marker : markerposition})
    this.geocodeMaps(markerposition["latitude"], markerposition["longitude"]);

  }

  GetDataProvince =  () => {        
        
    this.setState({
       selectProvince: []            
   });
   
   const self = this;
   const { navigation } = this.props;
   var formData = new URLSearchParams();  
   var config = {
       method: 'get',            
       url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=`+keyword+`&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=AIzaSyDTCvfHm-Fw1n_PIpbe2tVh7f8E863cw6g`,                
       data : formData,
       headers: {             
           'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==', 
         },
   };
   
   axios(config)
       .then(function (response) {     
           //console.log("---->PROVINCE"+JSON.stringify(response.data.data));                           
           let ft = [];
           if(response.data.success === true){   
               var objmaps64 = {};
               self.setState({
                   selectProvince: []            
               });
               (response.data.data).map((items,index) => {
                   index = index+1;
                   //console.log(">>>>>>ddd",index+"-"+items["prov_id"]+"-"+items["prov_name"]);
                   //if(index>0){
                       self.state.selectProvince[items['prov_id']] =  items['prov_name'];
                   //}
               });

               // self.setState({
               //     selectProvince: [...self.state.selectProvince.filter(function (e) {return e != null;})]
               // });
               
               //console.log("+++++++ssss"+JSON.stringify(self.state.selectProvince));
           
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

  render() {

        return(
            <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor='transparent' />                
            <View style={{flex: 1, justifyContent: 'center'}}>
                <MapView                    
                    //style={styles.map}
                    style={{ minHeight: Dimensions.get('window').height }}
                    provider={PROVIDER_GOOGLE}                            
                    region={{
                        latitude: parseFloat(this.state.lat),
                        longitude: parseFloat(this.state.long),
                        latitudeDelta: 0.0008,
                        longitudeDelta: 0.0007                        
                    }}
                    onPress={(e) => this.getMarkingLocation(e.nativeEvent.coordinate) } >
                    <Marker coordinate = {this.state.marker}
                        pinColor = {"red"} // any color
                        title="Posisi Acara :"
                        description="Klik Pada Map Lokasi Tempat Acara Event"/>
                    
                </MapView>      
            </View>
            <View style={{flexDirection:'row', width: "100%", alignSelf: "center", marginBottom: 30}}>
                <View style={{width: "100%", flexDirection:"row", justifyContent: "center"}}>
                    <TextInput style={styles.usernameInput}></TextInput>
                    <TouchableOpacity style={{marginLeft: 10, marginTop: 10}}>
                        <Icon name='search' type='font-awesome' color={"red"} />
                    </TouchableOpacity>
                </View>                
            </View>
        </SafeAreaView>
    )

  }

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    usernameInput: {         
        height: 40,
        backgroundColor: '#FFFFFF',        
        color: 'black',        
        borderWidth: 1,
        alignSelf: "center",
        justifyContent: "center",
        alignContent: "center",
        borderColor: '#828282',
        borderRadius: 8,        
        width: "80%"        
    },
})