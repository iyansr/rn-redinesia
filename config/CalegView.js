import * as React from 'react';
import {View, useWindowDimensions, Text, TouchableOpacity} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import Overview from '../pages/report/Overview';
import DataCaleg from '../pages/report/Data';
import Listrelawan from '../pages/report/Listrelawan';
import Listpendukung from '../pages/report/Listpendukung';
import {Icon} from 'react-native-elements';

const FirstRoute = props => {
  const {route} = props;
  // <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
  return <Overview />;
};

const SecondRoute = () => (
  // <View style={{ flex: 1, backgroundColor: 'white' }} />
  <Listrelawan />
);
const ThirdRoute = props => {
  const navigation = useNavigation();
  const {route} = props;
  if (route.ishead === 1) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Data Lengkap Ada di Menu Tandem</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DashboardNavigator', {screen: 'listtandem'})
          }>
          <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
            Ke Menu Tandem
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return <Listrelawan navigation={navigation} />;
  }
  // <View style={{ flex: 1, backgroundColor: 'white' }} />
};
const FourthRoute = props => {
  // <View style={{ flex: 1, backgroundColor: 'white' }} />
  const navigation = useNavigation();
  const {route} = props;
  if (route.ishead === 1) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Data Lengkap Ada di Menu Tandem</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DashboardNavigator', {screen: 'listtandem'})
          }>
          <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
            Ke Menu Tandem
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return <Listpendukung navigation={navigation} />;
  }
};

const FifthRoute = props => {
  // const navigation = useNavigation();
  const navigation = useNavigation();
  const {route} = props;
  if (route.ishead === 1) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Data Lengkap Ada di Menu Tandem</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DashboardNavigator', {screen: 'listtandem'})
          }>
          <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
            Ke Menu Tandem
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return <DataCaleg />;
  }
};
const SixthRoute = () => <View style={{flex: 1, backgroundColor: 'white'}} />;

const getTabBarIcon = props => {
  const {route, focus} = props;
  if (route.key === 'first') {
    return <Icon type="font-awesome-5" name="heart" color="white" />;
  } else if (route.key === 'second') {
    return <Icon type="font-awesome-5" name="trophy" color="white" />;
  } else if (route.key === 'third') {
    return <Icon type="font-awesome-5" name="user-friends" color="white" />;
  } else if (route.key === 'fourth') {
    return <Icon type="font-awesome-5" name="user-check" color="white" />;
  } else if (route.key === 'fifth') {
    return <Icon type="font-awesome-5" name="chart-pie" color="white" />;
  }

  // else if (route.key === 'sixth') {
  //   return <Icon type="font-awesome-5" name='whatsapp' color='white' />
  // }
};

const getTabBarLabel = props => {
  const {route, focused} = props;
  if (route.key === 'first') {
    if (focused) {
      return (
        <Text style={{color: 'yellow', fontSize: 13, textAlign: 'center'}}>
          Overview
        </Text>
      );
    } else {
      return (
        <Text style={{color: '#FFFFFF', fontSize: 13, textAlign: 'center'}}>
          Overview
        </Text>
      );
    }
  } else if (route.key === 'second') {
    if (focused) {
      return (
        <Text style={{color: 'yellow', fontSize: 13, textAlign: 'center'}}>
          Target
        </Text>
      );
    } else {
      return (
        <Text style={{color: '#FFFFFF', fontSize: 13, textAlign: 'center'}}>
          Target
        </Text>
      );
    }
  } else if (route.key === 'third') {
    if (focused) {
      return (
        <Text style={{color: 'yellow', fontSize: 13, textAlign: 'center'}}>
          Relawan
        </Text>
      );
    } else {
      return (
        <Text style={{color: '#FFFFFF', fontSize: 13, textAlign: 'center'}}>
          Relawan
        </Text>
      );
    }
  } else if (route.key === 'fourth') {
    if (focused) {
      return (
        <Text style={{color: 'yellow', fontSize: 13, textAlign: 'center'}}>
          Pendukung
        </Text>
      );
    } else {
      return (
        <Text style={{color: '#FFFFFF', fontSize: 13, textAlign: 'center'}}>
          Pendukung
        </Text>
      );
    }
  } else if (route.key === 'fifth') {
    if (focused) {
      return (
        <Text style={{color: 'yellow', fontSize: 13, textAlign: 'center'}}>
          Data
        </Text>
      );
    } else {
      return (
        <Text style={{color: '#FFFFFF', fontSize: 13, textAlign: 'center'}}>
          Data
        </Text>
      );
    }
  } else if (route.key === 'sixth') {
    if (focused) {
      return (
        <Text style={{color: 'yellow', fontSize: 13, textAlign: 'center'}}>
          Pesan
        </Text>
      );
    } else {
      return (
        <Text style={{color: '#FFFFFF', fontSize: 13, textAlign: 'center'}}>
          Pesan
        </Text>
      );
    }
  }
};

const VTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor: 'white'}}
    renderIcon={props => getTabBarIcon(props)}
    renderLabel={props => getTabBarLabel(props)}
    style={{backgroundColor: '#f59e0b'}}
    tabStyle={{width: 100}}
    labelStyle={{textAlign: 'center'}}
    scrollEnabled={true}
    bounces={true}
  />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
  fourth: FourthRoute,
  fifth: FifthRoute,
  //sixth: SixthRoute
});

export default function TabViewExample({route}) {
  const layout = useWindowDimensions();

  const {ishead} = route.params;
  console.log('--->', ishead);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first'},
    // { key: 'second' },
    {key: 'third', ishead: ishead},
    {key: 'fourth', ishead: ishead},
    {key: 'fifth', ishead: ishead},
    //{ key: 'sixth' }
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      scrollEnabled={true}
      renderTabBar={VTabBar}
      activeColor="#FFFFFF"
    />
  );
}
