import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import DetalhesOrcamento from '../../pages/listaViagens/detalhesOrcamento';
import i18n from '../../translate/i18n';


const Tab = createMaterialTopTabNavigator();

export default function MenuOrcamento({ route }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name={i18n.t('menuOrcamento.geral')} initialParams={route.params} component={DetalhesOrcamento} />
      <Tab.Screen name={i18n.t('menuOrcamento.individual')} initialParams={route.params} component={DetalhesOrcamento} />
    </Tab.Navigator>
  );
}