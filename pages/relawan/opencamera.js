import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity, Image, SafeAreaView, StatusBar
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Icon } from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Takecamerasurvey extends Component {

    constructor(props, route) {
        super(props);
        this.state = {
            assetid: "",
            itemdetail: "",
            typeflow: ""
        }
    }
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            const { idkec, idkel, idperiode } = this.props.route.params;
            this.setState({
                kecamatan: idkec,
                kelurahan: idkel,
                periode_id: idperiode
            })
            console.log("==--===--", idkec);
        });
    }


    takePicture = async () => {

        const storeDataKamera = async (value) => {
            try {
                await AsyncStorage.setItem('@storage_Kamera_Key', JSON.stringify(value))
            } catch (e) {
                // saving error
            }
        }

        if (this.camera) {
            const options = {
                quality: 0.5, base64: true, width: 720, 
                flashMode: RNCamera.Constants.FlashMode.auto,
                flash: 'auto',
                fixOrientation: true,
                showFlashOptions: true,
                type: RNCamera.Constants.Type.back
            };
            const data = await this.camera.takePictureAsync(options);
            const assetsrender = {
                img: data.uri,
                ibase64: data.base64,
                idkec: this.state.kecamatan,
                idkel: this.state.kelurahan
            }
            storeDataKamera(assetsrender);
            this.props.navigation.navigate("DashboardNavigator", {screen :"surveyinput", params:{idperiode: this.state.periode_id}})             
        }
    };

    takeimagegallery = async () => {
        const storeDataKamera = async (value) => {
            try {
                await AsyncStorage.setItem('@storage_Kamera_Key', JSON.stringify(value))
            } catch (e) {
                // saving error
            }
        }
        const options = {
                mediaType: 'photo', includeBase64: true, cameraType: 'back', maxWidth: 720 
        };
        
        const result = await launchImageLibrary(options);        
        const assetsrender = {
            img: result.assets[0].uri,
            ibase64: result.assets[0].base64,
            idkec: this.state.kecamatan,
            idkel: this.state.kelurahan
        }
        storeDataKamera(assetsrender);
        //console.log("--->"+JSON.stringify(result.assets[0].uri));  //<---- HERE!
        this.props.navigation.navigate("DashboardNavigator", {screen :"surveyinput", params:{idperiode: this.state.periode_id}})              
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        const { navigation } = this.props;        
        return (
            <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor='transparent' />
            <View style={{ flex: 1 }}>

                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }} 
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    showFlashOptions= {true}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel', 
                    }}
                />
                <TouchableOpacity onPress={() => navigation.goBack()} style={{
                    flex: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 5,
                    position: 'absolute',
                    left: '80%',
                    top: '3%',
                }}>
                
                    <Image source={require('../../assets/images/closecamera.png')} style={{
                        width: 64,
                        height: 64,
                    }} ></Image>
                

                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.takeimagegallery()} style={{
                    flex: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 5,
                    position: 'absolute',
                    left: '10%',
                    bottom: 25,
                }}>
                
                    <Icon name="image" type="font-awesome" size={30} color="#ffffff"></Icon>
                

                </TouchableOpacity>
                
                <View style={{
                    flex: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 5,
                    position: 'absolute',
                    left: '45%',
                    bottom: 20,
                }}>
                    <TouchableOpacity onPress={this.takePicture.bind(this)}>

                        <Image source={require('../../assets/images/camera.png')} style={{
                            width: 40,
                            height: 40,
                        }}></Image>

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
        backgroundColor: "#F1F4F6",
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

});
export default Takecamerasurvey;