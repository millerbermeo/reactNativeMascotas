import React, { useState, useContext } from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../components/AuthContext'; // Ajusta la ruta a tu archivo de contexto
import fondo from '../assets/fondo1.jpg'; // Asegúrate de que la ruta sea correcta
import petImage from '../assets/login.jpg'; // Añade tu imagen de mascota aquí
import { Ip } from '../components/Ip';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext); // Usa el contexto de autenticación
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${Ip}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          contrasena: password,
        }),
        
      });

      console.log(response.data)

      const data = await response.json();

      if (response.ok) {
        const { message, token, nombre, id, rol } = data;
        if (message === 'Usuario autorizado') {
          login({ token, nombre, id, rol });
          setLoading(false);
          if (rol === 'admin') {
            navigation.navigate('Dashboard'); // Navegar directamente a Dashboard si el rol es admin
          } else {
            navigation.navigate('HomeTabs');
          }
        } else {
          setLoading(false);
          Alert.alert('Error', 'Invalid credentials');
        }
      } else {
        setLoading(false);
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.error(error);
    }
  };

  return (
    <ImageBackground source={fondo} style={styles.container}>
        {loading && (
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
        )}
      <View style={styles.loginBox}>
      
        {!loading && (
          <>
            <Image source={petImage} style={styles.petImage} />
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.signInText}>Sign in to continue</Text>

            <TextInput
              style={styles.input}
              placeholder="Email address"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Icon name="eye" size={20} color="grey" style={styles.eyeIcon} />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <TouchableOpacity onPress={() => { navigation.navigate('RegisterUser') }}>
                <Text style={styles.footerText}>Crear Cuenta</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { }}>
                <Text style={styles.footerText}>Forgot Password</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  loginBox: {
    width: '85%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    borderWidth: 1,
    borderColor: "#f3f3f3",
    alignItems: 'center',
  },
  petImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  signInText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,
    height: 45,
    paddingLeft: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  loadingIndicator: {
    width: "100%",
    height: "100%",
    
  },
});
