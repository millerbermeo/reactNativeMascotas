import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/Card';
import { Ip } from '../components/Ip';
import { AuthContext } from '../components/AuthContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { authState, logout } = useContext(AuthContext); // Obtener el estado de autenticación del contexto

  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPets = async () => {
    try {
      const response = await fetch(`${Ip}/api/mascotas/listar`);
      const data = await response.json();
      setPets(data);
      setFilteredPets(data.filter(pet => pet.estado === 'Disponible'));
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPets();
  }, []);
  

  useEffect(() => {
    const filtered = pets
      .filter(pet => pet.estado === 'Disponible') // Filtrar solo las mascotas disponibles
      .filter(pet =>
        pet.mascota_nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );

    setFilteredPets(filtered);
  }, [searchQuery, pets]);

  const handleCardPress = (pet) => {
    navigation.navigate('Adoptar', {
      image: `${Ip}${pet.imagen_url}`,
      id: pet.id,
    });
  };

  const handleRegisterPress = () => {
    if (authState.token) {
      navigation.navigate('RegisterPet');
    } else {
      Alert.alert(
        'Acceso Denegado',
        'Debes iniciar sesión o registrarte para registrar una mascota.',
        [
          { text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') },
          { text: 'Registrarse', onPress: () => navigation.navigate('RegisterUser') },
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }


  const handleProfilePress = () => {
    if (authState.rol == 'admin') {
      navigation.navigate('Dashboard'); // Navegar al Dashboard si el rol es admin
    } else if (authState.rol == 'usuario') {
      navigation.navigate('Home'); // Navegar al Dashboard si el rol es admin
    } else {
      navigation.navigate('Login');
    }
  };

  const handleProfilePress2 = () => {

      logout(); 
      navigation.navigate('MainScreen');
    
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Adopta a un Amigo</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegisterPress}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logout}
          onPress={handleProfilePress2}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfilePress}>
          <Image source={require('../assets/Adopme.jpg')} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.user}>{authState.nombre}</Text>
      </View>


      <TextInput
        style={styles.searchBar}
        placeholder="Search your favorite pet"
        placeholderTextColor="#888"
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
      />
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.subTitle}>Esperando Por Ti</Text>
        <View style={styles.cardContainer}>
          {filteredPets.map(pet => (
            <Card
              key={pet.id}
              image={{ uri: `${Ip}${pet.imagen_url}` }}
              name={pet.mascota_nombre}
              age={pet.edad}
              onPress={() => handleCardPress(pet)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  user: {
    paddingTop: 10,
    paddingBottom: 10,
    position: "absolute",
    bottom: -25,
    right: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    width: 200
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    width: 10,
    height: 20,
    fontWeight: 'bold',
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  logout: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});
