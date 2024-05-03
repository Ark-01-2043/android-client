// import { Slider } from "@miblanchard/react-native-slider";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import {useState} from 'react';
import Slider from "@react-native-community/slider";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-community/picker";
import { useNavigation } from "@react-navigation/native";
import {debounce} from "lodash"
export default function setHumid() {
    const now = new Date()
    const [humid, sethumid] = useState(80)
    const [hour, sethour] = useState(new Date())
    const [showTime, setshowTime] = useState(false)
    const [repeat, setrepeat] = useState(0)
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
                moisture: new String(humid),
                time: new Date(hour.getTime() - offset*60*1000).toISOString(),
                repeat: repeat,
                auto: false,
                plantId: 0,
                actived: true,
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
                const errorResponse = await response.json()
                const message = errorResponse.message
                Alert.alert("Lỗi: " + message)
                throw new Error(message)
            }
            navigation.navigate("Schedule")
        } catch (error) {
            // Alert.alert(error)
        }
    }
    return <View>
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
                <Text style={styles.label}>Chọn giờ:      {String(hour.getHours()).padStart(2, '0')}:{String(hour.getMinutes()).padStart(2, '0')}:{String(hour.getSeconds()).padStart(2, '0')} </Text>
                
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
            
        </View>
        <TouchableOpacity style={styles.buttonOpacity} onPress={debounce(async () => await onSaveClick(), 1000)}>
            <Text style={styles.buttonText} >Lưu</Text>
        </TouchableOpacity>
    </View>
    
}
const styles = StyleSheet.create({
    frame: {
        
        borderRadius: 10, 
        marginLeft: 31,
        marginTop: 10,
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
        fontSize: 20
    },
    rectangle: {
        
        marginLeft: 31,
        marginTop: 10,
        width: '80%',
        height: '54%',
        backgroundColor: '#1D3133', // Màu nền của View
        borderRadius: 10, // Bo góc của View (tùy chọn)
        // overflow: 'hidden', // Đảm bảo nội dung không vượt ra khỏi View
    },
    slider:{
        width: '100%', 
        height: 18,
        
    },
    sliderTitle:{
        flexDirection: 'row',
        marginBottom: 20,
        marginTop: 10,
    },
    humid:{
        marginLeft: 20,
        color: "white",
        fontSize: 18,
    },
    humidValue:{
        marginLeft: '50%',
        color: "white",
        fontSize: 18,
    },
    setHour:{
        flexDirection: "row",
        marginHorizontal: 20,
        paddingVertical: 10,
        color: "white",
        fontSize: 18,
        borderRadius: 5,
        borderWidth: 1,
    },
    label:{
        marginLeft: 10,
        marginTop: 10,
        color: "white",
        fontSize: 18,
    },
    repeatLabel:{
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
        // color: "white",
        fontSize: 18,
    },
    picker:{
        
        // width: '90%',
        justifyContent: 'center',
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        // marginVertical: 20,
        marginHorizontal: 20,
        color: "black",
        backgroundColor: 'white',
        fontSize: 16,
    },
    buttonOpacity: {

        
        alignItems: 'center',
        width: '80%',
        // height: 60,
        marginTop: 10,
        marginLeft: 30,
        textAlign: "center",
        // alignSelf: 'center',
        padding: 10, // Khoảng cách giữa các dòng
        backgroundColor: '#8356D1',
        
    },
    buttonText: {
        fontSize: 15,
        color: "#FFFFFF",
    },
});