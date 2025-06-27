import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function EmployeeHeader({firstName}){
    const navigation = useNavigation();
    const {signOut} = useContext(AuthContext);

    const handleLogout = async() => {
        await signOut();
    }; 

    return(
        <View style={styles.header}>
            <Text style={styles.greeting}>Pershendetje, {firstName}</Text>
            <View style={styles.headerRight}>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logout}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={24} color="#b50018"/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 8
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#b50018'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logout: {
    marginRight: 12,
    color: '#b50018',
    fontWeight: '500'
  }
});