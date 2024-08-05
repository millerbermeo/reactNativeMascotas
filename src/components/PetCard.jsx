import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import UpdatePetModal from './UpdatePetModal';
import DeletePetModal from './DeletePetModal';
import { Ip } from './Ip'; 
import MakeAdoptedModal from './MakeAdoptedModal';
import MakeAvailableModal from './MakeAvailableModal';

export default function PetCard({ pet, onPetDeleted, onPetUpdated, mascota }) {
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAdopModalVisible, setIsAdopModalVisible] = useState(false);
    const [isAvalModalVisible, setIsAvalModalVisible] = useState(false);

    const openUpdateModal = () => setIsUpdateModalVisible(true);
    const closeUpdateModal = () => setIsUpdateModalVisible(false);

    const openDeleteModal = () => setIsDeleteModalVisible(true);
    const closeDeleteModal = () => setIsDeleteModalVisible(false);

    const openAdopModal = () => setIsAdopModalVisible(true);
    const closeAdopModal = () => setIsAdopModalVisible(false);

    const openAvalModal = () => setIsAvalModalVisible(true);
    const closeAvalModal = () => setIsAvalModalVisible(false);

    const handleWhatsAppClick = () => {
        if (!pet.telefono) return;
        
        const phoneNumber = pet.telefono;
        const message = `¡Hola!\n\nMe encantaría saber más sobre la adopción de esta adorable mascota:\n\nNombre: ${pet.mascota_nombre}\nEdad: ${pet.edad} años\nGénero: ${pet.genero || 'N/A'}\nDueño Actual: ${pet.dueno}\n\nEstoy muy interesado en brindarle un hogar lleno de amor. Además, me gustaría obtener información sobre los siguientes aspectos:\n\nAntecedentes del animal:\nVacunas:\nHistorial médico veterinario:\n\n¿Podrías darme más detalles sobre el proceso de adopción? ¡Muchas gracias!`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        Linking.openURL(whatsappLink).catch(err => console.error('Error opening WhatsApp:', err));
    };

    return (
        <View style={styles.card}>
            {pet.imagen_url ? (
                <Image
                    source={{ uri: `${Ip}${pet.imagen_url}` }}
                    style={styles.image}
                />
            ) : (
                <Text>No hay imagen disponible</Text>
            )}
            <Text style={styles.name}>{pet.mascota_nombre}</Text>
            <Text style={styles.details}>Edad: {pet.edad}</Text>
            <Text style={styles.details}>Estado: {pet.estado}</Text>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.updateButton]}
                    onPress={openUpdateModal}
                >
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={openDeleteModal}
                >
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.availableButton]}
                    onPress={openAvalModal}
                >
                    <Text style={styles.buttonText}>Dis</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.adoptButton]}
                    onPress={openAdopModal}
                >
                    <Text style={styles.buttonText}>Adop</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.whatsappButton]}
                    onPress={handleWhatsAppClick}
                >
                    <Text style={styles.buttonText}>What</Text>
                </TouchableOpacity>
            </View>

            <UpdatePetModal
                isVisible={isUpdateModalVisible}
                onClose={closeUpdateModal}
                pet={pet}
                onUpdate={onPetUpdated}
                mascota={mascota}
            />
            <DeletePetModal
                isVisible={isDeleteModalVisible}
                onClose={closeDeleteModal}
                pet={pet}
                onDelete={onPetDeleted}
                mascota={mascota}
            />
            <MakeAdoptedModal
                isVisible={isAdopModalVisible}
                onClose={closeAdopModal}
                mascota={mascota}
                pet={pet}
            />
            <MakeAvailableModal
                isVisible={isAvalModalVisible}
                onClose={closeAvalModal}
                mascota={mascota}
                pet={pet}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 16,
        color: '#666',
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 999,
        marginBottom: 10,
        position: 'absolute',
        right: 20,
        top: -15,
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        padding: 4,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 5,
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
    },
    updateButton: {
        backgroundColor: '#318CE7', // Azul para actualizar
    },
    deleteButton: {
        backgroundColor: '#ef4444', // Rojo para eliminar
    },
    adoptButton: {
        backgroundColor: '#FFA500', // Naranja para adoptado
    },
    availableButton: {
        backgroundColor: '#4CAF50', // Verde para disponible
    },
    whatsappButton: {
        backgroundColor: '#25D366', // Verde para WhatsApp
    },
});
