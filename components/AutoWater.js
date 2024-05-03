import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-community/picker";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {ImagePicker, launchImageLibrary} from "react-native-image-picker"
import {debounce} from "lodash"


export default function AutoWater(params) {
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
    const [base64, setbase64] = useState("")
    const plantIds = ["c4f0d775e03dd7fd", "87e6d1ca263688b2", "0e66c835d1c81c15", "3ee61a3830229229", "0ca8353363e2d104", "0183a129fa934ba0", "2746768c8d99bfbb", "dcf39092de182ffc", "d1c23e0b570f6b3c", "f4a53abc2c57b851"]
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
                    moisture: 0,
                    time: new Date(hour.getTime() - offset*60*1000).toISOString(),
                    repeat: repeat,
                    auto: true,
                    plantId: selected,
                    actived: true,
                    deleted: false
                }
                // Alert.alert("fetch")
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
            // Alert.alert("Error" + error)
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
    const onSelectImage = async (type) => {        
        let options = {
            mediaType: type,
            // maxWidth: 300,
            // maxHeight: 550,
            quality: 1,
            includeBase64: true,
          };
        launchImageLibrary(options, (response) => {
            // console.log('Response = ', response);
        
            if (response.didCancel) {
                
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                Alert.alert("Camera không khả dụng")
                return;
            } else if (response.errorCode == 'permission') {
                Alert.alert("Chưa cấp quyền")
                return;
            } else if (response.errorCode == 'others') {
                // alert(response.errorMessage);
                Alert.alert(response.errorMessage)
                return;
            }
            // console.log('base64 -> ', response);
            // const formData = new FormData();
            // formData.append("similar_images", true)
            // formData.append("image1", response.assets[0].base64)
            setbase64(response.assets[0].base64)
        });
        
    }
    const imageSearch = async() => {
        if (base64 == "") {
            Alert.alert("Vui lòng chọn ảnh")
            return
        }
        try {
            const data = {
                images: [base64]
            }
            const response = await fetch("https://plant.id/api/v3/identification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": "wMonbdxIVUoBM7J8qp6LKXVjAa990lVfuCS47yavd3XTfi1i8d",
                }, 
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                // Alert.alert(response)
                Alert.alert("Không liên lạc được với server")
                throw new Error(response)
            }
            else{
                // Alert.alert("fetch successfully")
                const data = await response.json()
                console.log(data)
                const probability = parseFloat(data.result.is_plant.probability)
                if (probability < 0.8) {
                    Alert.alert("Độ chính xác: " + data.result.is_plant.probability + " quá thấp. Vui lòng chọn ảnh khác")
                    return
                }
                const plants = data.result.classification.suggestions
                let foundId = -1;
                plants.forEach(plantItem => {
                    if (foundId != -1) {
                        return
                    }
                    for (let index = 0; index < plantIds.length; index++) {
                        
                        if (plantIds[index] == plantItem.id) {
                            foundId = index;
                            break;
                        }
                    }
                    
                });
                if (foundId != -1) {
                    Alert.alert("Đã phát hiện cây trồng")
                    setselected(foundId + 1)
                } else{
                    
                    Alert.alert("Không có cây trồng nào thích hợp với hình")
                }
            }   
        } catch (error) {
            console.log(error)
        }
    }    
    useEffect(() => {
        loadPlants()
    }, [])
    
    return <View >
        <View style={styles.frame}>
            <Text style={styles.header}>Chọn loại cây trồng</Text>
        </View>
        <ScrollView style={styles.rectangle}>
            <View style={styles.imageSearch}>
                <TextInput style={styles.searchBar} placeholder="Nhập tên" onChangeText={onKeywordChange}></TextInput>
                <TouchableOpacity style={styles.imageSearch1} onPress={async () => await onSelectImage('photo')}>
                    <Text style={{fontSize: 14, padding: 5}}>Chọn ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageSearch1} onPress={imageSearch}>
                    <Text style={{fontSize: 14, padding: 5}}>Tìm</Text>
                </TouchableOpacity>
            </View>
            {isLoading && <ActivityIndicator style={{justifyContent: 'center'}} size={'large'}></ActivityIndicator>}
            
            {search.map((item) => (
                <View style={selected === item.id? styles.selected: styles.farmer} key={item.id}>
                    <View style={styles.farmer_col1}>
                        <Image source={{uri: "https://android-server-b23y.onrender.com/img/plant/" + item.image}} style={styles.thumbnail} />
                        <View>

                            <Text style={styles.title}>{item.ten_cay}</Text>
                            <Text style={styles.subtitle}>Độ ẩm: {item.minIdealSoilMoisture}-{item.maxIdealSoilMoisture}%</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            if (selected === item.id) {
                                setselected(0)
                            } else {
                                setselected(item.id)
                            }
                        }} style={styles.button}>
                            <Text style={styles.buttonText}>{selected === item.id? "Bỏ": "Chọn"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            
        </ScrollView>
        
        <View style={styles.rectangle2}>
            
            
            <TouchableOpacity style={styles.setHour} onPress={debounce(popUp, 1000)}>
                <Text style={styles.label}>Chọn giờ:      {String(hour.getHours()).padStart(2, '0')}:{String(hour.getMinutes()).padStart(2, '0')}:{String(hour.getSeconds()).padStart(2, '0')} </Text>
                
                {showTime && <RNDateTimePicker is24Hour={true}  display="clock" mode="time" value={hour} onChange={onHourChange}></RNDateTimePicker>}

            </TouchableOpacity>
            
            <Text style={styles.repeatLabel}>Lặp lại</Text>
            <Picker
                selectedValue={repeat}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                    setrepeat(itemValue)
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
}
const styles = StyleSheet.create({
    frame: {
        
        borderRadius: 10, 
        marginLeft: 31,
        
        width: '80%',
        // height: 88,
        backgroundColor: '#fffff', // Màu nền của View
        borderWidth: 1, // Độ dày của viền (tùy chọn)
        borderColor: '#00000', // Màu của viền (tùy chọn)
    },
    rectangle: {
        // alignItems: 'center',
        marginLeft: 31,
        marginTop: 10,
        width: '80%',
        height: '30%',
        backgroundColor: '#1D3133', 
        borderRadius: 10, 
        overflow: 'scroll'
        // flex: 1,
    },
    farmer: {
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
        // 'textAlign': 'left',
        borderBottomWidth: 1,
        paddingLeft: 5,
        paddingVertical: 10,
        flexDirection: "row",
        // justifyContent: 'flex-end'
        
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
        marginVertical: 10,
        width: '40%',
        padding: 5, 
        fontSize: 15,
        backgroundColor: '#FFFFFF',
    },
    imageSearch: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        textAlign: 'left',
        marginLeft: 10,
        flexDirection: 'row',
        // marginVertical: 10,
        // width: '90%',
        // padding: 5, 
        fontSize: 15,
        // backgroundColor: '#FFFFFF',
    },
    imageSearch1: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        textAlign: 'left',
        marginLeft: 10,
        marginVertical: 10,
        // width: '40%',
        padding: 5, 
        fontSize: 15,
        backgroundColor: '#FFFFFF',
    },
    farmer_col1:{
        with: '70%',
        alignItems: 'flex-start',
        justifyContent: "flex-start",
        textAlign: 'left',
        flexDirection: 'row',
        // marginLeft: 20,

    },
    selected: {
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
        // 'textAlign': 'left',
        borderWidth: 1,
        backgroundColor: 'gray',
        width: '100%',
        // height: 100,
        paddingLeft: 5,
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
        width: 60,  
        height: 60, 
        borderRadius: 35, 
        marginLeft: 10,
        overflow: 'hidden',
    },
    title:{
        color: "#ffffff",
        fontSize: 16,
        marginLeft: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
    subtitle:{
        color: "#ffffff",
        fontSize: 14,
        fontStyle: 'italic',
        marginLeft: 20,
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
    label:{
        marginLeft: 10,
        marginVertical: 20,
        color: "white",
        fontSize: 18,
    },
    repeatLabel:{
        marginLeft: 20,
        marginVertical: 10,
        color: "white",
        fontSize: 18,
    },
    picker:{
        
        width: '90%',
        justifyContent: 'center',
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 20,
        color: "black",
        backgroundColor: 'white',
        fontSize: 24,
    },
    buttonOpacity: {

        width: '100%',
        alignItems: 'center',
        width: '80%',
        // height: 60,
        marginTop: 10,
        // marginBottom: 10,
        marginLeft: 30,
        textAlign: "center",
        padding: 15, // Khoảng cách giữa các dòng
        backgroundColor: '#8356D1',
        
    },
    rectangle2: {
        
        marginLeft: 32,
        marginTop: 10,
        width: '80%',
        height: "50%",
        backgroundColor: '#1D3133', // Màu nền của View
        borderRadius: 10, // Bo góc của View (tùy chọn)
        // overflow: 'hidden', // Đảm bảo nội dung không vượt ra khỏi View
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
});