import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, ProgressBarAndroid, ProgressBarAndroidBase, ProgressBarAndroidComponent, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import CircularProgress from "react-native-circular-progress-indicator";

// import { AnimatedGaugeProgress, GaugeProgress } from "react-native-simple-gauge";
// import CircularProgress from "react-native-circular-progress-indicator";
// import Gauge from "react-native-gauge"

export default function TempAndHumid(params) {
    const [TempAverage, setTempAverage] = useState(0)
    const [HumAverage, setHumAverage] = useState(0)
    const navigation = useNavigation()
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
    useEffect(() => {
        
        const unsubscribe = navigation.addListener('focus', fetchData)
        return unsubscribe
    }, [])
    return <View style={{flexDirection: "column"}}> 
        <View style={styles.firstRow}>
            
            <Text style={styles.text}>Nhiệt độ</Text>
            
            <Text style={styles.humidity}>Độ ẩm</Text>
        </View>
        
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.temp}>{TempAverage}℃</Text>
            <View style={{marginLeft: 95, marginTop: 35}}>
                <CircularProgress
                    
                    radius={55}
                    value={HumAverage}
                    textColor='#222'
                    fontSize={20}
                    valueSuffix={'%'}
                    activeStrokeColor={'cyan'}
                    inActiveStrokeOpacity={0.2}
                    duration={4000}
                />
            </View>
            
            {/* <Text style={styles.humid}>85%</Text> */}
            
            
        </View>
        
    </View>
};
const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [86, 72, 90, 84, 92, 88]
    }]
};
const styles = StyleSheet.create({
    firstRow: {
        marginTop: 30, 
        flexDirection: 'row',
        
        
    },
    text: {
        marginLeft: 30,
        
        width: 115,
        height: 42,
        textAlignVertical: 'center',
        textAlign: 'center', // Để canh giữa theo chiều ngang
        lineHeight: 42, // Độ cao của dòng văn bản để canh giữa theo chiều dọc
        fontFamily: 'Roboto',
        fontSize: 30,
        color: 'white',
    },
    humidity: {
        marginLeft: 70,
        width: 142,
        height: 42,
        textAlignVertical: 'center',
        textAlign: 'center', // Để canh giữa theo chiều ngang
        lineHeight: 42, // Độ cao của dòng văn bản để canh giữa theo chiều dọc
        fontFamily: 'Roboto',
        fontSize: 30,
        color: 'white',
        
    },
    temp:{
        width: 105,
        height: 70,
        marginLeft: 35,
        marginTop: 30,
        fontSize: 50,
        backgroundColor: 'transparent',
        color: 'white',
    },
    humid:{
        width: 105,
        height: 70,
        marginLeft: 100,
        marginTop: 30,
        fontSize: 50,
        backgroundColor: 'transparent',
        color: '#FFFFFF',
    },
    rectangle: {
        alignItems: 'center',
        marginLeft: 32,
        marginTop: 130,
        width: 344,
        height: 447,
        backgroundColor: '#1D3133', // Màu nền của View
        borderRadius: 10, // Bo góc của View (tùy chọn)
        overflow: 'hidden', // Đảm bảo nội dung không vượt ra khỏi View
    },
    buttonOpacity: {
        alignItems: 'center',
        width: '80%',
        height: 60,
        marginTop: 50,
        textAlign: "center",
        padding: 15, // Khoảng cách giữa các dòng
        backgroundColor: '#8356D1',
        
    },
    buttonText: {
        fontSize: 20,
        color: "#FFFFFF",
    }
});

