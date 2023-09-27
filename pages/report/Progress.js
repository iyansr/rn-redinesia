import React, {Component} from 'react';
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
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import BtnStandard from '../component/BtnStandard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

export default class SurveyDetailScreen extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      dataSurvey: [],
      total_relawan: props.name2 * 100,
      total_pendukung: props.name,
    };
  }

  componentDidMount() {
    this.state.dataSurvey.push(
      parseFloat(this.state.total_pendukung),
      parseFloat(this.props.name2),
    );
    //this.state.dataSurvey.push(0.54, 0.23);
  }

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    const {navigation} = this.props;
    const screenWidth = Dimensions.get('window').width;
    const height = 220;
    let totalR = parseFloat(this.props.name2.toFixed(3).replace(/,/g, '.'));
    let totalP = parseFloat(this.props.name.toFixed(3).replace(/,/g, '.'));
    const data = {
      labels: ['Pendukung', 'Relawan'],
      //data: [0.289, 0.345],
      //data: [totalP, totalR],
      data: this.state.dataSurvey,
      colors: ['red', 'purple'],
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

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <View style={{height: 221, justifyContent: 'center'}}>
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
        </View>
        {/* <View>
                <Text>-------------->{this.state.total_relawan}</Text>
            </View> */}
      </SafeAreaView>
    );
  }
}

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
});
