
import 'react-native-gesture-handler';
import React from 'react';
import Camera from './components/Camera.js';
import StorageScreen from "./components/StorageScreen";
import ResultComponent from "./components/ResultComponent";
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
// import {Shapes} from "react-native-background-shapes";

function HomeScreen({navigation}) {
    return (
        <View style={styles.container}>
          {/* <Shape/> */}
          <Button
              style={styles.button_style}
              title="Go to Camera"
              onPress={() => navigation.navigate('Camera')}
          />
          <Button
              style={styles.button_style}
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
      <ResultComponent route={this.props.route}/>
    );
  }
}
class CameraScreen extends React.Component {
  render(){
    return (
      <Camera navigation={this.props.navigation}/>
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  button_style : {
    height: 40,
    width: 188,
    backgroundColor: "rgba(39,33,157,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5
  },
});


const Stack = createStackNavigator();
export default function App() {
  return(
      <NavigationContainer>
          <Stack.Navigator initialRouteName = "Home">
            <Stack.Screen name = "Home" component={HomeScreen} />
            <Stack.Screen name = "Camera" component={CameraScreen} />
            <Stack.Screen name = "StorageScreen" component={Storage} />
            <Stack.Screen name = "Result" component={ResultScreen} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

