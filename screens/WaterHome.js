import { ScrollView, Text, View } from "react-native";
import TempAndHumid from "../components/TempAndHumid";
import Command from "../components/Command";

export default function WaterHome(props) {
    return <ScrollView style={{backgroundColor: '#244542'}}>
        <TempAndHumid></TempAndHumid>
        
        <Command ></Command>
    </ScrollView>
};
