
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { saveTrip } from '../TripService';

export default function HomeScreen({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [incidentDetected, setIncidentDetected] = useState(false);
  const [tripTimer, setTripTimer] = useState(0);
  const cameraRef = useRef(null);
  const tripIntervalRef = useRef(null);
  const routeCoordinates = useRef([]);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (isRecording) {
      tripIntervalRef.current = setInterval(() => {
        setTripTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(tripIntervalRef.current);
      setTripTimer(0);
    }
    return () => clearInterval(tripIntervalRef.current);
  }, [isRecording]);

  const startTrip = async () => {
    if (hasCameraPermission && hasLocationPermission) {
      setIsRecording(true);
      setIncidentDetected(false);
      routeCoordinates.current = [];

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (location) => {
          routeCoordinates.current.push({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );

      if (cameraRef.current) {
        const video = await cameraRef.current.recordAsync();
        // This is a simplified version. In a real app, you'd handle the video URI.
      }
    }
  };

  const endTrip = async () => {
    setIsRecording(false);
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }

    // In a real app, you would get the video URI from the recording result.
    const videoUri = "some-video-uri"; 

    if (incidentDetected) {
      const trip = {
        userId: 'some-user-id', // Replace with actual user ID
        startTime: new Date(Date.now() - tripTimer * 1000),
        endTime: new Date(),
        routeCoordinates: routeCoordinates.current,
        incidentDetected: incidentDetected,
        videoUri: videoUri,
      };
      await saveTrip(trip);
    }

    // Reset state
    setIncidentDetected(false);
    routeCoordinates.current = [];
  };

  const markIncident = () => {
    setIncidentDetected(true);
  };

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasLocationPermission === false) {
    return <Text>No access to camera or location</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} />
      <View style={styles.buttonContainer}>
        {!isRecording ? (
          <Button title="Start Trip" onPress={startTrip} />
        ) : (
          <>
            <Button title="End Trip" onPress={endTrip} />
            <Button title="Mark Incident" onPress={markIncident} />
          </>
        )}
      </View>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{tripTimer}s</Text>
      </View>
      <Button title="View Trips" onPress={() => navigation.navigate('Trips')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timerContainer: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  timerText: {
    color: 'white',
    fontSize: 20,
  },
});
