import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const tipiTeArdhuraveOptions = ['Paga', 'Qeraja', 'Biznes'];
const monedhat = ['ALL', 'EUR', 'USD'];
const edukimiOptions = ['Pa Arsim', 'Arsim Fillor', 'Shkollë e Mesme', 'Arsim i Lartë', 'Doktoraturë'];
const gjendjaCivileOptions = ['Beqar', 'Martuar'];
const llojiKrediseOptions = ['Shtëpi', 'Makinë', 'Personale'];

export default function ApplyLoanScreen() {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    fatherName: '', birthDate: '', birthPlace: '', address: '',
    education: '', civilStatus: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [loanRequest, setLoanRequest] = useState({
    amount: '', currency: '', durationMonths: '', loanType: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch('http://10.100.232.148:8080/api/client/profile', {
          headers: { Authorization: token }
        });
        const data = await res.json();
        setPersonalInfo(prev => ({
          ...prev,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || ''
        }));
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setPersonalInfo({ ...personalInfo, birthDate: formatted });
    }
  };

  const handleAddIncome = () => {
    setIncomes([...incomes, { type: '', monthlyAmount: '', currency: '' }]);
  };

  const handleRemoveIncome = (index) => {
    const updated = incomes.filter((_, i) => i !== index);
    setIncomes(updated);
  };

  const handleSubmit = async () => {
    const {
      fatherName, birthDate, birthPlace, address,
      education, civilStatus
    } = personalInfo;
    const {
      amount, currency, durationMonths, loanType
    } = loanRequest;

    if (
      !fatherName || !birthDate || !birthPlace || !address ||
      !education || !civilStatus ||
      !amount || !currency || !durationMonths || !loanType ||
      incomes.length === 0
    ) {
      Alert.alert('Gabim', 'Ju lutem plotësoni të gjitha fushat dhe shtoni të paktën një të ardhur.');
      return;
    }

    const hasEmptyIncome = incomes.some(
      income => !income.type || !income.monthlyAmount || !income.currency
    );
    if (hasEmptyIncome) {
      Alert.alert('Gabim', 'Ju lutem plotësoni të gjitha fushat për çdo të ardhur.');
      return;
    }

    const payload = {
      fatherName,
      birthDate,
      birthPlace,
      address,
      educationLevel: education,
      civilStatus,
      loanType,
      currency,
      amount,
      durationMonths,
      incomes
    };

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://10.100.232.148:8080/api/client/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Alert.alert('Sukses', 'Aplikimi u dërgua me sukses');
        setLoanRequest({ amount: '', currency: '', durationMonths: '', loanType: '' });
        setIncomes([]);
      } else {
        Alert.alert('Dështoi', 'Dështoi dërgimi i aplikimit');
      }
    } catch (err) {
      Alert.alert('Gabim', 'Nuk u lidh me serverin');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Personal Info Inputs */}
        <Text style={styles.sectionTitle}>Informacion Personal</Text>
        <TextInput style={styles.input} placeholder="Emri" value={personalInfo.firstName} editable={false} />
        <TextInput style={styles.input} placeholder="Mbiemri" value={personalInfo.lastName} editable={false} />
        <TextInput style={styles.input} placeholder="Email" value={personalInfo.email} editable={false} />
        <TextInput style={styles.input} placeholder="Numri i telefonit" value={personalInfo.phone} editable={false} />
        <TextInput style={styles.input} placeholder="Atësia" value={personalInfo.fatherName} onChangeText={(text) => setPersonalInfo({ ...personalInfo, fatherName: text })} />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{personalInfo.birthDate || 'Datëlindja'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={personalInfo.birthDate ? new Date(personalInfo.birthDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleDateChange}
          />
        )}
        <TextInput style={styles.input} placeholder="Vendlindja" value={personalInfo.birthPlace} onChangeText={(text) => setPersonalInfo({ ...personalInfo, birthPlace: text })} />
        <TextInput style={styles.input} placeholder="Adresa" value={personalInfo.address} onChangeText={(text) => setPersonalInfo({ ...personalInfo, address: text })} />

        {/* Dropdowns */}
        <Text style={styles.label}>Edukimi</Text>
        {edukimiOptions.map(option => (
          <TouchableOpacity key={option} onPress={() => setPersonalInfo({ ...personalInfo, education: option })}>
            <Text style={[styles.option, personalInfo.education === option && styles.selected]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Gjendja Civile</Text>
        {gjendjaCivileOptions.map(option => (
          <TouchableOpacity key={option} onPress={() => setPersonalInfo({ ...personalInfo, civilStatus: option })}>
            <Text style={[styles.option, personalInfo.civilStatus === option && styles.selected]}>{option}</Text>
          </TouchableOpacity>
        ))}

        {/* Incomes */}
        <Text style={styles.sectionTitle}>Të Ardhurat</Text>
        {incomes.map((income, idx) => (
          <View key={idx} style={styles.incomeGroup}>
            <Text style={styles.label}>Tipi</Text>
            {tipiTeArdhuraveOptions.map(opt => (
              <TouchableOpacity key={opt} onPress={() => {
                const newIncomes = [...incomes];
                newIncomes[idx].type = opt;
                setIncomes(newIncomes);
              }}>
                <Text style={[styles.option, incomes[idx].type === opt && styles.selected]}>{opt}</Text>
              </TouchableOpacity>
            ))}

            <TextInput
              style={styles.input}
              placeholder="Vlera mujore"
              keyboardType="numeric"
              value={incomes[idx].monthlyAmount}
              onChangeText={(text) => {
                const newIncomes = [...incomes];
                newIncomes[idx].monthlyAmount = text;
                setIncomes(newIncomes);
              }}
            />

            <Text style={styles.label}>Monedha</Text>
            {monedhat.map(opt => (
              <TouchableOpacity key={opt} onPress={() => {
                const newIncomes = [...incomes];
                newIncomes[idx].currency = opt;
                setIncomes(newIncomes);
              }}>
                <Text style={[styles.option, incomes[idx].currency === opt && styles.selected]}>{opt}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => handleRemoveIncome(idx)}>
              <Text style={styles.removeBtn}>Hiq</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={handleAddIncome} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Shto të ardhur</Text>
        </TouchableOpacity>

        {/* Loan Info */}
        <Text style={styles.sectionTitle}>Kërkesa për Kredi</Text>
        <TextInput
          style={styles.input}
          placeholder="Shuma"
          keyboardType="numeric"
          value={loanRequest.amount}
          onChangeText={(text) => setLoanRequest({ ...loanRequest, amount: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kohëzgjatja (muaj)"
          keyboardType="numeric"
          value={loanRequest.durationMonths}
          onChangeText={(text) => setLoanRequest({ ...loanRequest, durationMonths: text })}
        />
        <Text style={styles.label}>Monedha</Text>
        {monedhat.map(option => (
          <TouchableOpacity key={option} onPress={() => setLoanRequest({ ...loanRequest, currency: option })}>
            <Text style={[styles.option, loanRequest.currency === option && styles.selected]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Lloji i Kredisë</Text>
        {llojiKrediseOptions.map(option => (
          <TouchableOpacity key={option} onPress={() => setLoanRequest({ ...loanRequest, loanType: option })}>
            <Text style={[styles.option, loanRequest.loanType === option && styles.selected]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
          <Text style={styles.submitText}>Dërgo Aplikimin</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#b50018', 
    marginVertical: 10 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 6, 
    padding: 10, 
    marginBottom: 8 
  },
  label: { 
    marginTop: 10, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  option: { 
    paddingVertical: 6, 
    paddingLeft: 10 
  },
  selected: { 
    backgroundColor: '#fce4e4' 
  },
  incomeGroup: { 
    marginBottom: 10, 
    padding: 10, 
    backgroundColor: '#f9f9f9', 
    borderRadius: 8 
  },
  removeBtn: { 
    color: 'red', 
    textAlign: 'right', 
    marginTop: 4 
  },
  addBtn: { 
    marginVertical: 10, 
    backgroundColor: '#b50018', 
    padding: 10, 
    borderRadius: 6 
  },
  addBtnText: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: '600' 
  },
  submitBtn: { 
    marginTop: 20, 
    backgroundColor: '#b50018', 
    padding: 14, 
    borderRadius: 8 
  },
  submitText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});