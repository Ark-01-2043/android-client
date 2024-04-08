import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import AutoWater from "./AutoWater"
import Automatic from "../screens/Automatic"
import Manual from "../screens/Manual"
import History from "../screens/History"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import WaterHome from "../screens/WaterHome"
import { View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome'
import Schedule from "../screens/Schedule"
import Another from "../screens/Another"
import AutomaticEdit from "../screens/AutomaticEdit"
import ManualEdit from "../screens/ManualEdit"
import NavBar from "./NavBar"
export default function Navigation(params) {
    const Stack = createNativeStackNavigator()
    return <NavigationContainer>
        <Stack.Navigator initialRouteName="WaterHome" screenOptions={{
            headerShown: false
        }}>
            
            <Stack.Screen name="NavBar" component={NavBar} screenOptions={{
            headerShown: false
            }}/>
            
            
            <Stack.Screen name="Automatic" component={Automatic} screenOptions={{
                headerShown: false
            }}/>    
            <Stack.Screen name="Manual" component={Manual} screenOptions={{
                headerShown: false
            }}/>
            <Stack.Screen name="AutomaticEdit" component={AutomaticEdit} screenOptions={{
                headerShown: false
            }}/>
            <Stack.Screen name="ManualEdit" component={ManualEdit} screenOptions={{
                headerShown: false
            }}/>
            <Stack.Screen name="Schedule" component={Schedule} screenOptions={{
                headerShown: false
            }}/>
            <Stack.Screen name="History" component={History} screenOptions={{
                headerShown: false
            }}/>
        </Stack.Navigator>
    </NavigationContainer>
    // const Tab = createBottomTabNavigator()
    // const screenOptions = ({route})=> ({
    //     headerShown: false,
    //     tabBarActiveTintColor: 'white',
    //     tabBarInactiveTintColor: 'rgba(0,0,0,0.5)',    
    //     tabBarActiveBackgroundColor: '#8356D1',
    //     tabBarInactiveBackgroundColor: '#8356D1',
    //     tabBarBackground: () => (
    //         <View style={{backgroundColor: '#8356D1', flex: 1}}></View>
    //       ),
    //     tabBarIcon: ({focused, color, size}) => {
            
    //         /*
    //         let screenName = route.name
    //         let iconName = "facebook";
    //         if(screenName == "ProductGridView") {
    //             iconName = "align-center"
    //         } else if(screenName == "FoodList") {
    //             iconName = "accusoft"
    //         } else if(screenName == "Settings") {
    //             iconName = "cogs"
    //         }
    //         */
    //         return <Icon 
    //             style={{
    //                 paddingTop: 5
    //             }}
    //             name= {route.name == "WaterHome" ? "home":
    //                 (route.name == "Automatic" ? "android" : (
    //                     route.name == "Manual" ? "exchange" : 
    //                     (route.name == "Profile" ? "user" : 
    //                     (route.name == "History" ? "user" : "user"))
    //                 ))}
    //             // name = "home"
    //             type="FontAwesome"
    //             size={23} 
    //             color={focused ? 'white' : 'rgba(0,0,0,0.5)'} 
    //         />
    //     },    
    // })
    // // return <Tab.Navigator screenOptions={{headerShown: false}}>
    // return <Tab.Navigator screenOptions={screenOptions}>
    //         <Tab.Screen name={"WaterHome"} component={WaterHome} screenOptions={{headerShown: false}}>

    //         </Tab.Screen>
    //         <Tab.Screen name={"Another"} component={Another} screenOptions={{headerShown: false}}>

    //         </Tab.Screen>
    //         {/* <Tab.Screen name={"Automatic"} component={
    //             Automatic
    //         } screenOptions={{headerShown: false}}>

    //         </Tab.Screen>
    //         <Tab.Screen name={"Manual"} component={Manual} options={{headerShown: false}}>

    //         </Tab.Screen>
    //         <Tab.Screen name={"History"} component={History} screenOptions={{headerShown: false}}>

    //         </Tab.Screen>
    //         <Tab.Screen name={"Schedule"} component={Schedule} screenOptions={{headerShown: false}}>

    //         </Tab.Screen> */}
    // </Tab.Navigator>

}
