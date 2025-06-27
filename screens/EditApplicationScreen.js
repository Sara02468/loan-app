import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const loanTypes = ["Shtepi", "Makine", "Personale"];
const currencies = ["ALL", "EUR", "USD"];

export default function EditApplication() {
  const route = useRoute();
  const navigation = useNavigation();
  const { application } = route.params;

  const [amount, setAmount] = useState(application.amount.toString());
  const [currency, setCurrency] = useState(application.currency);
  const [duration, setDuration] = useState(application.durationMonths.toString());
  const [loanType, setLoanType] = useState(application.loanType);

  const handleSubmit = async () => {
    if (!amount || !currency || !duration || !loanType) {
      Alert.alert("Gabim", "Ju lutem plotësoni të gjitha fushat");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://10.100.232.148:8080/api/client/applications/${application.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            currency,
            durationMonths: parseInt(duration),
            loanType
          })
        }
      );

      if (response.ok) {
        Alert.alert("Sukses", "Aplikimi u përditësua me sukses");
        navigation.goBack(); // optional: go back to dashboard
      } else {
        Alert.alert("Dështoi", "Përditësimi dështoi");
      }
    } catch (err) {
      console.error("Update failed", err);
      Alert.alert("Gabim", "Dështoi lidhja me serverin");
    }
  };

  return (
    <SafeAreaView style={{ flex:1}}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Modifiko Aplikimin</Text>

      <Text style={styles.label}>Shuma e kerkuar</Text>
      <TextInput
        style={styles.input}
        placeholder="Shuma"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Monedha</Text>
      {currencies.map((opt) => (
        <TouchableOpacity key={opt} onPress={() => setCurrency(opt)}>
          <Text style={[styles.option, currency === opt && styles.selected]}>{opt}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Kohezgjatja (ne muaj)</Text>
      <TextInput
        style={styles.input}
        placeholder="Kohëzgjatja (muaj)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />

      <Text style={styles.label}>Lloji i Kredisë</Text>
      {loanTypes.map((opt) => (
        <TouchableOpacity key={opt} onPress={() => setLoanType(opt)}>
          <Text style={[styles.option, loanType === opt && styles.selected]}>{opt}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Ruaj Ndryshimet</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#b50018",
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#333"
  },
  option: {
    paddingVertical: 6,
    paddingLeft: 10
  },
  selected: {
    backgroundColor: "#fce4e4"
  },
  button: {
    backgroundColor: "#b50018",
    padding: 14,
    borderRadius: 8,
    marginTop: 20
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold"
  }
});
