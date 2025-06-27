import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    repeatPassword: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch("http://10.100.232.148:8080/api/client/profile", {
          headers: { Authorization: token }
        });
        const data = await res.json();
        setUser(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          password: "",
          repeatPassword: ""
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (form.password && form.password !== form.repeatPassword) {
      Alert.alert("Gabim", "Fjalëkalimet nuk përputhen.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://10.100.232.148:8080/api/client/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password || undefined
        })
      });

      if (res.ok) {
        Alert.alert("Sukses", "Profili u përditësua.");
        setEditing(false);
      } else {
        Alert.alert("Gabim", "Përditësimi dështoi.");
      }
    } catch (err) {
      console.error("Error updating profile", err);
      Alert.alert("Gabim", "Ndodhi një gabim gjatë lidhjes me serverin.");
    }
  };

  if (!user) return <Text style={{ padding: 20 }}>Duke ngarkuar...</Text>;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
    <View style={styles.container}>
      <Text style={styles.header}>Profili</Text>

      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>
          {form.firstName} {form.lastName}
        </Text>
      </View>

      <Text style={styles.label}>Nr. Tel:</Text>
      <Text style={styles.value}>{form.phone}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{form.email}</Text>

      {!editing && (
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
          <Text style={styles.btnText}>Modifiko Profilin</Text>
        </TouchableOpacity>
      )}

      {editing && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Emri"
            value={form.firstName}
            onChangeText={(text) => setForm({ ...form, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Mbiemri"
            value={form.lastName}
            onChangeText={(text) => setForm({ ...form, lastName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Numri i telefonit"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Fjalëkalimi (opsional)"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Përsërit Fjalëkalimin"
            value={form.repeatPassword}
            onChangeText={(text) => setForm({ ...form, repeatPassword: text })}
            secureTextEntry
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Ruaj</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: "#ccc" }]}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.btnText}>Anulo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
    </ScrollView>
    </SafeAreaView>
      </TouchableWithoutFeedback>
</KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#b50018",
    marginBottom: 20,
    textAlign: "center"
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#b50018",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333"
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#555"
  },
  value: {
    marginBottom: 8,
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginVertical: 6
  },
  editBtn: {
    backgroundColor: "#b50018",
    padding: 12,
    borderRadius: 6,
    marginTop: 14
  },
  saveBtn: {
    backgroundColor: "#b50018",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 6
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 10
  }
});
