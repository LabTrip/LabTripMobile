import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import EditarRoteiro from '../../pages/laboratorio/editarRoteiro';
import ListaAtividadesDoRoteiro from '../../pages/laboratorio/listaAtividadesDoRoteiro';
import MenuOrcamento from './menuOrcamento';
import i18n from '../../translate/i18n';


const Tab = createMaterialTopTabNavigator();

export default function MenuDetalhesRoteiroAgencia({ route }) {
    return (
        <Tab.Navigator>
            <Tab.Screen name={i18n.t('menuDetalhesRoteiroAgencia.roteiro')} initialParams={route.params} component={EditarRoteiro} />
            <Tab.Screen name={i18n.t('menuDetalhesRoteiroAgencia.atividades')} initialParams={route.params} component={ListaAtividadesDoRoteiro} />
            <Tab.Screen name={i18n.t('menuDetalhesRoteiroAgencia.orcamento')} initialParams={route.params} component={MenuOrcamento} />
        </Tab.Navigator>
    );
}