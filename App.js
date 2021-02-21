
import 'react-native-gesture-handler';
import React from 'react';
import Camera from './components/Camera.js';
import StorageScreen from "./components/StorageScreen";
import ResultComponent from "./components/ResultComponent";
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

function HomeScreen({navigation}) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* <Text>Home Screen</Text> */}
        <Button
            title="Go to Camera"
            onPress={() => navigation.navigate('Camera')}
        />
        <Button
            title="Choose image from Storage"
            onPress={() => navigation.navigate('StorageScreen')}
        />
      </View>
    );
}
class Storage extends React.Component{
  render(){
    return(
      <StorageScreen navigation={this.props.navigation}/>
    )
  }
}
class ResultScreen extends React.Component {
  render(){
    return (
      <ResultComponent />
    );
  }
}
const Stack = createStackNavigator();
export default function App() {
  return(
      <NavigationContainer>
          <Stack.Navigator initialRouteName = "Home">
            <Stack.Screen name = "Home" component={HomeScreen} />
            <Stack.Screen name = "Camera" component={Camera} />
            <Stack.Screen name = "StorageScreen" component={Storage} />
            <Stack.Screen name = "Result" component={ResultScreen} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}