import { useNavigation } from "@react-navigation/native";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {debounce} from "lodash"
export default function Command(props) {
    // const {navigation, route} = props
    //functions of navigate to/back
    // const {navigate, goBack} = navigation
    navigation = useNavigation()
    return <View style={styles.rectangle}>
            
            <TouchableOpacity style={styles.buttonOpacity} onPress={debounce((e) => {navigation.navigate('Schedule')}, 1000)}>
                <Text style={styles.buttonText} >Xem danh sách</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.buttonOpacity}  onPress={debounce((e) => {navigation.navigate('History')}, 1000)}>
                <Text style={styles.buttonText} >Lịch sử</Text>
            </TouchableOpacity>
        </View>

}
const styles = StyleSheet.create({
    
    rectangle: {
        alignItems: 'center',
        marginLeft: 32,
        marginTop: 100,
        width: 344,
        height: 470,
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
    },
    nextText: {
        fontSize: 20,
        color: "#000000",
        
    },
    nextHeader: {
        fontSize: 18,
        color: "#000000",
        fontWeight: "bold"
        
    },
    nextFooter: {
        fontSize: 16,
        color: "#000000",
        fontStyle: "italic"
        
    },
    next: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '80%',
        // height: 60,
        marginTop: 20,
        textAlign: "center",
        padding: 15, 
        backgroundColor: '#FFFFFF',
        
    },
});