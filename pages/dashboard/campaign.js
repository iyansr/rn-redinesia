import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {
  Agenda,
  DateData,
  AgendaEntry,
  AgendaSchedule,
  LocaleConfig,
} from 'react-native-calendars';
import testIDs from './testIDs';
import {API_URL} from '@env';
import axios from 'react-native-axios';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface State {
  items?: AgendaSchedule;
}

LocaleConfig.locales['id'] = {
  monthNames: [
    'Januari',
    'Februaru',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ],
  monthNamesShort: [
    'Jan.',
    'Feb.',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul.',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ],
  dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  dayNamesShort: ['Min.', 'Sen.', 'Sel.', 'Rab.', 'Kam.', 'Jum.', 'Sab.'],
  today: 'Sekarang',
  jumlahData: 0,
};

LocaleConfig.defaultLocale = 'id';

export default class AgendaScreen extends Component<State> {
  state: State = {
    items: undefined,
    feederitems: [],
  };

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //this.GetDataAktifitas();
      this.ProfilesData();
      this.DataAgendaStorage();
    });

    setInterval(() => {
      var datetime = new Date();
      this.GetDataAktifitas(this.state.kandidat_id);
    }, 150000);
  }

  ProfilesData = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("==========ccccc========"+datastring[0].user_id);
        this.setState({
          token: datastring[0].token,
          nama_kandidat: datastring[0].k_name,
          kandidat_id: datastring[0].k_id,
          user_id: datastring[0].user_id,
        });
        //this.GetDataAktifitas(datastring[0].k_id);
        if (this.state.jumlahData === 0) {
          this.GetDataAktifitas(datastring[0].k_id);
        } else {
          this.DataAgendaStorage();
        }
      } else {
        this.setState({
          session_id: null,
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  DataAgendaStorage = async () => {
    const {navigation} = this.props;
    try {
      const value = await AsyncStorage.getItem('@storage_agenda_Key');
      if (value !== null) {
        const datastring = JSON.parse(value);
        //console.log("-->Profilesd", JSON.stringify(datastring));
        if (datastring.length > 0) {
          var objmaps64 = {};
          datastring.forEach((items, index) => {
            objmaps64[items.ak_datetime] = [
              {
                id: items.ak_id,
                name: items.ak_title,
                desk: items.ak_deskripsi,
                place: items.ak_place,
                user_id: items.ak_user_id,
              },
            ];
          });
          this.setState({
            jumlahData: datastring.length,
            feederitems: objmaps64,
          });
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  GetDataAktifitas = idk => {
    const storeDataAgenda = async value => {
      try {
        await AsyncStorage.setItem(
          '@storage_agenda_Key',
          JSON.stringify(value),
        );
      } catch (e) {
        // saving error
      }
    };

    this.setState({loader: true});
    const self = this;
    const {navigation} = this.props;
    var formData = new URLSearchParams();
    var config = {
      method: 'get',
      url: API_URL + `/aktifitaspercaleg/` + idk,
      data: formData,
      headers: {
        //'Authorization': 'Basic c3RldmVuOm9rZWJhbmdldA==',
        Authorization: 'Bearer ' + self.state.token,
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("---->AKTS"+JSON.stringify(response.data.data));
        let ft = [];
        var agendadata = response.data.data;
        storeDataAgenda(agendadata);
        if (response.data.success === true) {
          var objmaps64 = {};
          response.data.data.forEach((items, index) => {
            objmaps64[items.ak_datetime] = [
              {
                id: items.ak_id,
                name: items.ak_title,
                desk: items.ak_deskripsi,
                place: items.ak_place,
                user_id: items.ak_user_id,
              },
            ];
          });
          self.setState({
            feederitems: objmaps64,
          });
        } else {
          console.log('errorrrrrrrita');
        }
      })
      .catch(function (error) {
        if (!error.response) {
          console.log('------ERORAKT' + error);
          //alert("ERROR KONEKSI: SILAHKAN COBA");
        } else {
          this.setState({
            loader: false,
          });
        }
      })
      .finally(response => {
        this.setState({
          loader: false,
        });
      });
  };

  render() {
    //console.log("-----feeeed"+ JSON.stringify(this.state.feederitems));

    return (
      <>
        <Agenda
          //testID={testIDs.agenda.CONTAINER}
          items={this.state.feederitems}
          loadItemsForMonth={this.loadItems}
          selected={new Date()}
          renderItem={this.renderItem}
          renderEmptyData={this.renderEmptyDate}
          rowHasChanged={this.rowHasChanged}
          showClosingKnob={true}
          pastScrollRange={6}
          futureScrollRange={6}
          hideKnob={false}
          // renderKnob={() => {
          //     return <View style={{width: '100%', height: 80, zIndex: 999999}}><Icon name='external-link' type='font-awesome' size={15}></Icon></View>;
          // }}
          // markingType={'period'}
          // markedDates={{
          //    '2022-07-24': {textColor: '#43515c'},
          //    '2022-07-25': {textColor: '#43515c'},
          //    '2022-07-26': {startingDay: true, endingDay: true, color: 'blue'},
          //    //'2017-05-21': {startingDay: true, color: 'blue'},
          //    //'2017-05-22': {endingDay: true, color: 'gray'},
          //    //'2017-05-24': {startingDay: true, color: 'gray'},
          //    //'2017-05-25': {color: 'gray'},
          //    '2022-07-26': {endingDay: true, color: 'gray'}}}
          // monthFormat={'yyyy'}
          // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
          //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
          // hideExtraDays={false}
          showOnlySelectedDayItems
        />

        <View style={{width: '100%', height: 70}}></View>
      </>
    );
  }

  loadItems = (day: DateData) => {
    const items = this.state.feederitems || {};

    setTimeout(() => {
      const newItems: AgendaSchedule = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      this.setState({
        items: newItems,
      });
    }, 1000);
  };

  renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const {navigation} = this.props;
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'black' : '#43515c';

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, {height: reservation.height}]}
        onPress={() =>
          reservation.user_id == this.state.user_id
            ? navigation.navigate('DashboardNavigator', {
                screen: 'editevent',
                params: {ids: reservation.id},
              })
            : Alert.alert(reservation.desk)
        }>
        <Text style={{fontSize, color}}>{reservation.name}</Text>
        <Text style={{fontSize: 13, color: 'blue'}}>{reservation.desk}</Text>
        <Text style={{fontSize: 13, color: 'blue'}}>
          Tempat :{' '}
          {reservation.place == '' ? 'Tidak Disebutkan' : reservation.place}
        </Text>
      </TouchableOpacity>
    );
  };

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>Belum Ada Aktifitas!</Text>
      </View>
    );
  };

  rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  };

  timeToString(time: number) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    marginLeft: 20,
    fontFamily: 'TitilliumWeb-Regular',
  },
});
