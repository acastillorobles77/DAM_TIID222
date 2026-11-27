import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, StyleSheet, } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { obtenerUsuarioPorId, actualizarUsuario as actualizarEnStorage } from '../services/usuariosService';



export default function ActualizarUsuarioScreen() {


  const { id } = useLocalSearchParams();
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [errores, setErrores] = useState({});

  // cargar los datos del usuario en cuestión desde el localStorage, mediante su ID
  useEffect(() => {
    const cargar = async () => {
      const usuario = await obtenerUsuarioPorId(id);
      if (usuario) {
        setNombre(usuario.nombre);
        setEdad(String(usuario.edad));
      } else {
        setErrores({ general: 'El usuario ya no existe.' });
      }
    };
    cargar();
  }, [id]);

  const actualizarUsuario = async () => {
    const resultado = await actualizarEnStorage(id, nombre, edad);
    if (!resultado.ok) {
      setErrores(resultado.errores);
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.titulo}>
        Actualizar Usuario
      </Text>

      <View style={styles.card}>

        <Text style={styles.label}>
          Nombre
        </Text>

        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
        />
        {errores.nombre ? <Text style={styles.error}>{errores.nombre}</Text> : null}

        <Text style={styles.label}>
          Edad
        </Text>

        <TextInput
          style={styles.input}
          value={edad}
          onChangeText={setEdad}
          placeholder="Edad"
          keyboardType="numeric"
        />
        {errores.edad ? <Text style={styles.error}>{errores.edad}</Text> : null}
        {errores.general ? <Text style={styles.error}>{errores.general}</Text> : null}

        <Pressable
          style={styles.boton}
          onPress={actualizarUsuario}
        >
          <Text style={styles.textoBoton}>
            Guardar cambios
          </Text>
        </Pressable>

      </View>

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
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    elevation: 5,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },

  error: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: -14,
    marginBottom: 14,
  },

  boton: {
    backgroundColor: '#FACC15',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  textoBoton: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: 'bold',
  },

});