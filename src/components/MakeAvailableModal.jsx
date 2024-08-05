import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ip } from './Ip';


export default function MakeAvailableModal({ isVisible, onClose, pet, mascota }) {
  const handleConfirm = async () => {
    try {
      const response = await fetch(`${Ip}/api/mascotas/${pet.id}/available/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: '2' }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'La mascota ha sido marcada como Disponible.');
        onClose(); // Cierra el modal
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Error al marcar la mascota como adoptada');
      }

      mascota()

    } catch (error) {
      console.error('Error al actualizar el estado de la mascota:', error);
      Alert.alert('Error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>Marcar como Disponible</Text>
          <Text style={styles.message}>¿Estás seguro de que quieres marcar esta mascota como Disponible?</Text>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Marcar como Disponible</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
  },
});

