import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Button, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ip } from '../components/Ip';

export default function AdopScreen() {
  const route = useRoute();
  const { id } = route.params || {};
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        console.log(`Fetching details for pet ID: ${id}`);
        const response = await fetch(`${Ip}/api/mascotas/listar`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Pet list:', data);
        const filteredPet = data.filter(pet => pet.id === id)[0];
        setPet(filteredPet);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pet details:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchPetDetails();
    }
  }, [id]);

  const handleWhatsAppClick = () => {
    if (!pet) return;

    const phoneNumber = pet.telefono;
    const message = `¡Hola!\n\nMe encantaría saber más sobre la adopción de esta adorable mascota:\n\nNombre: ${pet.mascota_nombre}\nEdad: ${pet.edad} años\nGénero: ${pet.genero || 'N/A'}\nDueño Actual: ${pet.dueno}\n\nEstoy muy interesado en brindarle un hogar lleno de amor. Además, me gustaría obtener información sobre los siguientes aspectos:\n\nAntecedentes del animal:\nVacunas:\nHistorial médico veterinario:\n\n¿Podrías darme más detalles sobre el proceso de adopción? ¡Muchas gracias!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    Linking.openURL(whatsappLink).catch(err => console.error('Error opening WhatsApp:', err));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontró la mascota.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Detalles de la Mascota</Text>
      </View>

      <Image source={{ uri: `${Ip}${pet.imagen_url}` }} style={styles.petImage} />

      <View style={styles.details}>
        <Text style={styles.detailText}>Nombre: {pet.mascota_nombre}</Text>
        <Text style={styles.detailText}>Edad: {pet.edad}</Text>
        <Text style={styles.detailText}>Género: {pet.genero}</Text>
        <Text style={styles.detailText}>Raza: {pet.raza}</Text>
        <Text style={styles.detailText}>Esterilizado: {pet.esterilizado}</Text>
        <Text style={styles.detailText}>Descripción: {pet.descripcion}</Text>
        <Text style={styles.detailText}>Estado: {pet.estado}</Text>
        <Text style={styles.detailText}>Fecha de Creación: {new Date(pet.fecha_creacion).toLocaleDateString()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Contactar por WhatsApp" onPress={handleWhatsAppClick} color="#25D366" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  petImage: {
    width: 250,
    height: 250,
    borderRadius: 999, // Redondear más la imagen
    marginBottom: 20,
    alignSelf: 'center',
  },
  details: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    paddingBottom: 20,
  },
});
