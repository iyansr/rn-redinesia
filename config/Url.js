import React, { Component, useState } from 'react';
import axios from 'react-native-axios'


const getValueDB = async () => {
    try {
      let resGet = await axios.get('https://timsesapps-default-rtdb.asia-southeast1.firebasedatabase.app/server_url.json')
      console.log(resGet)
      return resGet;
    } catch (error) {
      console.log(error);
    }
  }


export default (props) => {
    console.log("fedfefef");
    const resGet =  getValueDB();
    return (resGet)
}

