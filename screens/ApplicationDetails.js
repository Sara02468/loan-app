import { useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ApplicationDetails() {
  const route = useRoute();
  const { application } = route.params;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Detajet e Aplikimit</Text>

        <View style={styles.detailCard}>
          <Text style={styles.label}>Emri</Text>
          <Text style={styles.value}>
            {application.user?.firstName} {application.user?.lastName}
          </Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{application.user?.email}</Text>

          <Text style={styles.label}>Numri i telefonit</Text>
          <Text style={styles.value}>{application.user?.phone}</Text>

          <Text style={styles.label}>Atësia</Text>
          <Text style={styles.value}>{application.fatherName || "-"}</Text>

          <Text style={styles.label}>Datëlindja</Text>
          <Text style={styles.value}>
            {application.birthDate
              ? new Date(application.birthDate).toLocaleDateString("sq-AL")
              : "-"}
          </Text>

          <Text style={styles.label}>Vendlindja</Text>
          <Text style={styles.value}>{application.birthPlace || "-"}</Text>

          <Text style={styles.label}>Adresa</Text>
          <Text style={styles.value}>{application.address || "-"}</Text>

          <Text style={styles.label}>Edukimi</Text>
          <Text style={styles.value}>{application.educationLevel || "-"}</Text>

          <Text style={styles.label}>Gjendja Civile</Text>
          <Text style={styles.value}>{application.civilStatus || "-"}</Text>

          <Text style={styles.label}>Lloji i kredisë</Text>
          <Text style={styles.value}>{application.loanType}</Text>

          <Text style={styles.label}>Shuma</Text>
          <Text style={styles.value}>
            {application.amount} {application.currency}
          </Text>

          <Text style={styles.label}>Kohëzgjatja</Text>
          <Text style={styles.value}>{application.durationMonths} muaj</Text>

          <Text style={styles.label}>Statusi</Text>
          <Text style={[styles.value, styles.status]}>
            {application.status}
          </Text>

          <Text style={styles.label}>Dërguar më</Text>
          <Text style={styles.value}>
            {new Date(application.submittedAt).toLocaleDateString("sq-AL")}
          </Text>

          {/* Të Ardhurat */}
          {application.incomes?.length > 0 && (
            <>
              <Text style={[styles.label, { marginTop: 16 }]}>
                Të Ardhurat
              </Text>
              {application.incomes.map((income, idx) => (
                <View key={income.id || idx} style={styles.incomeItem}>
                  <Text style={styles.incomeLabel}>Tipi: {income.type}</Text>
                  <Text style={styles.incomeLabel}>
                    Vlera mujore: {income.monthlyAmount} {income.currency}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#b50018",
    marginBottom: 16,
    textAlign: "center",
  },
  detailCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#222",
    marginTop: 2,
  },
  status: {
    color: "#b50018",
    fontWeight: "bold",
  },
  incomeItem: {
    marginTop: 6,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  incomeLabel: {
    fontSize: 14,
    color: "#333",
  },
});
