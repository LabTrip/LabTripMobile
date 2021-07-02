import React, { useEffect } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import TelasProfile from '../screens/telasProfile';
import Cabecalho from '../../components/cabecalho';
import Notificacoes from '../../pages/notificacoes/notificacoes';
import Mensagens from '../../pages/chat/mensagens';
import TelasLaboratorio from '../screens/telasLaboratorio';
import TelasListaViagens from '../screens/telasListaViagens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const Tab = createMaterialBottomTabNavigator();

export default function MenuPrincipal() {

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const retornaToken = async () => {
    let localToken = await AsyncStorage.getItem('AUTH');
    if (localToken != null) {
      localToken = JSON.parse(localToken)
    }
    return localToken;
  }

  const salvaTokenNotificacao = async (tokenNotificacao) => {
    let localToken = await retornaToken() || '';

    const response = await fetch('https://labtrip-backend.herokuapp.com/usuarios/notification-token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localToken
      },
      body: JSON.stringify({
        token: tokenNotificacao
      })
    });

    const json = await response.json();
    if (response.status == 200) {
      console.log('Push token cadastrado.')
    }
    else {
      console.log('erro ao cadastras Push token.')
    }
  }

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      salvaTokenNotificacao(token);
      //setTokenNotification({ expoPushToken: token });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  return (
    <>
      <Cabecalho />
      <Tab.Navigator barStyle={{ backgroundColor: '#fff' }} initialRouteName={"TelasListaViagens"} >
        <Tab.Screen name="Notificacoes" component={Notificacoes} options={{
          tabBarLabel: '',
          tabBarColor: '#fff',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="bell" color={focused ? '#0FD06F' : '#BABABA'} size={29} />
          )
        }} />
        <Tab.Screen name="TelasLaboratorio" component={TelasLaboratorio} options={{
          tabBarLabel: '',
          tabBarColor: '#fff',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="pen" color={focused ? '#0FD06F' : '#BABABA'} size={29} />
          )
        }} />
        <Tab.Screen name="TelasListaViagens" component={TelasListaViagens} options={{
          tabBarLabel: '',
          tabBarColor: '#fff',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="airplane" color={focused ? '#0FD06F' : '#BABABA'} size={29} />
          )
        }} />
        {/*<Tab.Screen name="Sobre o app" component={Mensagens} options={{
          tabBarLabel: '',
          tabBarColor: '#fff',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="help" color={focused ? '#0FD06F' : '#BABABA'} size={29} />
          )
        }} />*/}
        <Tab.Screen name="TelasProfile" component={TelasProfile} options={{
          tabBarLabel: '',
          tabBarColor: '#fff',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="account" color={focused ? '#0FD06F' : '#BABABA'} size={29} />
          )
        }} />
      </Tab.Navigator>
    </>

  );
}