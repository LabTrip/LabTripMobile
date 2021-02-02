import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import Login from '../pages/login';
import ListaViagens from '../pages/listaViagens';
import RedefinirInserirEmail from '../pages/redefinirInserirEmail';
import RedefinirInserirCodigo from '../pages/redefinirInserirCodigo';
import RedefinirInserirSenha from '../pages/redefinirInserirSenha';
import RedefinirSucesso from '../pages/redefinirSucesso';
import CriarAgencia from '../pages/criarAgencia';
import EdicaoPerfil from '../pages/edicaoPerfil';
import Cabecalho from './cabecalho';
import Laboratorio from './laboratorio';
import Notificacoes from '../pages/notificacoes';
import Mensagens from '../pages/mensagens';

const Tab = createMaterialBottomTabNavigator();

export default function MenuBar() {
  return (
      <><Cabecalho />
      <NavigationContainer independent={true}>
        <Tab.Navigator barStyle={{ backgroundColor: '#fff' }} initialRouteName={"ListaViagens"}>
          <Tab.Screen name="Notificacoes" component={Notificacoes} options={{
            tabBarLabel: '',
            tabBarColor: '#fff',
            tabBarIcon: () => (
              <MaterialCommunityIcons name="bell" color={'#BABABA'} size={29} />
            )
          }} />
          <Tab.Screen name="Laboratorio" component={Laboratorio} options={{
            tabBarLabel: '',
            tabBarColor: '#fff',
            tabBarIcon: () => (
              <MaterialCommunityIcons name="pen" color={'#BABABA'} size={29} />
            )
          }} />
          <Tab.Screen name="ListaViagens" component={ListaViagens} options={{
            tabBarLabel: '',
            tabBarColor: '#fff',
            tabBarIcon: () => (
              <MaterialCommunityIcons name="airplane" color={'#00ff7b'} size={29} />
            )
          }} />
          <Tab.Screen name="Mensagens" component={Mensagens} options={{
            tabBarLabel: '',
            tabBarColor: '#fff',
            tabBarIcon: () => (
              <MaterialCommunityIcons name="message" color={'#BABABA'} size={29} />
            )
          }} />
          <Tab.Screen name="EdicaoPerfil" component={EdicaoPerfil} options={{
            tabBarLabel: '',
            tabBarColor: '#fff',
            tabBarIcon: () => (
              <MaterialCommunityIcons name="account" color={'#BABABA'} size={29} />
            )
          }} />
        </Tab.Navigator>
      </NavigationContainer></>

  );
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#fff'
  }
});