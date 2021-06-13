import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react'
import ListaEditarViagens from '../../pages/laboratorio/listaEditarViagens';
import MenuLaboratorioCadastro from './menuLaboratorioCadastro';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();

export default function MenuLaboratorio() {
  const [idPermissao, setIdPermissao] = useState(0);

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
    setIdPermissao(json.perfilId)
  }

  getIdPermissao();

  let abaCadastros;

  //mostra aba de cadastros se usuario não for um usuario com permissao de cliente.
  if (idPermissao != 4) {
    abaCadastros = <Tab.Screen name="Cadastros" component={MenuLaboratorioCadastro} />;
  }


  return (
    <Tab.Navigator>
      <Tab.Screen name="Viagens" component={ListaEditarViagens} />
      {abaCadastros}
    </Tab.Navigator>
  );

}