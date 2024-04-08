import { ScrollView, TouchableOpacity, View } from "react-native";
import TempAndHumid from "../components/TempAndHumid";
import AutoWater from "../components/AutoWater";
import Icon from 'react-native-vector-icons/FontAwesome5';
export default function Automatic(params) {
    return <ScrollView style={{backgroundColor: '#244542'}}>
        {/* <TempAndHumid> </TempAndHumid> */}
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
            onPress={() => navigation.navigate("WaterHome")}>
            <Icon name="angle-left" size={20} styles={{padding: 10}}>Back</Icon>
            {/* <Text styles={{marginTop: 15}}>Back</Text> */}
            </TouchableOpacity>
        </View>
        <AutoWater> </AutoWater>
    </ScrollView>
}