import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmployeeHeader from "../components/EmployeeHeader";

export default function EmployeeDashboard() {
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const navigation = useNavigation();
  const [lastLogin, setLastLogin] = useState('');

  // Fetch employee profile
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No token found for employee profile request");
          return;
        }
        const res = await fetch("http://10.100.232.148:8080/api/employee/profile", {
          headers: { Authorization: token },
        });
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }
        const data = await res.json();
        setUser(data);
          setLastLogin(new Date(data.lastLogin).toLocaleString('sq-AL'));
      } catch (err) {
        console.error("Error loading employee profile: ", err);
      }
    };
    fetchEmployee();
  }, []);

  // Fetch loan applications
  const fetchApplications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found for applications request");
        Alert.alert("Gabim", "Nuk u morën të dhënat - Token missing");
        setLoading(false);
        return;
      }
      const res = await fetch("http://10.100.232.148:8080/api/employee/applications", {
        headers: { Authorization: token },
      });
      if (!res.ok) {
        throw new Error(`server responded with ${res.status}`);
      }
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Error loading applications: ", err);
      Alert.alert("Gabim", "Nuk u morën të dhënat");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchApplications();
    }, [])
  );

  const updateStatus = async (id, status) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(
        `http://10.100.232.148:8080/api/employee/applications/${id}/status?status=${status}`,
        {
          method: "PUT",
          headers: { Authorization: token },
        }
      );
      if (res.ok) {
        Alert.alert("Sukses", `Statusi u ndryshua në ${status}`);
        fetchApplications();
      } else {
        const msg = await res.text();
        Alert.alert("Gabim", msg);
      }
    } catch (err) {
      Alert.alert("Gabim", "Nuk u ndryshua statusi");
    }
  };

  if (loading || !user) {
    return <ActivityIndicator style={{ marginTop: 100 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmployeeHeader firstName={user.firstName} />
      <ScrollView>
        <Text style={styles.title}>Aplikimet për kredi</Text>

        {/* Filter buttons */}
        <View style={styles.filterContainer}>
          {["ALL", "APPLIED", "EVALUATION", "APPROVED", "REJECTED"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                selectedStatus === status && styles.selectedFilter,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={{
                  color: selectedStatus === status ? "#fff" : "#b50018",
                  fontWeight: "bold",
                }}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Application cards */}
        {applications
          .filter(
            (app) => selectedStatus === "ALL" || app.status === selectedStatus
          )
          .map((app) => (
            <View key={app.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {app.user.firstName} {app.user.lastName}
              </Text>
              <Text>Email: {app.user.email}</Text>
              <Text>Tipi: {app.loanType}</Text>
              <Text>Shuma: {app.amount} {app.currency}</Text>
              <Text>Kohëzgjatja: {app.durationMonths} muaj</Text>
              <Text>Statusi: {app.status}</Text>

              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.info}
                  onPress={() => navigation.navigate("ApplicationDetails", { application: app })}
                >
                  <Text style={styles.btnText}>Shiko</Text>
                </TouchableOpacity>

                {(app.status === "APPLIED" || app.status === "EVALUATION") && (
                  <>
                    {app.status === "APPLIED" && (
                      <TouchableOpacity
                        style={styles.evaluate}
                        onPressIn={() =>
                          Alert.alert(
                            "Konfirmim",
                            "Jeni të sigurt që doni të kaloni aplikimin në Vlerësim?",
                            [
                              { text: "Jo", style: "cancel" },
                              { text: "Po", onPress: () => updateStatus(app.id, "EVALUATION") },
                            ]
                          )
                        }
                      >
                        <Text style={styles.btnText}>Vlerëso</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.approve}
                      onPressIn={() =>
                        Alert.alert(
                          "Konfirmim",
                          "Jeni të sigurt që doni ta pranoni këtë aplikim?",
                          [
                            { text: "Jo", style: "cancel" },
                            { text: "Po", onPress: () => updateStatus(app.id, "APPROVED") },
                          ]
                        )
                      }
                      disabled={app.status !== "EVALUATION"}
                    >
                      <Text style={styles.btnText}>Prano</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.reject}
                      onPressIn={() =>
                        Alert.alert(
                          "Konfirmim",
                          "Jeni të sigurt që doni ta refuzoni këtë aplikim?",
                          [
                            { text: "Jo", style: "cancel" },
                            { text: "Po", onPress: () => updateStatus(app.id, "REJECTED") },
                          ]
                        )
                      }
                    >
                      <Text style={styles.btnText}>Refuzo</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))}

        {applications.filter(app => selectedStatus === "ALL" || app.status === selectedStatus).length === 0 && (
          <Text style={styles.empty}>Asnjë aplikim nuk u gjet</Text>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Login-i i fundit: {lastLogin}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#b50018", marginBottom: 16 },
  empty: { textAlign: "center", marginTop: 50, color: "#555" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  buttons: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
    gap: 10,
  },
  info: {
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  evaluate: {
    backgroundColor: "#17a2b8",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  approve: {
    backgroundColor: "#28a745",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  reject: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
    justifyContent: "center",
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#b50018",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  selectedFilter: {
    backgroundColor: "#b50018",
    borderColor: "#b50018",
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 12,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 12,
    color: '#888'
  },
});
