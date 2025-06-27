import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

import ApplicationDetails from '../screens/ApplicationDetails';
import ApplyLoanScreen from '../screens/ApplyLoanScreen';
import ClientDashboard from '../screens/ClientDashboard';
import EditApplicationScreen from '../screens/EditApplicationScreen';
import EmployeeDashboard from '../screens/EmployeeDashboard';
import EmployeeOverview from '../screens/EmployeeOverview';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function ClientDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Lista e Aplikimeve"
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Lista e Aplikimeve" component={ClientDashboard} />
      <Drawer.Screen name="Apliko për Kredi" component={ApplyLoanScreen} />
      <Drawer.Screen name="Profili im" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

function EmployeeDreawerNavigator(){
  return (
    <Drawer.Navigator
    initialRouteName="Lista e Aplikimeve"
    screenOptions={{headerShown:false}}
    >
      <Drawer.Screen name="Lista e Aplikimeve" component={EmployeeDashboard} />
      <Drawer.Screen name="Informacion i Pergjithshem" component={EmployeeOverview}/>
      <Drawer.Screen name="Profili im" component={ProfileScreen}/>
    </Drawer.Navigator>
  )
}

export default function AppNavigator() {
  const { isLoggedIn, role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#b50018" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="LandingScreen" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : role === 'CLIENT' ? (
        <>
          <Stack.Screen name="ClientDrawer" component={ClientDrawerNavigator} />
          <Stack.Screen name="ApplicationDetails" component={ApplicationDetails} />
          <Stack.Screen name="EditApplicationScreen" component={EditApplicationScreen} />
        </>
      ) : (
        <>
        <Stack.Screen name="EmployeeDrawer" component={EmployeeDreawerNavigator} />
        <Stack.Screen name="ApplicationDetails" component={ApplicationDetails} />
        </>
      )}
    </Stack.Navigator>
  );
}
