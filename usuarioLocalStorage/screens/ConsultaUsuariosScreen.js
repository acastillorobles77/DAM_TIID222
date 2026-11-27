import React, { useState, useCallback } from 'react';
import {
  SafeAreaView, View, Text, FlatList, StyleSheet, Pressable,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { obtenerUsuarios } from '../services/usuariosService';

export default function ConsultaUsuariosScreen() {

  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');

  // Recarga la lista cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      const cargar = async () => {
        try {
          setUsuarios(await obtenerUsuarios());
          setError('');
        } catch (e) {
          setError(e.message);
        }
      };
      cargar();
    }, [])
  );

  const renderTarjeta = ({ item }) => (
    <Pressable
      onPress={() => router.push({ pathname: "/detalle", params: { id: item.id } })}
    >
      <View style={styles.card}>

        <Text style={styles.nombre}>{item.nombre}</Text>

        <View style={styles.linea}></View>

        <Text style={styles.info}>
          Edad: {item.edad} años
        </Text>

      </View>
    </Pressable>
  );

  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.titulo}>
        Lista de Usuarios
      </Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={renderTarjeta}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            {error || 'No hay usuarios registrados. Agrega uno en la pestaña "Formulario".'}
          </Text>
        }
      />

    </SafeAreaView>
  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 4,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  linea: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },

  vacio: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 40,
  },

  info: {
    fontSize: 16,
    color: '#4B5563',
  },

});