import TempAndHumid from "../components/TempAndHumid";
import SetHumid from "../components/SetHumid";
import { useRoute } from "@react-navigation/native";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import {useEffect, useState} from 'react';
import Slider from "@react-native-community/slider";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-community/picker";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {debounce} from "lodash"
export default function ManualEdit({route}) {
    const [humid, sethumid] = useState(80)
    const [hour, sethour] = useState(new Date())
    const [showTime, setshowTime] = useState(false)
    const [repeat, setrepeat] = useState(0)
    const [active, setactive] = useState(true)
    const id = route.params.id
    const [TempAverage, setTempAverage] = useState(0)
    const [HumAverage, setHumAverage] = useState(0)
    
    const fetchData = async () => {
        try {
            const response = await fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q=hanoi&appid=618eda34cb294887149cf0dafcf3730c"
            );

            if (response.ok) {
                let tempAverage1 = 0;
                let humAverage1 = 0;
                const data = await response.json();
                for (let i = 0; i < data["list"].length; i++) {
                    tempAverage1 += data["list"][i]["main"]["temp"];
                    humAverage1 += data["list"][i]["main"]["humidity"];
                }
                tempAverage1 = tempAverage1 / data["list"].length - 273.15;
                humAverage1 = humAverage1 / data["list"].length;
                setTempAverage(parseInt(tempAverage1));
                setHumAverage(parseInt(humAverage1));
            

            } else {
            console.error("Failed to fetch weather data");
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }
    const onHourChange = (event, value) => {
        // Alert.alert(value)
        sethour(value)
        setshowTime(false)
    }
    const onSliderChange = (value) => {
        sethumid(value)
        // Alert.alert(value)
    }
    const popUp = (event) => {
        setshowTime(true)
    }
    const navigation = useNavigation()
    
    const onSaveClick = async () => {
        try {
            const offset = hour.getTimezoneOffset()
            const data = {
                id: id,
                moisture: new String(humid),
                time: new Date(hour.getTime() - offset*60*1000).toISOString(),
                repeat: repeat,
                auto: false,
                plantId: 0,
                actived: active,
                deleted: false
            }
            
            const url = "https://android-server-b23y.onrender.com/schedule"
            // const url = "http://192.168.1.107:8082/schedule"
            // const url = "http://192.168.0.106:8082/schedule"
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            
            if (!response.ok) {
                // Alert.alert(response.status)
                Alert.alert("error")
                throw new Error(response.status)
            }
            navigation.navigate("Schedule")
        } catch (error) {
            Alert.alert(error)
        }
    }
    const loadSchedule = async() => {
        try {
            // Alert.alert("Load schedule " + id)
            const url = "https://android-server-b23y.onrender.com/schedule/"+id
            // const url = "http://192.168.1.107:8082/schedule/"+id
            // const url = "http://192.168.0.106:8082/schedule/"+id
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
                // Alert.alert("fetch successfully")
                const data = await response.json()
                // Alert.alert(data.id)
                // setselected(data.plantId)
                sethumid(data.moisture)
                sethour(new Date(data.time))
                setrepeat(data.repeat)
                setactive(data.actived)
            }
        } catch (error) {
            Alert.alert("Error")
        }
    }
    useEffect(() => {
        
        const unsubscribe = navigation.addListener('focus', async () => {await loadSchedule(); await fetchData();})
        return unsubscribe
    }, [])
    return <ScrollView style={{backgroundColor: '#244542'}}>
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
                marginTop: 10,
                flexDirection: 'row',
                // padding: 10,
                // borderRadius: 20,
            }}
            onPress={() => navigation.navigate("Schedule")}>
            <Icon name="angle-left" size={20} styles={{padding: 10}}>Back</Icon>
            {/* <Text styles={{marginTop: 15}}>Back</Text> */}
            </TouchableOpacity>
        </View>
        <TempAndHumid></TempAndHumid>
        
        <View>
            <View style={styles.frame}>
                <Text style={styles.header}>Chọn giờ</Text>
            </View>
            
            <View style={styles.rectangle}>
                
                <View style={styles.sliderTitle}>
                    <Text style={styles.humid}>Độ ẩm</Text>
                    <Text style={styles.humidValue}>{humid}</Text>
                </View>
                <Slider style={styles.slider} minimumValue={0} maximumValue={100} step={1} thumbTintColor="blue" value={humid} onValueChange={onSliderChange}></Slider>
                <TouchableOpacity style={styles.setHour} onPress={debounce(popUp, 1000)}>
                    <Text style={styles.label}>Chọn giờ:      {hour.toLocaleTimeString()} </Text>
                    
                    {showTime && <RNDateTimePicker is24Hour={true}  display="clock" mode="time" value={hour}  onChange={debounce(onHourChange, 1000)}></RNDateTimePicker>}

                </TouchableOpacity>
                
                <Text style={styles.repeatLabel}>Lặp lại</Text>
                <Picker
                    selectedValue={repeat}
                    style={styles.picker}
                    onValueChange={debounce((itemValue, itemIndex) =>
                        setrepeat(itemValue), 1000)
                    }>
                    <Picker.Item label="Không" value={0} />
                    <Picker.Item label="Hằng ngày" value={1} />
                    <Picker.Item label="Mỗi 2 ngày" value={2} />
                    <Picker.Item label="Hằng tuần" value={3} />
                </Picker>
                <TouchableOpacity style={styles.buttonOpacity} onPress={debounce(async () => await onSaveClick(), 1000)}>
                    <Text style={styles.buttonText} >Lưu</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>
}
const styles = StyleSheet.create({
    frame: {
        
        borderRadius: 10, 
        marginLeft: 31,
        marginTop: 50,
        width: 347,
        // height: 88,
        backgroundColor: '#fffff', // Màu nền của View
        borderWidth: 1, // Độ dày của viền (tùy chọn)
        borderColor: '#00000', // Màu của viền (tùy chọn)
    },
    header: {
        color: "#ffffff",
        textAlign: 'center',
        padding: 10,
        fontSize: 30
    },
    rectangle: {
        
        marginLeft: 32,
        marginTop: 20,
        width: 344,
        height: 470,
        backgroundColor: '#1D3133', // Màu nền của View
        borderRadius: 10, // Bo góc của View (tùy chọn)
        overflow: 'hidden', // Đảm bảo nội dung không vượt ra khỏi View
    },
    slider:{
        width: '100%', 
        height: 30,
        
    },
    sliderTitle:{
        flexDirection: 'row',
        
        marginVertical: 30,
    },
    humid:{
        marginLeft: 20,
        color: "white",
        fontSize: 25,
    },
    humidValue:{
        marginLeft: 150,
        color: "white",
        fontSize: 25,
    },
    setHour:{
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 40,
        color: "white",
        fontSize: 18,
        borderRadius: 5,
        borderWidth: 1,
    },
    label:{
        marginLeft: 10,
        marginVertical: 20,
        color: "white",
        fontSize: 24,
    },
    repeatLabel:{
        marginLeft: 20,
        marginVertical: 10,
        color: "white",
        fontSize: 20,
    },
    picker:{
        
        width: '90%',
        justifyContent: 'center',
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 20,
        marginHorizontal: 20,
        color: "black",
        backgroundColor: 'white',
        fontSize: 24,
    },
    buttonOpacity: {

        width: '100%',
        alignItems: 'center',
        width: '80%',
        height: 60,
        marginTop: 10,
        marginLeft: 30,
        textAlign: "center",
        padding: 15, // Khoảng cách giữa các dòng
        backgroundColor: '#8356D1',
        
    },
    buttonText: {
        fontSize: 20,
        color: "#FFFFFF",
    },
});