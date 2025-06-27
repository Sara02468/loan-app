import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

export default function ClientDashboard() {
  const [firstName, setFirstName] = useState('');
  const [lastLogin, setLastLogin] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut();
  };

  useFocusEffect(
    useCallback(() => {
      const fetchProfileAndApplications = async () => {
        setLoading(true); // ensure loading starts fresh
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) return;

          // Profile
          const profileRes = await fetch('http://10.100.232.148:8080/api/client/profile', {
            headers: { Authorization: token }
          });
          const profileText = await profileRes.text();
          if (!profileText) throw new Error('Empty profile response');
          const profile = JSON.parse(profileText);
          setFirstName(profile.firstName);
          setLastLogin(new Date(profile.lastLogin).toLocaleString('sq-AL'));

          // Applications
          const appRes = await fetch('http://10.100.232.148:8080/api/client/applications', {
            headers: { Authorization: token }
          });
          const appJson = await appRes.json();
          setApplications(appJson);
        } catch (err) {
          console.error('Failed to load data', err);
        } finally {
          setLoading(false);
        }
      };

      fetchProfileAndApplications();
    }, []) // empty dependency array → run only on focus
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} />;
  }

  const handleDelete = (id) => {
    Alert.alert(
      'Konfirmim',
      'Jeni i sigurt që dëshironi të fshini këtë aplikim?',
      [
        {
          text: 'Jo',
          style: 'cancel'
        },
        {
          text: 'Po',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const res = await fetch(`http://10.100.232.148:8080/api/client/applications/${id}`, {
                headers: { Authorization: token }
              });

              if (res.ok) {
                setApplications(applications.filter(app => app.id !== id));
                Alert.alert('Fshirë', 'Aplikimi u fshi me sukses.');
              } else {
                Alert.alert('Gabim', 'Fshirja dështoi.');
              }
            } catch (err) {
              console.error('Failed to delete application', err);
              Alert.alert('Gabim', 'Ndodhi një gabim gjatë fshirjes.');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (application) => {
    navigation.navigate('EditApplicationScreen', { application });
  };

  const handleSeeMore = (application) => {
    navigation.navigate('ApplicationDetails', { application });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header firstName={firstName} onLogout={handleLogout} />

      <ScrollView style={styles.body}>
        <Text style={styles.sectionTitle}>Lista e Aplikimeve</Text>

        {applications.length === 0 ? (
          <Text style={styles.noApplications}>Nuk keni asnjë aplikim për kredi.</Text>
        ) : (
          applications.map((app, index) => (
            <View key={app.id || index} style={styles.card}>
              <Text style={styles.cardTitle}>Aplikimi #{index + 1}</Text>
              <Text>Emri i plotë: {app.user.firstName} {app.user.lastName}</Text>
              <Text>Email: {app.user.email}</Text>
              <Text>Telefoni: {app.user.phone}</Text>
              <Text>Lloji i Kredisë: {app.loanType}</Text>
              <Text>Shuma: {app.amount} {app.currency}</Text>
              <Text>Kohëzgjatja: {app.durationMonths} muaj</Text>
              <Text>Statusi: {app.status}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.detailBtn} onPress={() => handleSeeMore(app)}>
                  <Text style={styles.buttonText}>Shiko me shumë</Text>
                </TouchableOpacity>

                {app.status === 'APPLIED' && (
                  <>
                    <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(app)}>
                      <Text style={styles.buttonText}>Modifiko</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(app.id)}>
                      <Text style={styles.buttonText}>Fshi</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Login-i i fundit: {lastLogin}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  body: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b50018',
    marginBottom: 12
  },
  noApplications: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 40
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
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderColor: '#e0e0e0',
    borderWidth: 1
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    color: '#b50018'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12
  },
  detailBtn: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  editBtn: {
    backgroundColor: '#FFC107',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  deleteBtn: {
    backgroundColor: '#DC3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  }
});
