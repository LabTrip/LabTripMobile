import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { Component, useEffect, useState } from 'react'
import ListaEditarViagens from '../../pages/laboratorio/listaEditarViagens';
import MenuLaboratorioCadastro from './menuLaboratorioCadastro';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();

export default function MenuLaboratorio() {
  const [idPermissao, setIdPermissao] = useState(4);
  let abaCadastros;

  const getUsuario = async (idUsuario, token) => {
    return await fetch('https://labtrip-backend.herokuapp.com/usuarios/' + idUsuario, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    });
  }

  const getIdPermissao = async () => {
    const token = await AsyncStorage.getItem('AUTH') || "";
    const idUsuario = await AsyncStorage.getItem('USER_ID') || "";
    const response = await getUsuario(JSON.parse(idUsuario), JSON.parse(token));
    const json = await response.json();
    setIdPermissao(json.perfilId);
  }

  getIdPermissao();

  //mostra aba de cadastro se o usuario tiver permissão diferente de cliente
  if (idPermissao != 4) {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Viagens" component={ListaEditarViagens} />
        <Tab.Screen name="Cadastros" component={MenuLaboratorioCadastro} />
      </Tab.Navigator>
    );
  } else {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Viagens" component={ListaEditarViagens} />
      </Tab.Navigator>
    );
  }

}