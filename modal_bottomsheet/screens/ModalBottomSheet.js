import { useRef, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ModalBottomSheet() {
    const [visible, setVisible] = useState(false); // state para controlar la visibilidad del bottomsheet
    const bottomSheetRef = useRef(null); // referencia para controlar el bottomsheet
    const snapPoints = ['40%', '65%'];
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.titulo}>Tipos de BottomSheet</Text>
                <Text style={styles.descripcion}>Práctica de modal</Text>
                <View style={styles.boton}>
                    <Button
                        title="Abrir Modal"
                        color="#1e90ff"
                        onPress={() => setVisible(true)}
                    ></Button>
                </View>

                <Modal
                    visible={visible}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => setVisible(false)}
                >
                    <View style={styles.modalFondo}>
                        <View style={styles.modalContenido}>
                            <Text style={styles.modalTitulo}>Hola!</Text>
                            <Text style={styles.texto}>Este mensaje está dentro de un modal</Text>
                            <Button title="Cerrar" color="#1e90ff" onPress={() => setVisible(false)}></Button>
                        </View>
                    </View>
                </Modal>

                <View style={styles.boton}>
                    <Button title="Abrir BottomSheet" color="#1e90ff" onPress={() => bottomSheetRef.current?.expand()}></Button>
                </View>

                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                >
                    <BottomSheetView style={styles.sheetContenido}>
                        <Text style={styles.sheetTitulo}>Bottom Sheet Modal</Text>
                        <Text style={styles.texto}>Cubre parte de la pantalla y se cierra deslizando hacia abajo</Text>
                    </BottomSheetView>
                </BottomSheet>

                <BottomSheet
                    index={0}
                    snapPoints={['15%', '40%']}
                    enablePanDownToClose={false} /* Esto hace que no se pueda cerrar deslizando hacia abajo */
                    backgroundStyle={{ backgroundColor: '#fff' }}
                    handleIndicatorStyle={{ backgroundColor: '#aaa' }}
                >
                    <BottomSheetView style={styles.sheetContenido}>
                        <Text style={styles.sheetTitulo}>BottomSheet Persistente</Text>
                        <Text style={styles.texto}>Este panel permanece siempre visible y no se puede expandir o contraer</Text>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#EAF2F8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 15,
        textAlign: 'center',
    },

    descripcion: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 25,
    },

    boton: {
        width: '80%',
        marginVertical: 10,
    },

    modalFondo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    modalContenido: {
        width: '85%',
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        gap: 15,
    },

    modalTitulo: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#2C3E50',
    },

    texto: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        marginBottom: 10,
    },

    sheetContenido: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    sheetTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6C5CE7',
        marginBottom: 15,
        textAlign: 'center',
    },

});
