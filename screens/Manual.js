import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import TempAndHumid from "../components/TempAndHumid";
import SetHumid from "../components/SetHumid";
import { useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome5';
export default function Manual(params) {
    
    
    return <View style={{backgroundColor: '#244542'}}>
        <View>
            <TouchableOpacity
            style={{
                // backgroundColor: 'white',
                // marginLeft: 10,
                // marginTop: 10,
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
        
        
        
        <SetHumid></SetHumid>
    </View>
}