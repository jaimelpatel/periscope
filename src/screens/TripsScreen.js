
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';

export default function TripsScreen() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const querySnapshot = await getDocs(collection(db, "trips"));
      const tripsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrips(tripsData);
    };

    fetchTrips();
  }, []);

  const renderTrip = ({ item }) => (
    <View style={styles.tripItem}>
      <Text style={styles.tripText}>Date: {new Date(item.startTime.seconds * 1000).toLocaleDateString()}</Text>
      <Text style={styles.tripText}>Incident: {item.incidentDetected ? 'Yes' : 'No'}</Text>
      {item.videoURL && (
        <Button title="View" onPress={() => console.log(item.videoURL)} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    padding: 20,
  },
  tripItem: {
    backgroundColor: '#2c2c2e',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  tripText: {
    color: 'white',
    fontSize: 16,
  },
});
