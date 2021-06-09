import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import DetalhesRoteiro from '../../pages/listaViagens/detalhesRoteiro'
import MenuOrcamento from './menuOrcamento';
import DetalhesParticipantes from '../../pages/listaViagens/detalhesParticipantes';

const Tab = createMaterialTopTabNavigator();

export default function MenuDetalhesViagem({ route }) {
  const viagem = route.params.viagem;
  return (
    <Tab.Navigator>
      <Tab.Screen name="Roteiro" initialParams={route.params} component={DetalhesRoteiro} />
      <Tab.Screen name="Orçamento" initialParams={route.params} component={MenuOrcamento} />
      <Tab.Screen name="Participantes" initialParams={route.params} component={DetalhesParticipantes} />
    </Tab.Navigator>
  );
}