import React, { useState } from 'react';
import { View, SafeAreaView, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { agregarUsuario } from '../services/usuariosService';

export default function AltaUsuariosScreen() {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  // función para guardar el usuario en el localStorage

  const guardarUsuario = async () => {
    setMensaje('');
    try {
      const resultado = await agregarUsuario(nombre, edad);
      if (!resultado.ok) {
        setErrores(resultado.errores);
        return;
      }
      setErrores({});
      setNombre('');
      setEdad('');
      setMensaje('Usuario agregado correctamente.');
    } catch (error) {
      setErrores({ general: error.message });
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.titulo}>
          Registro de Usuarios
        </Text>

        <TextInput
          style={[styles.input, errores.nombre && styles.inputError]}
          placeholder="Nombre del usuario"
          value={nombre}
          onChangeText={setNombre}
        />
        {errores.nombre ? <Text style={styles.error}>{errores.nombre}</Text> : null}

        <TextInput
          style={[styles.input, errores.edad && styles.inputError]}
          placeholder="Edad del usuario"
          keyboardType="numeric"
          value={edad}
          onChangeText={setEdad}
        />
        {errores.edad ? <Text style={styles.error}>{errores.edad}</Text> : null}
        {errores.general ? <Text style={styles.error}>{errores.general}</Text> : null}

        <Pressable style={styles.boton} onPress={guardarUsuario}>
          <Text style={styles.textoBoton}>
            Agregar Usuario
          </Text>
        </Pressable>

        {mensaje ? <Text style={styles.exito}>{mensaje}</Text> : null}

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#1F2937',
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 18,
    backgroundColor: '#F9FAFB',
    fontSize: 16,
  },

  inputError: {
    borderColor: '#DC2626',
    marginBottom: 6,
  },

  error: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 12,
  },

  exito: {
    color: '#15803D',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },

  boton: {
    backgroundColor: '#29bb0c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

});
