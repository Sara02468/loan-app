import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import EmployeeHeader from "../components/EmployeeHeader";

export default function EmployeeOverview() {
  const [stats, setStats] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const profileRes = await fetch("http://10.100.232.148:8080/api/employee/profile", {
          headers: { Authorization: token },
        });
        const profile = await profileRes.json();
        setEmployee(profile);

        const statsRes = await fetch("http://10.100.232.148:8080/api/employee/overview", {
          headers: { Authorization: token },
        });
        const data = await statsRes.json();
        setStats(data);
      } catch (err) {
        console.error("Error loading overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading || !stats || !employee) {
    return <ActivityIndicator style={{ marginTop: 100 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <EmployeeHeader firstName={employee.firstName} />
      <Text style={styles.title}>Përmbledhje e Aplikimeve</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Aplikime totale:</Text>
        <Text style={styles.value}>{stats.total}</Text>

        <Text style={styles.label}>Aplikime sot:</Text>
        <Text style={styles.value}>{stats.today}</Text>

        <Text style={styles.label}>Në pritje (APPLIED):</Text>
        <Text style={styles.value}>{stats.applied}</Text>

        <Text style={styles.label}>Në vlerësim (EVALUATION):</Text>
        <Text style={styles.value}>{stats.evaluation}</Text>

        <Text style={styles.label}>Të pranuara (APPROVED):</Text>
        <Text style={styles.value}>{stats.approved}</Text>

        <Text style={styles.label}>Të refuzuara (REJECTED):</Text>
        <Text style={styles.value}>{stats.rejected}</Text>
      </View>
      <Text style={styles.subtitle}>Grafik i Aplikimeve sipas Statusit</Text>
      <BarChart
      data={{
        labels: ["Applied", "Evaluation", "Approved", "Rejected"],
        datasets: [{ data: [0, 2, 3, 2] }]
      }}
      width={Dimensions.get("window").width - 32}
      height={220}
      fromZero={true}
      yAxisInterval={1}
      segments={Math.max(1, Math.max(stats.applied, stats.evaluation, stats.approved, stats.rejected))}
      chartConfig={{
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(181, 0, 24, ${opacity})`,
        labelColor: () => "#555",
        style: { borderRadius: 16 }
      }}
      style={{ borderRadius: 16, marginVertical: 8 }}
    />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#b50018",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
    color: "#b50018",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginTop: 12,
    fontWeight: "600",
  },
  value: {
    fontSize: 18,
    color: "#000",
    marginTop: 2,
    fontWeight: "bold",
  },
});