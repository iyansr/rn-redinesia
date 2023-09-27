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

    const data = {
      labels: ['Timur', 'Utara', 'Barat', 'Pusat ', 'Selatan'],
      datasets: [
        {
          data: [190, 45, 40, 80, 99],
        },
      ],
    };

    const chartConfig = {
      backgroundGradientFrom: '#FFFFFF3',
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: '#FFFFFF',
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(156, 59, 64, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional,
      hideLegend: true,
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
            5 Kota Jakarta Terbanyak Positif
          </Text>
        </View>
        <View style={{width: '100%', height: 350, marginLeft: 20}}>
          <BarChart
            style={graphStyle}
            data={data}
            width={width}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={30}
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
