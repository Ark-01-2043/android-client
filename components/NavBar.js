import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Another from "../screens/Another"
import Navigation from "./Navigation"
import AutomaticEdit from "../screens/AutomaticEdit"
import ManualEdit from "../screens/ManualEdit"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import WaterHome from "../screens/WaterHome"
import { View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome'


export default function NavBar(props) {
    // const Stack = createNativeStackNavigator()
    // return <NavigationContainer>
    //     <Stack.Navigator initialRouteName="Navigation" screenOptions={{
    //         headerShown: false
    //     }}>
    //         <Stack.Screen name="Navigation" component={Navigation} screenOptions={{
    //         headerShown: false
    //     }}/>
    //         {/* <Stack.Screen name="AutomaticEdit" component={AutomaticEdit} options={{
    //         headerShown: false
    //     }}/>
    //         <Stack.Screen name="ManualEdit" component={ManualEdit} screenOptions={{
    //         headerShown: false
    //     }}/> */}
    //         <Stack.Screen name="Another" component={Another} screenOptions={{
    //         headerShown: false
    //     }}/>
            
    //     </Stack.Navigator>
    // </NavigationContainer>
    const Tab = createBottomTabNavigator()
    const screenOptions = ({route})=> ({
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(0,0,0,0.5)',    
        tabBarActiveBackgroundColor: '#8356D1',
        tabBarInactiveBackgroundColor: '#8356D1',
        tabBarBackground: () => (
            <View style={{backgroundColor: '#8356D1', flex: 1}}></View>
          ),
        tabBarIcon: ({focused, color, size}) => {
            
            /*
            let screenName = route.name
            let iconName = "facebook";
            if(screenName == "ProductGridView") {
                iconName = "align-center"
            } else if(screenName == "FoodList") {
                iconName = "accusoft"
            } else if(screenName == "Settings") {
                iconName = "cogs"
            }
            */
            return <Icon 
                style={{
                    paddingTop: 5
                }}
                name= {route.name == "WaterHome" ? "home":
                    (route.name == "Automatic" ? "android" : (
                        route.name == "Manual" ? "exchange" : 
                        (route.name == "Profile" ? "user" : 
                        (route.name == "History" ? "user" : "user"))
                    ))}
                // name = "home"
                type="FontAwesome"
                size={23} 
                color={focused ? 'white' : 'rgba(0,0,0,0.5)'} 
            />
        },    
    })
    // return <Tab.Navigator screenOptions={{headerShown: false}}>
    return <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name={"WaterHome"} component={WaterHome} screenOptions={{headerShown: false}}>

            </Tab.Screen>
            <Tab.Screen name={"Another"} component={Another} screenOptions={{headerShown: false}}>

            </Tab.Screen>
            
    </Tab.Navigator>
}