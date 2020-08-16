import React from 'react';
import { Dimensions, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CaptureButton from "./CaptureButton"
import axios from 'axios' 

export default class Camera extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            identifedAs: '',
            loading: false,
            selectedFile: null
        }
    }

    //use for API CLARIFAI
    takePicture = async function(){
        if (this.camera) {
            // Pause the camera's preview
            this.camera.pausePreview();
            // Set the activity indicator
            this.setState((previousState, props) => ({
                loading: true
            }));
            // Set options
            const options = {
                base64: true
            };
            // Get the base64 version of the image
            const data = await this.camera.takePictureAsync(options)
            // Get the identified image
            this.identifyImage(data.base64);
        }
    }

    identifyImage(imageData){
        // Initialise Clarifai api
        const Clarifai = require('clarifai');
        const app = new Clarifai.App({
            apiKey: "d5012bfba91c4e97aa9ce05992305adf"
        });
        // Identify the image
        app.models.predict(Clarifai.GENERAL_MODEL, {base64: imageData})
        .then((response) => this.displayAnswer(response.outputs[0].data.concepts[0].name)
        .catch((err) => alert(err))
        );
    }

    //USED FOR API CALL 
    takePicture_v2 = async () => {
        if(this.camera){
            this.camera.pausePreview();
            // Set the activity indicator
            this.setState((previousState, props) => ({
                loading: true
            }));
            const options = { quality: 0.5, base64: false, width: 224 };
            const data = await this.camera.takePictureAsync(options);
            this.setState({selectedFile: data});
            PicturePath = data.uri;
            // console.log(PicturePath);
            this.storePicture(PicturePath);
        }
    }

    storePicture(PicturePath) {
        // console.log(PicturePath);
        if (PicturePath) {
        
          // Create the form data object
          var data = new FormData();
          data.append('image', {
            uri: PicturePath,
            name: 'image.jpeg',
            type: 'image/jpeg'
          });

          const newData = new FormData();
          newData.append('image', this.state.selectedFile, this.state.selectedFile.name);
          axios.post("http://185.92.221.52:5001/predict", newData, {
              onUploadProgress: progressEvent => {
                  console.log("Upload progress: "+ Math.round(progressEvent.loaded/ progressEvent.total*100) );
              }
          }).then(responseData => {
            // Log the response form the server
            // Here we get what we sent to Postman back
            temp = JSON.parse(JSON.stringify(responseData));
            console.log(temp.data);
            if(temp.data.number_plate){
                let np = temp.data.number_plate;
                this.displayAnswer(np);
            }
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
      
        //   fetch('http://192.168.0.110:5000', config).then(responseData => {
        //     // Log the response form the server
        //     // Here we get what we sent to Postman back
        //     console.log(responseData); 
        //   }).catch(err => { console.log(err); });

        //   axios({
        //       url: "http://185.92.221.52:5001/predict",
        //       method: "POST",
        //       headers:{"Accept": null},
        //       data: data
        //   }).then((res)=>{
        //     console.log(res); 
        //   },(err)=>{
        //     console.log(err)
        //   });
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
            // Resume the preview
            this.camera.resumePreview();
    }

    render(){
        return(
        <RNCamera ref={ref => {this.camera = ref;}} style={styles.preview}>
        <ActivityIndicator size="large" style={styles.loadingIndicator} color="#fff" animating={this.state.loading}/>
        {/* <CaptureButton buttonDisabled={this.state.loading} onClick={this.takePicture.bind(this)}/> */}
        <CaptureButton buttonDisabled={this.state.loading} onClick={this.takePicture_v2.bind(this)}/>
        </RNCamera>
        );
    }
}

const styles = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    loadingIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
