import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import normalize from '../../components/fontSizeResponsive';
import CriarRoteiro from '../../pages/laboratorio/criarRoteiro';
import DetalhesOrcamento from '../../pages/listaViagens/detalhesOrcamento';

const Tab = createMaterialTopTabNavigator();

export default function MenuDetalhesRoteiroAgencia({ route }) {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Roteiro" initialParams={route.params} component={CriarRoteiro} />
            <Tab.Screen name="Atividades" component={DetalhesOrcamento} />
        </Tab.Navigator>
    );
}