import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, FlatList } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ip } from '../components/Ip';
import { AuthContext } from '../components/AuthContext';

export default function RegisterPetScreen({ navigation }) {
  const { authState } = useContext(AuthContext);

  const [petName, setPetName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState('');
  const [sterilized, setSterilized] = useState(false);
  const [gender, setGender] = useState(null);
  
  const [openGenderPicker, setOpenGenderPicker] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [genderOptions, setGenderOptions] = useState([
    { label: 'Macho', value: '1' },
    { label: 'Hembra', value: '2' }
  ]);

  const selectImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleRegisterPet = async () => {
    if (!petName || !age || !breed || !description || !genderValue || !imageUri) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', petName);
    formData.append('edad', age);
    formData.append('raza', breed);
    formData.append('descripcion', description);
    formData.append('estado', 1);
    formData.append('esterilizado', sterilized ? 1 : 2);
    formData.append('genero', genderValue);
    formData.append('usuario_id', authState.id);
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'petImage.jpg',
    });

    try {
      const response = await fetch(`${Ip}/api/mascotas/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Mascota registrada correctamente', [
          { text: 'OK', onPress: () => navigation.navigate('HomeTabs', { refresh: true }) },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Error al registrar la mascota');
      }
    } catch (error) {
      Alert.alert('Error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
      console.error('Error registrando mascota:', error);
    }
  };

  const renderForm = () => (
    <View style={styles.form}>
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
      <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
        <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setSterilized(!sterilized)}
      >
        <View style={[styles.checkbox, sterilized && styles.checkboxChecked]}>
          {sterilized && <Text style={styles.checkboxText}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>Esterilizado</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegisterPet}
      >
        <Text style={styles.buttonText}>Registrar Mascota</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={[{}]} // Dummy data to render one item
      renderItem={renderForm}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  imageButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
