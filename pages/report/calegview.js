import * as React from 'react';
import { View, useWindowDimensions, Text } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Overview from './Overview'
import Listrelawan from './Listrelawan'
import Listpendukung from './Listpendukung'
import { Icon } from 'react-native-elements'



const FirstRoute = (props) => (
  // <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
  <Overview />
);

const SecondRoute = () => (
  // <View style={{ flex: 1, backgroundColor: 'white' }} />
  <Listrelawan  />
);
const ThirdRoute = () => {
  const navigation = useNavigation();
  // <View style={{ flex: 1, backgroundColor: 'white' }} />
  return  <Listrelawan navigation={navigation}/>
};
const FourthRoute = () => (
  // <View style={{ flex: 1, backgroundColor: 'white' }} />
  <Listpendukung />
);

const FifthRoute = () => (
  <View style={{ flex: 1, backgroundColor: 'white' }} />
);
const SixthRoute = () => (
  <View style={{ flex: 1, backgroundColor: 'white' }} />
);

const getTabBarIcon = (props) => {

  const {route, focus} = props
    if (route.key === 'first') {
      return <Icon type="font-awesome-5" name="heart" color="white" />
    } 
    
    else if (route.key === 'second') {
      return <Icon type="font-awesome-5" name='trophy' color='white' />
    }

    else if (route.key === 'third') {
      return <Icon type="font-awesome-5" name='user-friends' color='white' />
    }

    else if (route.key === 'fourth') {
      return <Icon type="font-awesome-5" name='user-check' color='white' />
    }

    else if (route.key === 'fifth') {
      return <Icon type="font-awesome-5" name='chart-pie' color='white' />
    }

    else if (route.key === 'sixth') {
      return <Icon type="font-awesome-5" name='whatsapp' color='white' />
    }
}

const getTabBarLabel = (props) => {

  const {route, focused} = props
    if (route.key === 'first') {
      if(focused) {
        return <Text style={{color: "yellow", fontSize: 13, textAlign: "center"}}>Overview</Text>
      }else{
        return <Text style={{color: "#FFFFFF", fontSize: 13, textAlign: "center"}}>Overview</Text>
      }
    } else if (route.key === 'second') {
      if(focused) {
        return <Text style={{color: "yellow", fontSize: 13, textAlign: "center"}}>Target</Text>
      }else{
        return <Text style={{color: "#FFFFFF", fontSize: 13, textAlign: "center"}}>Target</Text>
      }
    } else if (route.key === 'third') {
      if(focused) {
        return <Text style={{color: "yellow", fontSize: 13, textAlign: "center"}}>Relawan</Text>
      }else{
        return <Text style={{color: "#FFFFFF", fontSize: 13, textAlign: "center"}}>Relawan</Text>
      }
    } else if (route.key === 'fourth') {
      if(focused) {
        return <Text style={{color: "yellow", fontSize: 13, textAlign: "center"}}>Pendukung</Text>
      } else {
        return <Text style={{color: "#FFFFFF", fontSize: 13, textAlign: "center"}}>Pendukung</Text>
      }
    }

    else if (route.key === 'fifth') {
      if(focused) {
        return <Text style={{color: "yellow", fontSize: 13, textAlign: "center"}}>Data</Text>
      } else {
        return <Text style={{color: "#FFFFFF", fontSize: 13, textAlign: "center"}}>Data</Text>
      }
    }

    else if (route.key === 'sixth') {
      if(focused){
        return <Text style={{color: "yellow", fontSize: 13, textAlign: "center"}}>Pesan</Text>
      } else {
        return <Text style={{color: "#FFFFFF", fontSize: 13, textAlign: "center"}}>Pesan</Text>
      }
      
    }
}

const VTabBar = props => (  
  
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'white' }}    
    renderIcon={props => getTabBarIcon(props)}    
    renderLabel={props => getTabBarLabel(props)}        
    style={{backgroundColor: "#942512"}}
    tabStyle={{width: 100}}    
    labelStyle={{textAlign: "center"}}    
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
  sixth: SixthRoute
});

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first' },
    // { key: 'second' },
    { key: 'third'},
    { key: 'fourth' },
    { key: 'fifth' },
    { key: 'sixth' }
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      scrollEnabled={true}
      renderTabBar={VTabBar}            
      activeColor="#FFFFFF"
    />
  );
}