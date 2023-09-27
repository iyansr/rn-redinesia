import React, {useState} from 'react';
import {
  createStackNavigator,
  HeaderBackButton,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {
  TouchableOpacity,
  Button,
  View,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import home from '../pages/dashboard/home';
import editprofile from '../pages/dashboard/editprofile';
import Opencamera from '../pages/report/opencamera';
import newreg from '../pages/relawan/newreg';
import detil from '../pages/relawan/detil';
import detilappr from '../pages/relawan/detailrelawan';
import detaillap from '../pages/report/detail';
import calegview from '../pages/report/calegview';
import calegviewtandem from '../pages/tandem/calegview';
import personarelawandetail from '../pages/report/detailpersonal';
import personapendukungdetail from '../pages/report/detailpendukung';
import listrekrutan from '../pages/report/listrekrutan';
import surveyMonitor from '../pages/monitor/survey';
import surveydetail from '../pages/monitor/surveymonitor';
import relawanlist from '../pages/front/relawan';
import inputsurvey from '../pages/relawan/inputsurvey';
import fotosurvey from '../pages/relawan/opencamera';
import listsurvey from '../pages/relawan/listsurvey';
import detaildatasurvey from '../pages/relawan/surveydetail';
import inputevent from '../pages/event/inputevent';
import editevent from '../pages/event/editevent';
import getlocation from '../pages/event/getLocation';
import register from '../pages/rekrut/register';
import registerdpt from '../pages/rekrut/registerdpt';
import bukakamera from '../pages/rekrut/opencamera';
import buktifoto from '../pages/rekrut/buktifoto';
import listrekrut from '../pages/rekrut/listrekrut';
//import editrekrut from '../pages/rekrut/editrekrut';
import editrekrutdata from '../pages/rekrut/editdata';
import editdataprofile from '../pages/dashboard/editdata';
import editfotoprofile from '../pages/dashboard/opencamera';
import detailrekrut from '../pages/rekrut/detailrekrut';
import Listqc from '../pages/qctps/listqc';
import Inputqc from '../pages/qctps/inputqc';
import Editqc from '../pages/qctps/editqc';
import fotoqc from '../pages/qctps/opencamera';
import BroadcastList from '../pages/broadcast/listbroadcast';
import broadcasting from '../pages/broadcast/broadcasting';
import ImageBroadcast from '../pages/broadcast/opencamera';
import ListBuzz from '../pages/buzz/list';
import AddBuzz from '../pages/buzz/add';
import DetailBuzz from '../pages/buzz/detail';
import DetailDataBuzz from '../pages/buzz/detaildata';
import listtandem from '../pages/tandem/list';
import tandemOverview from '../pages/tandem/Overview';
import periode from '../pages/relawan/periode';
import periodeelektoral from '../pages/dashboard/periode';
import Laporkan from '../pages/report/laporkan';
import rekapelektoral from '../pages/elektoral/rekap';
import listinbox from '../pages/inbox/list';
import Detailurl from '../pages/inbox/detailurl';
import RekapPemilu from '../pages/dashboard/rekappemilu';
// import Rewards from '../pages/rewards/index';

import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

const DashboardNavigatorStack = createStackNavigator();

const HeaderLeft = () => {
  const navigation = useNavigation();
  return (
    <View style={{paddingHorizontal: 16, marginTop: 12}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          borderColor: 'white',
          width: 30,
          height: 30,
        }}>
        <Icon
          name="arrow-left"
          type="font-awesome-5"
          size={20}
          color="#f59e0b"
        />
      </TouchableOpacity>
    </View>
  );
};

export default function DashboardNavigator({navigation}) {
  const [isdpt, setIsDpt] = useState(0);

  ProfilesData = async () => {
    const value = await AsyncStorage.getItem('@DPT_ENABLED');
    //console.log(value);
    setIsDpt(value);
  };

  ProfilesData();

  return (
    <DashboardNavigatorStack.Navigator>
      <DashboardNavigatorStack.Screen
        name="home"
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#040493',
            height: 30,
          },
          headerLeft: props => {
            //return <Text style={{color: "white", marginLeft: 10, fontSize: 30, fontWeight: 'bold', fontFamily: 'sans-serif-condensed'}}>BESTPARKING</Text>;
            // <View style={{flexDirection: 'row', width: '20%', justifyContent: 'flex-start'}}>
            //     <Image source={require('../assets/images/logo.png')} style={{width: 200, height: 45, marginLeft: 15, top: 5}} />
            // </View>
            return null;
          },
          headerRight: () => {
            // <View style={{flexDirection: 'row', width: '100%', justifyContent: 'flex-end'}}>
            // <TouchableOpacity onPress={() => navigation.navigate('profile')} style={{marginRight: 20, borderWidth: 1, borderColor: 'white',borderRadius: 10, width: 30, height: 30}}>
            // <Icon name="user" type="font-awesome" size={20} color="#f59e0b" style={{top: 3}} />
            // </TouchableOpacity>
            {
              /* <TouchableOpacity onPress={() => navigation.navigate('profile')} style={{borderWidth: 1, borderColor: 'white',borderRadius: 10, width: 30, height: 30}}>
                            <Icon name="power-off" type="font-awesome" size={20} color="#f59e0b" style={{top: 3}}/>
                        </TouchableOpacity> */
            }
            {
              /* </View> */
            }
            return null;
          },
          headerTitle: () => {
            return null;
          },
        }}
        component={home}
      />
      <DashboardNavigatorStack.Screen
        name="editprofile"
        options={{
          title: 'Edit Data',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={editprofile}
      />
      <DashboardNavigatorStack.Screen
        name="opencamera"
        options={{
          title: 'Ambil Gambar',
          headerStyle: {
            backgroundColor: '#040493',
          },

          headerTitleAlign: 'center',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        component={Opencamera}
      />

      <DashboardNavigatorStack.Screen
        name="newreg"
        options={{
          title: 'Registrasi Baru Relawan',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={newreg}
      />

      <DashboardNavigatorStack.Screen
        name="detil"
        options={{
          title: 'Detail Relawan',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('newreg')}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                  }}>
                  <Icon
                    name="arrow-left"
                    type="font-awesome-5"
                    size={20}
                    color="#f59e0b"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
            //return null;
          },

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={detil}
      />
      <DashboardNavigatorStack.Screen
        name="detail"
        options={{
          title: 'Detail Laporan',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={detaillap}
      />
      <DashboardNavigatorStack.Screen
        name="surveyMonitor"
        options={{
          title: 'Monitor',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={surveyMonitor}
      />

      <DashboardNavigatorStack.Screen
        name="surveydetil"
        options={{
          title: 'Detail Laporan Relawan',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={surveydetail}
      />
      <DashboardNavigatorStack.Screen
        name="calegview"
        options={{
          title: 'Laporan Untuk Caleg',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={calegview}
      />
      <DashboardNavigatorStack.Screen
        name="calegviewtandem"
        options={{
          title: 'Laporan Tandem',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={calegviewtandem}
      />
      <DashboardNavigatorStack.Screen
        name="relawanlist"
        options={{
          title: 'Relawan Referral',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={relawanlist}
      />
      <DashboardNavigatorStack.Screen
        name="personarelawandetail"
        options={{
          title: 'Detail Relawan Referral',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={personarelawandetail}
      />
      <DashboardNavigatorStack.Screen
        name="listrekrutan"
        options={{
          title: 'List Rekrut',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={listrekrutan}
      />
      <DashboardNavigatorStack.Screen
        name="personapendukungdetail"
        options={{
          title: 'Detail Pendukung',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={personapendukungdetail}
      />
      <DashboardNavigatorStack.Screen
        name="detilappr"
        options={{
          title: 'Detail Relawan',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('relawanlist')}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                  }}>
                  <Icon
                    name="arrow-left"
                    type="font-awesome-5"
                    size={20}
                    color="#f59e0b"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
            //return null;
          },

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={detilappr}
      />
      <DashboardNavigatorStack.Screen
        name="surveyinput"
        options={{
          title: 'Survey Pendukung',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: props => {
            // return <View style={{flexDirection: 'row', width: '100%', justifyContent: 'flex-end'}}>
            //     <TouchableOpacity onPress={() => navigation.goBack()} style={{borderWidth: 1, borderColor: 'white',borderRadius: 10, width: 30, height: 30}}>
            //         <Icon name="arrow-left" type="font-awesome-5" size={20} color="#f59e0b" style={{top: 3}}/>
            //     </TouchableOpacity>
            // </View>
            return null;
          },

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={inputsurvey}
      />
      <DashboardNavigatorStack.Screen
        name="fotosurvey"
        options={{
          title: 'Ambil Gambar',
          headerStyle: {
            backgroundColor: '#040493',
          },

          headerTitleAlign: 'center',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        component={fotosurvey}
      />
      <DashboardNavigatorStack.Screen
        name="listsurvey"
        options={{
          title: 'List Survey Relawan',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerRight: props => {
            // return <View style={{flexDirection: 'row', width: '100%', justifyContent: 'flex-end'}}>
            //         <TouchableOpacity onPress={() => navigation.navigate("surveyinput")} style={{borderWidth: 1, borderColor: 'white',borderRadius: 10, width: 30, height: 30, marginRight: 20}}>
            //             <Icon name="plus" type="font-awesome-5" size={20} color="#f59e0b" style={{top: 3}}/>
            //         </TouchableOpacity>
            //     </View>
            return null;
          },
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={listsurvey}
      />

      <DashboardNavigatorStack.Screen
        name="detailsurveyperuser"
        options={{
          title: 'Detail Survey',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={detaildatasurvey}
      />

      <DashboardNavigatorStack.Screen
        name="inputevent"
        options={{
          title: 'Input Aktifitas/Event',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={inputevent}
      />
      <DashboardNavigatorStack.Screen
        name="editevent"
        options={{
          title: 'Edit Aktifitas/Event',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={editevent}
      />
      <DashboardNavigatorStack.Screen
        name="getlocation"
        options={{
          title: 'Info Lokasi Aktifitas/Event',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={getlocation}
      />

      <DashboardNavigatorStack.Screen
        name="listrekrut"
        options={{
          title: 'List Rekrut Pendukung',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerRight: props => {
            return null;
            // <View style={{flexDirection: 'row', width: '100%', justifyContent: 'flex-end'}}>
            //       <TouchableOpacity onPress={() => isdpt > 0 ? navigation.navigate("rekrutdpt") : navigation.navigate("rekrut")} style={{borderWidth: 1, borderColor: 'white',borderRadius: 10, width: 30, height: 30, marginRight: 20}}>
            //           <Icon name="plus" type="font-awesome-5" size={20} color="#f59e0b" style={{top: 3}}/>
            //       </TouchableOpacity>
            //   </View>
          },
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={listrekrut}
      />
      <DashboardNavigatorStack.Screen
        name="editrekrutdata"
        options={{
          title: 'Edit Data Pendukung',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('listrekrut')}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                  }}>
                  <Icon
                    name="arrow-left"
                    type="font-awesome-5"
                    size={20}
                    color="#f59e0b"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
            //return null;
          },
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={editrekrutdata}
      />
      <DashboardNavigatorStack.Screen
        name="detailrekrut"
        options={{
          title: 'Data Pendukung',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('listrekrut')}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                  }}>
                  <Icon
                    name="arrow-left"
                    type="font-awesome-5"
                    size={20}
                    color="#f59e0b"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
            //return null;
          },
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={detailrekrut}
      />
      <DashboardNavigatorStack.Screen
        name="rekrut"
        options={{
          title: 'Rekrut Pendukung',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('listrekrut')}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                  }}>
                  <Icon
                    name="arrow-left"
                    type="font-awesome-5"
                    size={20}
                    color="#f59e0b"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
            //return null;
          },

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={register}
      />

      <DashboardNavigatorStack.Screen
        name="rekrutdpt"
        options={{
          title: 'Rekrut Pendukung',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('listrekrut')}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                  }}>
                  <Icon
                    name="arrow-left"
                    type="font-awesome-5"
                    size={20}
                    color="#f59e0b"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
            //return null;
          },

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={registerdpt}
      />

      <DashboardNavigatorStack.Screen
        name="bukakamerarekrut"
        options={{
          title: 'Foto Pendukung',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={bukakamera}
      />
      <DashboardNavigatorStack.Screen
        name="buktifoto"
        options={{
          title: 'Foto Pendukung',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={buktifoto}
      />
      <DashboardNavigatorStack.Screen
        name="listqc"
        options={{
          title: 'Quick Count TPS',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerRight: props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('inputqc')}
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
                    color="#f59e0b"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
          },
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={Listqc}
      />
      <DashboardNavigatorStack.Screen
        name="inputqc"
        options={{
          title: 'Input Quick Count TPS',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={Inputqc}
      />
      <DashboardNavigatorStack.Screen
        name="editqc"
        options={{
          title: 'Edit Quick Count TPS',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={Editqc}
      />
      <DashboardNavigatorStack.Screen
        name="fotoqc"
        options={{
          title: 'Ambil Gambar REKAP QC TPS',
          headerStyle: {
            backgroundColor: '#040493',
          },

          headerTitleAlign: 'center',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        component={fotoqc}
      />
      <DashboardNavigatorStack.Screen
        name="Broadcastlist"
        options={{
          title: 'Broadcast List',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerRight: props => {
            // return <View style={{flexDirection: 'row', width: '100%', justifyContent: 'flex-end'}}>
            //           <TouchableOpacity onPress={() => navigation.navigate("sendbroadcast", {idfrom: "list"})} style={{borderWidth: 1, borderColor: 'white',borderRadius: 10, width: 30, height: 30, marginRight: 20}}>
            //               <Icon name="plus" type="font-awesome-5" size={20} color="#f59e0b" style={{top: 3}}/>
            //           </TouchableOpacity>
            //       </View>
            return null;
          },
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={BroadcastList}
      />
      <DashboardNavigatorStack.Screen
        name="imagebroadcast"
        options={{
          title: 'Gambar Untuk Broadcast',
          headerStyle: {
            backgroundColor: '#040493',
          },

          headerTitleAlign: 'center',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        component={ImageBroadcast}
      />
      <DashboardNavigatorStack.Screen
        name="sendbroadcast"
        options={{
          title: 'Kirim Pesan Broadcast',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={broadcasting}
      />
      <DashboardNavigatorStack.Screen
        name="listbuzz"
        options={{
          title: 'List Buzz',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          // headerRight : (props) => {
          //     return <View style={{flexDirection: 'row', width: '100%', justifyContent: 'flex-end'}}>
          //               <TouchableOpacity onPress={() => navigation.navigate("addbuzz")} style={{borderWidth: 1, borderColor: 'white',borderRadius: 10, width: 30, height: 30, marginRight: 20}}>
          //                   <Icon name="plus" type="font-awesome-5" size={20} color="#f59e0b" style={{top: 3}}/>
          //               </TouchableOpacity>
          //           </View>
          //     },

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={ListBuzz}
      />
      <DashboardNavigatorStack.Screen
        name="addbuzz"
        options={{
          title: 'Tambah Data Buzz',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerRight: null,
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={AddBuzz}
      />

      <DashboardNavigatorStack.Screen
        name="detailbuzz"
        options={{
          title: 'Berita',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerRight: null,
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={DetailBuzz}
      />
      <DashboardNavigatorStack.Screen
        name="detaildatabuzz"
        options={{
          title: 'Detail Berita',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerRight: null,
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={DetailDataBuzz}
      />

      <DashboardNavigatorStack.Screen
        name="listtandem"
        options={{
          title: 'List Tandem',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('DashboardBottomNavigator', {
                      screen: 'home',
                    })
                  }
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                  }}>
                  <Icon
                    name="arrow-left"
                    type="font-awesome-5"
                    size={20}
                    color="#f59e0b"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
            //return null;
          },
          headerRight: null,
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={listtandem}
      />
      <DashboardNavigatorStack.Screen
        name="tandemoverview"
        options={{
          title: 'Overview Tandem',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('listtandem')}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    width: 30,
                    height: 30,
                  }}>
                  <Icon
                    name="arrow-left"
                    type="font-awesome-5"
                    size={20}
                    color="#f59e0b"
                    style={{top: 3}}
                  />
                </TouchableOpacity>
              </View>
            );
            //return null;
          },
          headerRight: null,
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={tandemOverview}
      />
      <DashboardNavigatorStack.Screen
        name="periode"
        options={{
          title: 'Periode Survey',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerRight: null,
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={periode}
      />
      <DashboardNavigatorStack.Screen
        name="periodeelektoral"
        options={{
          title: 'Periode Survey',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerRight: null,
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={periodeelektoral}
      />
      <DashboardNavigatorStack.Screen
        name="laporkan"
        options={{
          title: 'Laporkan Konten',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerRight: null,
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={Laporkan}
      />

      <DashboardNavigatorStack.Screen
        name="editdataprofile"
        options={{
          title: 'Edit Data Profile',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,
          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={editdataprofile}
      />

      <DashboardNavigatorStack.Screen
        name="bukakameraprofile"
        options={{
          title: 'Edit Foto Profile',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={editfotoprofile}
      />
      <DashboardNavigatorStack.Screen
        name="rekapelektoral"
        options={{
          title: 'Rekap Elektoral (Survey)',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={rekapelektoral}
      />
      <DashboardNavigatorStack.Screen
        name="listinbox"
        options={{
          title: 'Inbox',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={listinbox}
      />
      <DashboardNavigatorStack.Screen
        name="detailurlinbox"
        options={{
          title: 'Detail Inbox',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={Detailurl}
      />

      <DashboardNavigatorStack.Screen
        name="rekappemilu"
        options={{
          title: 'REKAP PEMILU 2019',
          headerShown: true,
          gestureEnabled: false,
          headerTintColor: '#4F4F4F',
          headerTitleAlign: 'center',
          headerLeft: HeaderLeft,

          headerTitleStyle: {
            color: '#4F4F4F',
            fontFamily: 'TitilliumWeb-Regular',
          },
        }}
        component={RekapPemilu}
      />
    </DashboardNavigatorStack.Navigator>
  );
}
