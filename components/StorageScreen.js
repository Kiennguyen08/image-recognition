import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios' 

export default class StorageScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        resourcePath: {},
        };
    }
    selectFile = () => {
        var options = {
          title: 'Select Image',
          customButtons: [
            { 
              name: 'customOptionKey', 
              title: 'Choose file from Custom Option' 
            },
          ],
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
    
        ImagePicker.launchImageLibrary(options, res => {
          console.log('Response = ', res);
    
          if (res.didCancel) {
            console.log('User cancelled image picker');
          } else if (res.error) {
            console.log('ImagePicker Error: ', res.error);
          } else if (res.customButton) {
            console.log('User tapped custom button: ', res.customButton);
            alert(res.customButton);
          } else {
            let source = res;
            this.setState({
              resourcePath: source,
            });
          }
          this.predictPicture(this.state.resourcePath.uri)
        });
    }

    predictPicture(PicturePath) {
        if (PicturePath) {
            // Create the form data object
            var data = new FormData();
            data.append('image', {
                uri: PicturePath,
                name: 'image.jpeg',
                type: 'image/jpeg'
            });
            // const newData = new FormData();
            // newData.append('image', this.state.selectedFile, this.state.selectedFile.name);
            axios.post("https://car-plate-detection.herokuapp.com/predict", data, {
                onUploadProgress: progressEvent => {
                    console.log("Upload progress: "+ Math.round(progressEvent.loaded/ progressEvent.total*100) );
                }
            }).then(responseData => {
                // Log the response form the server
                // Here we get what we sent to Postman back
                temp = JSON.parse(JSON.stringify(responseData));
                console.log(temp.data);
                // if(temp.data.number_plate){
                //     let np = temp.data.number_plate;
                //     this.displayAnswer(np);
                // }
                this.displayAnswer(JSON.stringify(temp.data));
            },(err)=>{
                console.log(err)
            });
          // Create the config object for the POST
          // You typically have an OAuth2 token that you use for authentication
          const config = {
            method: 'post',
            headers: {'Content-Type': 'multipart/form-data'},
            body: data
          };
        }
    }
    displayAnswer(identifiedImage){
        // Dismiss the acitivty indicator
        this.setState({
            identifedAs:identifiedImage,
            loading:false
        });
        // Show an alert with the answer on
        Alert.alert(
                this.state.identifedAs,
                '',
                { cancelable: false }
            )
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                <Image
                    source={{
                    uri: 'data:image/jpeg;base64,' + this.state.resourcePath.data,
                    }}
                    style={{ width: 100, height: 100 }}
                />
                <Image
                    source={{ uri: this.state.resourcePath.uri }}
                    style={{ width: 200, height: 200 }}
                />
                {/* <Text style={{ alignItems: 'center' }}>
                    {this.state.resourcePath.uri}
                </Text> */}
        
                <TouchableOpacity onPress={this.selectFile} style={styles.button}  >
                    <Text style={styles.buttonText}>Select File</Text>
                </TouchableOpacity>       
                <TouchableOpacity onPress={this.predictPicture} style={styles.button}  >
                    <Text style={styles.buttonText}>Send Image</Text>
                </TouchableOpacity>    
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff'
    },
    button: {
      width: 250,
      height: 60,
      backgroundColor: '#3740ff',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      marginBottom:12    
    },
    buttonText: {
      textAlign: 'center',
      fontSize: 15,
      color: '#fff'
    }
  });