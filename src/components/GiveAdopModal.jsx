import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ip } from './Ip';


const GiveAdopModal = ({ isVisible, pet, onClose }) => {
  const [users, setUsers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [openUserPicker, setOpenUserPicker] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fechaAdopcion, setFechaAdopcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${Ip}/api/usuarios/listar`);
        const data = await response.json();
        const options = data.map(user => ({ label: user.nombre, value: user.id }));
        setUsers(data);
        setUserOptions(options);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (isVisible) {
      fetchUsers();
      // Set the current date in yyyy-mm-dd format
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // yyyy-mm-dd
      setFechaAdopcion(formattedDate);
    }
  }, [isVisible]);

  const handleGiveAdop = async () => {
    if (!selectedUser) {
      Alert.alert('Error', 'Selecciona un usuario para dar en adopción.');
      return;
    }

    try {
      const response = await fetch(`${Ip}/api/adopcion/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: selectedUser,
          mascota_id: pet.id,
          fecha_adopcion: fechaAdopcion,
          ubicacion,
        }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'La adopción se ha registrado correctamente.');
// Notifica al componente padre que la mascota fue actualizada
        onClose(); // Cierra el modal después de la adopción
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Error al registrar la adopción');
      }
    } catch (error) {
      Alert.alert('Error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
      console.error('Error registrando adopción:', error);
    }
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Registrar Adopción</Text>
        <Text>¿Estás seguro de que quieres registrar esta adopción?</Text>
        
        <DropDownPicker
          open={openUserPicker}
          value={selectedUser}
          items={userOptions}
          setOpen={setOpenUserPicker}
          setValue={setSelectedUser}
          setItems={setUserOptions}
          placeholder="Seleccionar Usuario"
          style={styles.dropdown}
          dropDownStyle={styles.dropdownContainer}
        />

        <TextInput
          style={styles.input}
          placeholder="Fecha de Adopción"
          value={fechaAdopcion}
          onChangeText={setFechaAdopcion}
        />

        <TextInput
          style={styles.input}
          placeholder="Ubicación"
          value={ubicacion}
          onChangeText={setUbicacion}
        />

        <View style={styles.modalBtn}>
          <Button title="Registrar Adopción" onPress={handleGiveAdop} color="#FFA500" />
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
  dropdown: {
    width: '100%',
    marginVertical: 10,
  },
  dropdownContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
    marginTop: 20,
  }
});

export default GiveAdopModal;
