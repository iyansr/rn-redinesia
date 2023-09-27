import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';


export default class RekapPemilu extends Component {

    constructor(props: Props) {  
        super(props);  
        this.state = {  
            dapilid: '',
        };  
  } 


  componentDidMount() {    
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
        const { dapilid } = this.props.route.params;
        console.log("--->",dapilid)
        this.setState({ 
            dapilid: dapilid
        });
    });
  }  

  render() {
    return <WebView source={{ uri: "https://www.mytimses.com/mobile/mapping-suara-2019?dapil_id="+this.state.dapilid }} scalesPageToFit={false} />    
  }
}