import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import { getAlarmState, getAllSchedules, disableAlarm, enableAlarm } from '../alarm';
import AlarmView from '../components/AlarmView';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'd3';
import {debounce} from "lodash"
export default function Schedule() {
  const [isLoading, setIsLoading] = useState(true)
  const [change, setchange] = useState(0)
  const [schedules, setSchedules] = useState([]);
  const navigation = useNavigation()
  //   const navigation = useNavigation()
  const loadSchedule = async () => {
    try {
      const url = "https://android-server-b23y.onrender.com/schedule"
      // const url = "http://192.168.1.107:8082/schedule"
      // const url = "http://192.168.0.106:8082/schedule"
      const response = await fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          }
      })
      if (!response.ok) {
          Alert.alert(response)
          throw new Error(response.status)
      }
      else{
          const data = await response.json()

          // Alert.alert(data[0].ten_cay)
          setSchedules(data)
          setIsLoading(false)
      }
    } catch (error) {
        Alert.alert("Error" + error)
    }
  }
  const deleteSchedule = async (id) => {
    try {
      setchange(change+1)
      const url = "https://android-server-b23y.onrender.com/schedule/"+id
      // const url = "http://192.168.1.107:8082/schedule/"+id
      // const url = "http://192.168.0.106:8082/schedule/"+id
      
      const response = await fetch(url, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          }
      })
      if (!response.ok) {
          Alert.alert(response)
          throw new Error(response.status)
      }
      else{
          const data = await response.json()
          setSchedules((pre) => {
            let newSchedules = [...pre]
            const index = newSchedules.findIndex((item) => item.id == id)
            newSchedules.splice(index, 1)
            
            return newSchedules 
          })
          await loadSchedule()
          
      }
    } catch (error) {
        Alert.alert("Error" + error)
    }
  }
  const onAddClick = (e) => {
    Alert.alert(
      'Chọn phương thức tưới cây',
      'Vui lòng chọn phương thức tưới cây!',
      [
        { text: 'Tự động', onPress: () => {navigation.navigate("Automatic")}, style: 'cancel' },
        { text: 'Thủ công', onPress: () => {navigation.navigate("Manual")}, style: 'destructive' },
      ],
    )

  }
  useEffect(() => {
    loadSchedule()
    const unsubscribe = navigation.addListener('focus', loadSchedule)
    return unsubscribe
  }, [])
  return (
    <View style={globalStyles.container}>
      
      <View style={globalStyles.topContainer}>
        <TouchableOpacity
          style={{
            
            marginLeft: 10,
            marginTop: 10,
            borderRadius: 20,
          }}
          onPress={() => navigation.navigate("WaterHome")}>
          <Icon name="angle-left" size={20} >Back</Icon>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            marginLeft: 300,
            padding: 15,
            borderRadius: 20,
          }}
          onPress={onAddClick}>
          <Icon name="plus" styles={{padding: 10}}></Icon>
        </TouchableOpacity>
      </View>
      <View style={globalStyles.innerContainer}>
        {isLoading && <ActivityIndicator size={'large'}></ActivityIndicator>}
        {schedules &&
          schedules.map(a => (
            <AlarmView
              key={a.id}
              humidity={a.moisture}
              uid={a.id}
              auto={a.auto}
              onPress={(e) => {
                if(a.auto) {
                  // Alert.alert("Chuyển sang edit" + a.id)
              
                  navigation.navigate("AutomaticEdit", {id: a.id})
               } else { 
                  // Alert.alert("Chuyển sang edit" + a.id)
                  navigation.navigate("ManualEdit", {id: a.id})}
               }
              }
              onDelete={(e) => {
                setchange(change+1)
                Alert.alert(
                  'Xác nhận xóa',
                  'Bạn có muốn xóa lịch tưới cây',
                  [
                    { text: 'Có', onPress: async () => {await deleteSchedule(a.id)}, style: 'cancel' },
                    { text: 'Không', onPress: () => {}, style: 'destructive' },
                  ],
                )
              }}
              hour={new Date(a.time).getHours()}
              minutes={new Date(a.time).getMinutes()}
              isActive={a.active}
              onActiveChange={async (e) => {
                try {
                  const url = "https://android-server-b23y.onrender.com/schedule/"+a.id
                  // const url = "http://192.168.1.107:8082/schedule/"+a.id
                  // const url = "http://192.168.0.106:8082/schedule/"+a.id
                  const response = await fetch(url, {
                      method: "PATCH",
                      headers: {
                          "Content-Type": "application/json",
                      }
                  })
                  if (!response.ok) {
                      Alert.alert(response)
                      throw new Error(response.status)
                  }
                  else{
                      const data = await response.json()
                      setSchedules((pre) => {
                        let newSchedules = [...pre]
                        const index = newSchedules.findIndex((item) => item.id == a.id)
                        newSchedules[index].active = !newSchedules[index].active
                        return newSchedules 
                      })
                      // Alert.alert(data[0].ten_cay)
                      
                  }
                } catch (error) {
                    Alert.alert("Error" + error)
                }
              }}
            />
          ))}
      </View>
    </View>
  );
}
const globalStyles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#244542',
  },
  innerContainer: {
    width: '90%',
    height: '90%',
    display: 'flex',
    alignItems: 'center',
  },
  topContainer: {

    // display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignSelf: 'flex-start'
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start'
    // marginLeft: 10
  },
});
