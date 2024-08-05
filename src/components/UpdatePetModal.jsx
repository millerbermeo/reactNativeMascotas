import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import { Ip } from '../components/Ip'; // Asegúrate de que la ruta es correcta

const UpdatePetModal = ({ isVisible, onClose, pet, mascota }) => {
  const [petName, setPetName] = useState(pet?.mascota_nombre || '');
  const [age, setAge] = useState(pet?.edad || '');
  const [breed, setBreed] = useState(pet?.raza || '');
  const [description, setDescription] = useState(pet?.descripcion || '');
  const [imageUri, setImageUri] = useState(pet?.imagen_url || null);
  const [sterilized, setSterilized] = useState(pet?.esterilizado == "si");
  const [genderValue, setGenderValue] = useState(pet?.genero || null);
  const [statusValue, setStatusValue] = useState(pet?.estado || '1'); // Asegúrate de que pet.estado esté en el formato correcto
  const [openGenderPicker, setOpenGenderPicker] = useState(false);
  const [openStatusPicker, setOpenStatusPicker] = useState(false);
  const [genderOptions, setGenderOptions] = useState([
    { label: 'Macho', value: 'macho' },
    { label: 'Hembra', value: 'hembra' },
  ]);
  const [statusOptions, setStatusOptions] = useState([
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Disponible', value: 'Disponible' },
    { label: 'Adoptado', value: 'Adoptado' },
  ]);
  console.log(pet?.usuario_id)
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${Ip}/api/mascotas/actualizar/${pet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: petName,
          edad: age,
          raza: breed,
          descripcion: description,
          esterilizado: sterilized ? 1 : 2,
          genero: genderValue,
          estado: statusValue,
          imagen_url: imageUri,
          usuario_id: pet?.usuario_id
        }),
      });

      
      const data = await response.json();
      if (response.ok) {
        alert('Mascota actualizada con éxito');
        onClose();  // Cierra el modal después de la actualización exitosa
      } else {
        alert(`Error: ${data.message}`);
      }
      mascota()
    } catch (error) {
      console.error('Error updating pet:', error);
      alert('Error al actualizar la mascota');
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({}, (response) => {
      if (!response.didCancel && !response.error) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Actualizar Mascota</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la mascota"
          value={petName}
          onChangeText={setPetName}
        />
        <TextInput
          style={styles.input}
          placeholder="Edad"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        <TextInput
          style={styles.input}
          placeholder="Raza"
          value={breed}
          onChangeText={setBreed}
        />

        <DropDownPicker
          open={openStatusPicker}
          value={statusValue}
          items={statusOptions}
          setOpen={setOpenStatusPicker}
          setValue={setStatusValue}
          setItems={setStatusOptions}
          placeholder="Seleccionar Estado"
          style={styles.dropdown}
          dropDownStyle={styles.dropdownContainer}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: `http://${Ip}:3000${imageUri}` }} style={styles.image} />}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setSterilized(!sterilized)}
        >
          <View style={[styles.checkbox, sterilized && styles.checkboxChecked]}>
            {sterilized && <Text style={styles.checkboxText}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Esterilizado</Text>
        </TouchableOpacity>

        <DropDownPicker
          open={openGenderPicker}
          value={genderValue}
          items={genderOptions}
          setOpen={setOpenGenderPicker}
          setValue={setGenderValue}
          setItems={setGenderOptions}
          placeholder="Seleccionar Género"
          style={styles.dropdown}
          dropDownStyle={styles.dropdownContainer}
        />  
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdate}
        >
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxWidth: 500,
    height: "auto",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  dropdown: {
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
  },
  dropdownContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
  },
  imagePicker: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#FFF',
    fontSize: 16,
  },
  image: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkboxText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UpdatePetModal;
