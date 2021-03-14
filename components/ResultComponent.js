import React from 'react';
import {  Dimensions, StyleSheet, Text, View, TouchableOpacity, Button, Image, Alert } from 'react-native';

class StorageScreen extends React.Component {
    renderImage = (img_path, topPosition, bottomPosition, leftPosition, rightPosition) => {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: img_path
            }}
            style={styles.image}
            // resizeMode="stretch"
          />
          <View
            style={[
              styles.rectangle,
              {
                top: topPosition,
                bottom: bottomPosition,
                left: leftPosition,
                right: rightPosition
              }
            ]}
          />
        </View>
      );
    };

    render(){
    const { image_path, res_predict } = this.props.route.params;
    let res = JSON.parse(res_predict);
    let base64Image = res.encoded_image;
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Result Screen</Text>
          {/* <Image
            source={{ uri: image_path}}
            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width }}
          /> */}
          {/* <View style={styles.container}>{this.renderImage(image_path,styles.imageContainer.height-coor[1][0],styles.imageContainer.height-coor[0][0], 200, 100)}</View> */}
          <Image
            source={{ uri: `data:image/jpeg;base64,${base64Image}`}}
            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width }}
          />
          <Text style={[styles.title]}>Car Number: {res.number_plate}</Text>
          <Text style={[styles.title]}>Type: {res.vehicle_type}</Text>
          <Text style={[styles.title]}>Time: {res.time_execution}</Text>
        </View>
      );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    alignSelf: "center"
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width
  },
  rectangle: {
    borderWidth: 3,
    borderColor: "red",
    position: "absolute"
  },
  title: {
    fontSize: 24,     
    fontWeight: 'bold',  
    
  },   
});
export default StorageScreen;