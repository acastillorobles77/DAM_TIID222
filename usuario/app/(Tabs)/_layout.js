import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        /* <Tabs screenOptions={{ headerShown: false }}> */
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{ title: "Inicio", href: null }}
            />
            <Tabs.Screen
                name="alta"
                options={{
                    title: "Formulario",
                    tabBarIcon: ({ color, size }) => (<Ionicons name="person-add" color={"blue"} size={25} />)
                }}
            />
            <Tabs.Screen
                name="consulta"
                options={{
                    title: "Listado",
                    tabBarIcon: ({ color, size }) => (<Ionicons name="list" color={"blue"} size={25} />)
                }}
            />
        </Tabs>
    );
}
