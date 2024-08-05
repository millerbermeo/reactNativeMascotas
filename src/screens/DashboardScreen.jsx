import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import PetCard from '../components/PetCard'; // Asegúrate de que la ruta sea correcta
import { Ip } from '../components/Ip';

export default function DashboardScreen() {
  const [pets, setPets] = useState([]);


    const fetchPets = async () => {
      try {
        const response = await fetch(`${Ip}/api/mascotas/listar`);
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
    useEffect(() => {
    fetchPets();
  }, []);



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard de Mascotas</Text>
      <ScrollView>
        {pets.map(pet => (
          <PetCard
            key={pet.id}
            pet={pet}
            mascota={fetchPets}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
