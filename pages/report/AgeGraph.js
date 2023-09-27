import React, { Component } from 'react'
import { Text, SafeAreaView, TouchableOpacity, StatusBar, StyleSheet, 
        TextInput, View, FlatList, Image, RefreshControl, ScrollView, Dimensions} from 'react-native'
import { Icon } from 'react-native-elements'
import BtnStandard from '../component/BtnStandard'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from "@env"
import axios from 'react-native-axios'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";


  export default class SurveyDetailScreen extends Component {


    constructor(props: Props) {  
        super(props);  
        this.state = {  
            dataSurvey: [],             
            dataUsia: props.name[0],
            muda: 0,
            bawah1: 0,
            bawah2: 0,
            bawah3: 0,
            tua: 0
        };  
    } 

    componentDidMount() {
        
    }
    
    UNSAFE_componentWillUnmount() {
        this._unsubscribe();
    }


    render(){
        //console.log("0000000000",this.props.name[0]["dewasa3"]);
        const { navigation } = this.props;        
        const width = Dimensions.get('window').width - 30
        const height = 220

        const data = {
            labels: ["< 20", "21 < 30", "31 < 40", "41 < 50", "> 51"],
            datasets: [
              {
                data: [this.props.name["muda"], this.props.name["dewasa1"], this.props.name["dewasa2"], this.props.name["dewasa3"], this.props.name["tua"]]
              }
            ]
          };

          const chartConfig = {
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            barPercentage: 0.7,
            height:5000,
            fillShadowGradient: `rgba(1, 122, 205, 1)`,
            fillShadowGradientOpacity: 1,
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(1, 122, 205, 1)`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,

            style: {
              borderRadius: 16,
              fontFamily: "Bogle-Regular",
            },
            propsForBackgroundLines: {
              strokeWidth: 1,
              stroke: "#e3e3e3",
              strokeDasharray: "0",
            },
            propsForLabels: {
              fontFamily: "Bogle-Regular",
            },
          };  

          const graphStyle = {
            marginVertical: 20,            
            ...chartConfig.style
          }

        return(         
            <SafeAreaView style={styles.container}>                
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor='transparent' />              
            <View style={{width: "100%", height: 350, marginLeft: 20}}>
            <BarChart
                style={graphStyle}
                data={data}
                width={width}
                height={220}
                fromZero={true}
                withInnerLines={true}
                yAxisLabel=""                
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                />
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