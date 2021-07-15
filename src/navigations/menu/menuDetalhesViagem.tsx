import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import DetalhesRoteiro from '../../pages/listaViagens/detalhesRoteiro'
import MenuOrcamento from './menuOrcamento';
import DetalhesParticipantes from '../../pages/listaViagens/detalhesParticipantes';
import i18n from '../../translate/i18n';

const Tab = createMaterialTopTabNavigator();

export default function MenuDetalhesViagem({ route }) {

  return (
    <Tab.Navigator>
      <Tab.Screen name={i18n.t('menuDetalhesRoteiroAgencia.roteiro')} initialParams={route.params} component={DetalhesRoteiro} />
      <Tab.Screen name={i18n.t('menuDetalhesRoteiroAgencia.orcamento')} initialParams={route.params} component={MenuOrcamento} />
      <Tab.Screen name={i18n.t('menuDetalhesViagem.participantes')} initialParams={route.params} component={DetalhesParticipantes} />
    </Tab.Navigator>
  );
}