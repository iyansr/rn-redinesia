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

export default class SurveyMonitoringScreen extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      dataSurvey: [],
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {});
  }

  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    const {navigation} = this.props;
    const width = Dimensions.get('window').width;
    const height = 220;

    const data = [
      {
        name: 'Negatif',
        population: 102,
        color: 'orange',
        legendFontColor: 'orange',
        legendFontSize: 15,
      },
      {
        name: 'Netral',
        population: 138,
        color: 'blue',
        legendFontColor: 'blue',
        legendFontSize: 15,
      },
      {
        name: 'Positif',
        population: 330,
        color: 'red',
        legendFontColor: 'red',
        legendFontSize: 15,
      },
    ];

    const dataSurvey = [
      {
        name: 'Media',
        population: 290,
        color: 'red',
        legendFontColor: 'red',
        legendFontSize: 15,
      },
      {
        name: 'Teman',
        population: 128,
        color: 'blue',
        legendFontColor: 'blue',
        legendFontSize: 15,
      },
      {
        name: 'MedSos',
        population: 630,
        color: 'green',
        legendFontColor: 'green',
        legendFontSize: 15,
      },
      {
        name: 'Lain-lain',
        population: 30,
        color: 'orange',
        legendFontColor: 'orange',
        legendFontSize: 15,
      },
    ];

    const chartConfig = {
      backgroundGradientFrom: '#FFFFFF3',
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: '#FFFFFF',
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(156, 59, 64, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
      style: {
        borderRadius: 16,
      },
    };

    const graphStyle = {
      marginVertical: 8,
      ...chartConfig.style,
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <View style={{width: 300, marginLeft: 20, marginTop: 30}}>
          <Text
            style={{
              fontFamily: 'TitilliumWeb-Regular',
              alignSelf: 'center',
              fontSize: 19,
            }}>
            Survey Monitoring
          </Text>
        </View>
        <View style={{width: '100%', height: 250, marginLeft: 20}}>
          <PieChart
            data={dataSurvey}
            height={height}
            width={width}
            chartConfig={chartConfig}
            accessor="population"
            style={graphStyle}
          />
        </View>
        <View
          style={{
            width: 300,
            marginLeft: 60,
            marginTop: 5,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontFamily: 'TitilliumWeb-Regular',
              alignSelf: 'center',
              fontSize: 19,
            }}>
            Laporan Monitoring
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('surveydetil')}
            style={{
              marginTop: 5,
              fontFamily: 'TitilliumWeb-Regular',
              fontSize: 16,
              marginLeft: 5,
            }}>
            <Text>Selengkapnya</Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '100%', height: 400, marginLeft: 20}}>
          <PieChart
            data={data}
            height={height}
            width={width}
            chartConfig={chartConfig}
            accessor="population"
            style={graphStyle}
          />
        </View>
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
