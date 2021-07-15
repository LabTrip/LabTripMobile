import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import CadastroAgencias from '../../pages/laboratorio/cadastroAgencias';
import CadastroUsuarios from '../../pages/laboratorio/cadastroUsuarios';
import i18n from '../../translate/i18n';

const Tab = createMaterialTopTabNavigator();

export default function MenuLaboratorioCadastro() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={i18n.t('menuLaboratorioCadastro.agencia')} component={CadastroAgencias} />
      <Tab.Screen name={i18n.t('menuLaboratorioCadastro.usuario')} component={CadastroUsuarios} />
      
    </Tab.Navigator>
  );
}