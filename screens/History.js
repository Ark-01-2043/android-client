import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {debounce} from "lodash"
export default function History(params) {
    const [data, setdata] = useState({
        labels: ['11/03', '12/03', '13/03', '14/03', '15/03', '16/03'],
        datasets: [{
          data: [86, 72, 90, 84, 92, 88]
        }]
    })
    const navigation = useNavigation()
    const [datetime, setdatetime] = useState([])
    const [humids, setHumids] = useState([])
    const [histories, sethistories] = useState([])
    const [loading, setLoading] = useState(true)
    
    const [fromDate, setFromDate] = useState(new Date())
    const [showFromDate, setshowFromDate] = useState(false)
    
    const [toDate, setToDate] = useState(new Date())
    const [showToDate, setshowToDate] = useState(false)
    const searchHistory = async () => {
        try {
            
            // const url = "http://192.168.1.107:8082/history/chart"
            const offset = fromDate.getTimezoneOffset()
            // Alert.alert(new Date(fromDate.getTime() - offset*60*1000).toISOString())
            const data = {
                fromDate: new Date(fromDate.getTime() - offset*60*1000).toISOString(),
                toDate: new Date(toDate.getTime() - offset*60*1000).toISOString()
            }
            // const url = "http://192.168.0.106:8082/history/search"
            const url = "https://android-server-b23y.onrender.com/history/search"
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                Alert.alert(response.status)
                throw new Error(response.status)
            }
            else{
                const data = await response.json()
                sethistories(data)
                setLoading(false)
            }
        } catch (error) {
            // Alert.alert("Error")
        }
    }
    const onshowFromDate = (e) => {
        setshowFromDate(true)
    }
    const onFromDateChange = async (e, value) => {
        
        setFromDate(value)
        setshowFromDate(false)
        setLoading(true)
        await searchHistory()
    }
    const onshowToDate = (e) => {
        setshowToDate(true)
    }
    const onToDateChange = async (e, value) => {
        setToDate(value)
        setshowToDate(false)
        setLoading(true)
        await searchHistory()
    }
    const toTimeString = (date) => {
        const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        
        return hour+":"+minute
    }
    const toSimpleTimeString = (date) => {
        const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        return hour+":"+minute+" "+day+"/"+month
    }
    const toDateString = (date) => {
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        return day+"/"+month+"/"+date.getFullYear()
    }
    const toFullDateString = (date) => {
        const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        
        return hour+":"+minute+" "+day+"/"+month+"/"+date.getFullYear()
    }
    const loadChart = async() => {
        try {
            
            // const url = "http://192.168.1.107:8082/history/chart"
            // const url = "http://192.168.0.106:8082/history/chart"
            const url = "https://android-server-b23y.onrender.com/history/chart"
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (!response.ok) {
                // Alert.alert(response)
                throw new Error(response.status)
            }
            else{
                let dates = []
                let humidity = []
                const data = await response.json()
                data.forEach(item => {
                    humidity.push(item.moisture.substring(0,1)*10)
                    dates.push(toSimpleTimeString(new Date(item.time)))
                });
                setdatetime(dates)
                setHumids(humidity)
                setdata({
                    labels: dates,
                    datasets: [{
                      data: humidity
                    }]
                })
            }
        } catch (error) {
            Alert.alert("Error")
        }
    }
    const loadHistories = async() => {
        try {
            
            // const url = "http://192.168.1.107:8082/history"
            // const url = "http://192.168.0.106:8082/history"
            const url = "https://android-server-b23y.onrender.com/history"
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (!response.ok) {
                Alert.alert(response)
                throw new Error(response.message)
            }
            else{
                
                const data = await response.json()
                sethistories(data)
                setLoading(false)
            }
        } catch (error) {
            Alert.alert("Error" + error.message)
        }
    }
    useEffect(() => {
        
        const unsubscribe = navigation.addListener('focus', async () => {
            await loadChart()
            await loadHistories()
        })
        return unsubscribe
    }, [])
    return <View style={{backgroundColor: '#244542', height: '100%'}}>
        <View style={{
            width: '90%',
            height: '5%',
            // display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'transparent',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginBottom: 15,
        }}>
            <TouchableOpacity
            style={{
                // backgroundColor: 'white',
                // marginLeft: 10,
                // marginTop: 10,
                flexDirection: 'row',
                // padding: 10,
                // borderRadius: 20,
            }}
            onPress={() => navigation.navigate("WaterHome")}>
            <Icon name="angle-left" size={20} styles={{padding: 10}}>Back</Icon>
            {/* <Text styles={{marginTop: 15}}>Back</Text> */}
            </TouchableOpacity>
        </View>
        <LineChart
            data={data}
            width={400}
            height={220}
            style={{marginTop: 0, alignContent: 'center'}}
            chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#FFF',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
                borderRadius: 16,
                // marginTop: 20,
            },
            }}
        />
        <View style={styles.frame}>
            <Text style={styles.header}>Lịch sử</Text>
        </View>
        <ScrollView style={styles.rectangle}>
            <View style={styles.searchBar} >
                <TouchableOpacity style={{padding: 10, backgroundColor: 'white'}} onPress={debounce(onshowFromDate, 1000)}>
                    <Text style={{color: 'black', fontSize: 12}}>Từ ngày: {toDateString(fromDate)} </Text>
                    
                    

                </TouchableOpacity>
                {showFromDate && <RNDateTimePicker is24Hour={true}  display="calendar" mode="date" value={fromDate} onChange={debounce(onFromDateChange, 1000)}></RNDateTimePicker>}
                <TouchableOpacity onPress={debounce(onshowToDate, 1000)} style={{padding: 10, backgroundColor: 'white', marginLeft: 10}}>
                    <Text style={{color: 'black', fontSize: 12}}>Đến ngày: {toDateString(toDate)} </Text>
                    
                    

                </TouchableOpacity>
                {showToDate && <RNDateTimePicker is24Hour={true}  display="calendar" mode="date" value={toDate} onChange={debounce(onToDateChange, 1000)}></RNDateTimePicker>}
            </View>
            {!loading && histories.map((item) => 
                <View style={styles.farmer} key={item.id}>
                    <View style={styles.farmer_col1}>
                        <Text style={{color: "#FFFFFF", fontSize: 22}}>{toFullDateString(new Date(item.time))}</Text>
                        <Text style={{color: "#FFFFFF", fontStyle: 'italic'}}>Độ ẩm: {item.moisture}</Text>
                    </View>
                </View>)
            }
            {loading && <ActivityIndicator size={"large"}></ActivityIndicator>}
            
            
            
            
            
        </ScrollView>
        {/* <View style={{height: 100}}>
            
        </View> */}
    </View>

}
const styles = StyleSheet.create({
    frame: {
        
        borderRadius: 10, 
        justifyContent: 'center',
        marginLeft: 31,
        // marginTop: 40,
        width: '80%',
        // height: 88,
        backgroundColor: '#fffff', // Màu nền của View
        borderWidth: 1, // Độ dày của viền (tùy chọn)
        borderColor: '#00000', // Màu của viền (tùy chọn)
    },
    header: {
        color: "#ffffff",
        textAlign: 'center',
        padding: 10,
        fontSize: 18
    },
    farmer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        'textAlign': 'center',
        borderBottomWidth: 1,
        width: '100%',
        // height: 100,
        // marginLeft: 40,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: 'center'
        
    },
    farmer_col1:{
        // with: '70%',
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
        flexDirection: 'col',
        textAlign: 'center',
        justifyContent: 'center',
        padding: 10,
        // marginLeft: 20,

    },
    searchBar: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        textAlign: 'left',
        // marginLeft: 10,
        marginTop: 0,
        width: '80%',
        padding: 5, 
        borderRadius: 5,
        fontSize: 15,
        // backgroundColor: '#FFFFFF',
    },
    rectangle: {
        // alignItems: 'center',
        marginLeft: 32,
        marginTop: 10,
        width: '80%',
        height: '40%',
        backgroundColor: '#1D3133', 
        borderRadius: 10, 
        overflow: 'scroll', 
        // flex: 1,
    },
})