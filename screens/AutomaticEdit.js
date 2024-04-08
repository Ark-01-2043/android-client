import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-community/picker";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {debounce} from "lodash"
export default function AutomaticEdit({route}) {
    const [isLoading, setisLoading] = useState(true)
    const [selected, setselected] = useState(0)
    const [plants, setplants] = useState([])
    const [search, setsearch] = useState([])
    const [keyword, setkeyword] = useState("")
    const now = new Date()
    const [humid, sethumid] = useState(80)
    const [hour, sethour] = useState(new Date())
    const [showTime, setshowTime] = useState(false)
    const [repeat, setrepeat] = useState(0)
    const [active, setactive] = useState(true)
    const id = route.params.id
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
    const onSaveClick = async (e) => {
        if (selected == 0) {
            Alert.alert("Vui lòng chọn cây trồng")
        }
        else{
            try {
                const offset = hour.getTimezoneOffset()
                const data = {
                    id: id,
                    moisture: 0,
                    time: new Date(hour.getTime() - offset*60*1000).toISOString(),
                    repeat: repeat,
                    auto: true,
                    plantId: selected,
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
                    // Alert.alert("Error")
                    throw new Error(response.status)
                }
                navigation.navigate("Schedule")
            } catch (error) {
                Alert.alert("error")
            }
        }
        
    }
    const loadPlants = async () => {
        try {
            const url = "https://android-server-b23y.onrender.com/plant"
            // const url = "http://192.168.1.107:8082/plant"
            // const url = "http://192.168.0.106:8082/plant"
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
                setplants(data)
                setsearch(data)
                setisLoading(false)
            }
        } catch (error) {
            Alert.alert("Error" + error)
        }
    }
    const onKeywordChange = (value) => {
        setkeyword(value)
        if(value == ""){
            setsearch(plants)
            // Alert.alert(plants[0].ten_cay)
        }
        else if (value && value.trim() != "") {
            
            setsearch(plants.filter(plant => {
                ten_cay = plant.ten_cay.toLowerCase()
                search_term = value.trim().toLowerCase()
                return ten_cay.indexOf(search_term) > -1
            }))
        } else{
            setsearch(plants)
        }
    }
    const debounce = (fn, delay) => {
        delay = delay || 0
        let timeId
        return () => {
            if (timeId) {
                clearTimeout(timeId)
                timeId = null
            }
            timeId = setTimeout(() => {
                fn
            }, delay);
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
                setselected(data.plantId)
                sethour(new Date(data.time))
                setrepeat(data.repeat)
                setactive(data.actived)
            }
        } catch (error) {
            Alert.alert("Error")
        }
    }
    useEffect(() => {
        loadPlants()
        const unsubscribe = navigation.addListener('focus', loadSchedule)
        return unsubscribe
    }, [])
    return <View style={{backgroundColor: '#244542'}}>
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
        <View >
            <View style={styles.frame}>
                <Text style={styles.header}>Chỉnh sửa lịch</Text>
            </View>
            <ScrollView style={styles.rectangle}>
                <TextInput style={styles.searchBar} placeholder="Nhập tên" onChangeText={debounce(onKeywordChange, 1000)}></TextInput>
                {isLoading && <ActivityIndicator style={{justifyContent: 'center'}} size={'large'}></ActivityIndicator>}
                
                {search.map((item) => (
                    <View style={selected === item.id? styles.selected: styles.farmer} key={item.id}>
                        <View style={styles.farmer_col1}>
                            <Image source={{uri: "https://android-server-b23y.onrender.com/img/plant/" + item.image}} style={styles.thumbnail} />
                            <View>

                                <Text style={styles.title}>{item.ten_cay}</Text>
                                <Text style={styles.subtitle}>Độ ẩm: {item.minIdealSoilMoisture}-{item.maxIdealSoilMoisture}%</Text>
                            </View>
                            <TouchableOpacity onPress={debounce(() => {
                                if (selected === item.id) {
                                    setselected(0)
                                } else {
                                    setselected(item.id)
                                }
                            }, 1000)} style={styles.button}>
                                <Text style={styles.buttonText}>{selected === item.id? "Bỏ": "Chọn"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                
            </ScrollView>
            
            <View style={styles.rectangle2}>
                
                
                <TouchableOpacity style={styles.setHour} onPress={debounce(popUp, 1000)}>
                    <Text style={styles.label}>Chọn giờ:      {String(hour.getHours()).padStart(2, '0')}:{String(hour.getMinutes()).padStart(2, '0')}:{String(hour.getSeconds()).padStart(2, '0')} </Text>
                    
                    {showTime && <RNDateTimePicker is24Hour={true}  display="clock" mode="time" value={hour} onChange={debounce(onHourChange, 1000)}></RNDateTimePicker>}

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
                <TouchableOpacity style={styles.buttonOpacity} onPress={debounce(onSaveClick, 1000)}>
                    <Text style={styles.buttonText} >Lưu</Text>
                </TouchableOpacity>
            </View>
            
        </View>
        
    </View>
}
const styles = StyleSheet.create({
    frame: {
        
        borderRadius: 10, 
        marginLeft: 31,
        
        width: 347,
        // height: 88,
        backgroundColor: '#fffff', // Màu nền của View
        borderWidth: 1, // Độ dày của viền (tùy chọn)
        borderColor: '#00000', // Màu của viền (tùy chọn)
    },
    rectangle: {
        // alignItems: 'center',
        marginLeft: 32,
        marginTop: 10,
        width: 344,
        height: 450,
        backgroundColor: '#1D3133', 
        borderRadius: 10, 
        overflow: 'scroll', 
        // flex: 1,
    },
    header: {
        color: "#ffffff",
        textAlign: 'center',
        padding: 10,
        fontSize: 30
    },
    searchBar: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        textAlign: 'left',
        marginLeft: 20,
        marginVertical: 15,
        width: '90%',
        marginBottom: 30,
        padding: 5, 
        fontSize: 15,
        backgroundColor: '#FFFFFF',
    },
    farmer: {
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
        // 'textAlign': 'left',
        borderBottomWidth: 1,
        width: '100%',
        height: 100,
        paddingLeft: 10,
        paddingVertical: 10,
        flexDirection: "row",
        // justifyContent: 'flex-end'
        
    },
    selected: {
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
        // 'textAlign': 'left',
        borderWidth: 1,
        backgroundColor: 'gray',
        width: '100%',
        height: 100,
        paddingLeft: 10,
        paddingVertical: 10,
        flexDirection: "row",
        // justifyContent: 'flex-end'
        
    },
    farmer_col1:{
        with: '70%',
        alignItems: 'flex-start',
        justifyContent: "flex-start",
        textAlign: 'left',
        flexDirection: 'row',
        // marginLeft: 20,

    },
    farmer_col2:{
        
    },
    thumbnail:{
        width: 70,  
        height: 70, 
        borderRadius: 35, 
        marginLeft: 20,
        overflow: 'hidden',
    },
    title:{
        color: "#ffffff",
        fontSize: 20,
        marginLeft: 30,
        marginTop: 5,
    },
    subtitle:{
        color: "#ffffff",
        fontSize: 16,
        fontStyle: 'italic',
        marginLeft: 30,
        marginTop: 5,
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20, 
        marginLeft: 20,
        marginTop: 15,
        
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
    },
    buttonOpacity: {

        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
        height: 60,
        marginTop: 10,
        marginLeft: 85,
        textAlign: "center",
        padding: 15, // Khoảng cách giữa các dòng
        backgroundColor: '#8356D1',
        
    },
    buttonText1: {
        fontSize: 20,
        color: "#FFFFFF",
    },
    
    header: {
        color: "#ffffff",
        textAlign: 'center',
        padding: 10,
        fontSize: 30
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
        // marginTop: 40,
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
    rectangle2: {
        
        marginLeft: 32,
        marginTop: 10,
        width: 344,
        height: 280,
        backgroundColor: '#1D3133', // Màu nền của View
        borderRadius: 10, // Bo góc của View (tùy chọn)
        overflow: 'hidden', // Đảm bảo nội dung không vượt ra khỏi View
    },
});