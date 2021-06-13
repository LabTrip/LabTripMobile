import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import DetalhesOrcamento from '../../pages/listaViagens/detalhesOrcamento';


const Tab = createMaterialTopTabNavigator();

export default function MenuOrcamento({ route }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Geral" initialParams={route.params} component={DetalhesOrcamento} />
      <Tab.Screen name="Individual" initialParams={route.params} component={DetalhesOrcamento} />
    </Tab.Navigator>
  );
}