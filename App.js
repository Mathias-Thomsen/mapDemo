import { useState, useRef, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MapView , {Marker} from 'react-native-maps'
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'
import { saveMarker, fetchMarkers, uploadImage } from './firebase/useFirebase'; // Antager denne funktion er implementeret } from './firebase/useFirebase';


export default function App() {
  const [markers, setMarkers] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  

  const [region, setRegion] = useState({
    latitude:55,
    longitude:10,
    latitudeDelta:20, //Hvor mange grader skal vises på kortet
    longitudeDelta: 20,
  })

  useEffect(() => {
    const getMarkers = async () => {
      try {
        const fetchedMarkers = await fetchMarkers();
        const markersToDisplay = fetchedMarkers.map(marker => ({
          coordinate: {
            latitude: marker.latitude,
            longitude: marker.longitude,
            
          },
          key: marker.id, 
          imageUrl: marker.imageUrl
           
          
        }));
        setMarkers(markersToDisplay); 
      } catch (error) {
        console.error("Fejl ved hentning af markører:", error);
      }
    };
  
    getMarkers();
  }, []);
  

  async function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate;
  
    // Anmod om medietilladelse
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Beklager, vi har brug for medietilladelser for at gøre dette!');
      return;
    }
  
    // Brugeren vælger et billede
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    
    });

   
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log(imageUri);
      const fileName = `markers/${Date.now()}.jpg`;
      try {
        const imageUrl = await uploadImage(imageUri, fileName);
        const markerId = await saveMarker({ latitude, longitude, imageUrl });
        setMarkers(prevMarkers => [...prevMarkers, { coordinate: { latitude, longitude }, key: markerId, imageUrl }]);
      } catch (error) {
        console.error("Fejl ved tilføjelse af markør og billede:", error);
        // Håndter fejlen, vis en besked til brugeren, osv.
      }
    }
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
            onPress={() => {
              setSelectedImage(marker.imageUrl);
              setModalVisible(true);
            }}
          />
        ))}
      </MapView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Luk</Text>
            </TouchableOpacity>
            {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 300, height: 300 }} />}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});
