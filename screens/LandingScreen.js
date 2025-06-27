import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LandingScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>Miresevini ne</Text>
      <Text style={styles.title}>BKT Loan</Text>

      <Text style={styles.subtitle}>Zgjidhni rolin e perdoruesit</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          
          onPress={() => navigation.navigate("Login", { role: "CLIENT" })}
        >
          <Text style={styles.buttonText}>Klient</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login", { role: "EMPLOYEE" })}
        >
          <Text style={styles.buttonText}>Punonjes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcome: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#b50018",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#b50018",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
