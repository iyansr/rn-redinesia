import * as React from 'react';
import { View, useWindowDimensions, Text } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Overview from '../pages/tandem/Overview'
import Listrelawan from '../pages/tandem/Listrelawan'
import { Icon } from 'react-native-elements'


const FirstRoute = (props, route) => (
  // <View style={{ flex: 1, backgroundColor: '#ff4081' }} />  
  <Overview  {...prop} />
);

const SecondRoute = (props) => (
  // <View style={{ flex: 1, backgroundColor: 'white' }} />
  <Listrelawan {...props} />
);


const getTabBarIcon = (props) => {    
  const {route, focus} = props
    if (route.key === 'first') {
      return <Icon type="font-awesome-5" name="heart" color="white" />
    } 
    
    else if (route.key === 'second') {
      return <Icon type="font-awesome-5" name='trophy' color='white' />
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
        return <Text style={{color: "yellow", fontSize: 13, textAlign: "center"}}>Aktifitas</Text>
      }else{
        return <Text style={{color: "#FFFFFF", fontSize: 13, textAlign: "center"}}>Aktifitas</Text>
      }    
    }
}

const VTabBar = (props) => (  
  
  <TabBar
    {...props}    
    indicatorStyle={{ backgroundColor: 'white' }}    
    renderIcon={props => getTabBarIcon(props)}    
    renderLabel={props => getTabBarLabel(props)}        
    style={{backgroundColor: "#942512"}}
    tabStyle={{width: 190}}    
    labelStyle={{textAlign: "center"}}    
    scrollEnabled={true}
    bounces={true}    
  />
);


const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function TabViewExample() {    
    
  const layout = useWindowDimensions();
  
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first' },
    { key: 'second' },    
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      scrollEnabled={true}      
      renderTabBar={props => VTabBar(props)}            
      activeColor="#FFFFFF"
    />
  );
}