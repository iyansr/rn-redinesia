import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';


export default class MyWebComponent extends Component {

    constructor(props: Props) {  
        super(props);  
        this.state = {  
            useridrelawan: '',
        };  
  } 


  componentDidMount() {    
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
        const { useridrelawan } = this.props.route.params;
        this.setState({ 
            useridrelawan: useridrelawan
        });
    });
  }  

  render() {
    return <WebView source={{ uri: 'https://mscode.id/edit/'+this.state.useridrelawan }} />;
  }
}