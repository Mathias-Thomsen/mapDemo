import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import MapView , {Marker} from 'react-native-maps'
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'
import { uploadImageToStorage, saveMarker, fetchMarkers } from './firebase/useFirebase';


export default function App() {
  const [markers, setMarkers] = useState([])
  const [imagePaths, setImagePaths] = useState([])

  const [region, setRegion] = useState({
    latitude:55,
    longitude:10,
    latitudeDelta:20, //Hvor mange grader skal vises på kortet
    longitudeDelta: 20,
  })

  
  useEffect(() => {
    const getMarkers = async () => {
      const fetchedMarkers = await fetchMarkers();
      
      const markersToDisplay = fetchedMarkers.map(marker => ({
        coordinate: {
          latitude: marker.latitude,
          longitude: marker.longitude
        },
        key: marker.id, 
        title: marker.title
        
      }));
      setMarkers(markersToDisplay);
    };
  
    getMarkers();
  }, []); 
  

  async function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate;
    
    const imageUri = await pickImage(); // Antager at pickImage returnerer en URI for det valgte billede
    const imageUrl = await uploadImageToStorage(imageUri, `marker_images/${Date.now()}`);
    
    const newMarker = {
      latitude, 
      longitude,
      imageUrl, // Tilføj URL'en fra det uploadede billede
      title: 'Good place?',
    };
    
    await saveMarker(newMarker); // Gem markøren med billed-URL
    
    setMarkers(prevMarkers => [...prevMarkers, { ...newMarker, key: Date.now().toString() }]);
  }
  
  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      return result.uri; // Returnerer URI'en for det valgte billede
    }
    return null;
  }
  
  
  

  return (
    <View style={styles.container}>

      <MapView 
        style={styles.map}
        region={region} 
        onLongPress={addMarker}
      >
        {markers.map(marker => (
          <Marker
            coordinate={marker.coordinate}
            key={marker.key}
            title={marker.title}

            
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  }
});
