import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';


export default class Detailurl extends Component {

    constructor(props: Props) {  
        super(props);  
        this.state = {  
            url: '',
        };  
  } 


  componentDidMount() {    
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
        const { url } = this.props.route.params;
        this.setState({ 
            url: url
        });
    });
  }  

  render() {
    return <WebView source={{ uri: this.state.url }} />    
  }
}