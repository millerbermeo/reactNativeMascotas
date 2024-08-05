import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Ip } from './Ip';

const DeletePetModal = ({ isVisible, pet, onClose, mascota }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`${Ip}/api/mascotas/eliminar/${pet.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        Alert.alert('Éxito', 'Mascota eliminada correctamente');
 // Notifica al componente padre que la mascota fue eliminada
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Error al eliminar la mascota');
      }
    } catch (error) {
      Alert.alert('Error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
      console.error('Error eliminando mascota:', error);
    }
    mascota()
    onClose();
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Eliminar Mascota</Text>
        <Text>¿Estás seguro de que quieres eliminar esta mascota?</Text>
        <View style={styles.modalBtn}>
        <Button title="Eliminar" onPress={handleDelete} color="red" />
        <Button title="Cancelar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBtn: {
    display: "flex",
    flexDirection: "row",
  }
});

export default DeletePetModal;
