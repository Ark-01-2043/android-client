import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome"
import {debounce} from "lodash"

export default function ({ uid, hour, minutes, humidity, auto, onPress, isActive, onActiveChange, onDelete }) {
  // const [showDelete, setshowDelete] = useState(false)
  return (
    
    <TouchableOpacity
      key={uid}
      onPress={debounce(onPress, 1000)}
      // onLongPress={(e) => {setshowDelete(!setshowDelete)}}
      style={styles.container}
    >
      <View style={styles.leftIcon}>
        <Icon name={auto? "android": "user"} size={20} style={{padding: 5}}></Icon>
      </View>
      
      <View style={styles.leftInnerContainer}>
        <Text style={styles.clock}>
          {hour < 10 ? '0' + hour : hour}:{minutes < 10 ? '0' + minutes : minutes}
        </Text>
        <View style={styles.descContainer}>
          <Text style={{color: 'white', fontSize: 12}}>Độ ẩm: {humidity}</Text>
        </View>
      </View>
      <View style={styles.rightInnerContainer}>
        <Switch
          style={{marginLeft: 20}}
          trackColor={{ false: colors.GREY, true: colors.BLUE }}
          value={isActive}
          onValueChange={debounce(onActiveChange, 2000)}/>
        <TouchableOpacity onPress={debounce(onDelete, 1000)} style={{marginLeft: 10, backgroundColor: 'red', padding: 10, borderRadius: 20}}>                 
          <Icon name="trash" size={20}></Icon>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function getAlphabeticalDays (days) {
  let weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let activeDays = [];
  for (let i = 0; i < days.length; i++) {
    activeDays.push(weekdays[parseInt(days[i])] + ' ');
  }
  return activeDays;
}
const colors = {
    GREY: '#d0d5dc',
    BLUE: '#1992fe'
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    padding: 10,
  },
  leftInnerContainer: {
    margin: 5,
    marginLeft: 10,
    flex: 1,
    alignItems: 'flex-start',
  },
  leftIcon: {
    padding: 5,
    // flex: 1,

    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 50,
  },
  rightInnerContainer: {
    margin: 5,
    marginLeft: 40,
    flex: 1,
    flexDirection: "row",
    alignItems: 'flex-end',
  },
  descContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    color: 'grey',
  },
  clock: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 10,
  },
});