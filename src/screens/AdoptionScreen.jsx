import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ip } from '../components/Ip';
import { AuthContext } from '../components/AuthContext';
import GiveAdopModal from '../components/GiveAdopModal';
import Card2 from '../components/Card2';

export default function AdoptionScreen() {
  const navigation = useNavigation();
  const { authState, logout } = useContext(AuthContext);

  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGiveAdopModalVisible, setIsGiveAdopModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`${Ip}/api/mascotas/listar/${authState.id}/`);
        const data = await response.json();
        if (Array.isArray(data)) {
          // Filtrar mascotas por estado 'Pendiente' o 'Disponible'
          const filtered = data.filter(pet => pet.estado === 'Pendiente' || pet.estado === 'Disponible');
          setPets(filtered);
          setFilteredPets(filtered);
        } else {
          console.error('Error: La respuesta no es un array.');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setLoading(false);
      }
    };

    fetchPets();
  }, [authState.id]);

  useEffect(() => {
    const filtered = pets.filter(pet =>
      (pet.mascota_nombre || '').toLowerCase().includes(searchQuery.toLowerCase())
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
          { text: 'Registrarse', onPress: () => navigation.navigate('Register') },
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
      navigation.navigate('Dashboard');
    } else {
      navigation.navigate('Login');
    }
  };

  const handleProfilePress2 = () => {
    logout();
    navigation.navigate('MainScreen');
  };

  const openGiveAdopModal = (pet) => {
    setSelectedPet(pet);
    setIsGiveAdopModalVisible(true);
  };

  const closeGiveAdopModal = () => {
    setIsGiveAdopModalVisible(false);
    setSelectedPet(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tus Mascotas</Text>
        <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout} onPress={handleProfilePress2}>
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
        <Text style={styles.subTitle}>Tus Mascotas</Text>
        <View style={styles.cardContainer}>
          {filteredPets.map(pet => (
            <View key={pet.id} style={styles.cardWrapper}>
              <Card2
                key={pet.id}
                image={{ uri: `${Ip}${pet.imagen_url}` }}
                name={pet.nombre}
                age={pet.edad}
                onPress={() => handleCardPress(pet)}
              />
              <TouchableOpacity onPress={() => openGiveAdopModal(pet)}>
                <Text style={styles.adoptButtonText}>Dar en Adopción</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      {selectedPet && (
        <GiveAdopModal
          isVisible={isGiveAdopModalVisible}
          onClose={closeGiveAdopModal}
          pet={selectedPet}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
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
  user: {
    paddingTop: 10,
    paddingBottom: 10,
    position: "absolute",
    bottom: -25,
    right: 10,
    top: 29
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
  cardWrapper: {
    width: '100%',
    marginBottom: 20,
    display: "flex",
    justifyContent: "flex-start",
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
    fontWeight: 'bold',
    textAlign: 'center',
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
  adoptButtonText: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 10,
  }
});
