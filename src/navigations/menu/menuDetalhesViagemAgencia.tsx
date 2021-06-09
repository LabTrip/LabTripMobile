import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import MenuOrcamento from './menuOrcamento';
import DetalhesParticipantes from '../../pages/listaViagens/detalhesParticipantes';
import normalize from '../../components/fontSizeResponsive';
import EditarViagem from '../../pages/laboratorio/editarViagem'
import ListaPropostaDeRoteiro from '../../pages/laboratorio/listaPropostaDeRoteiro'
import DetalhesOrcamento from '../../pages/listaViagens/detalhesOrcamento';

const Tab = createMaterialTopTabNavigator();

export default function MenuDetalhesViagemAgencia({ route }) {
    return (
        <Tab.Navigator tabBarOptions={{
            labelStyle: {
                fontSize: normalize(9),
                fontWeight: 'bold',
                flexWrap: 'nowrap'
            },
            tabStyle: { flexWrap: 'nowrap' }
        }}>
            <Tab.Screen name="Viagem" initialParams={route.params} component={EditarViagem} />
            <Tab.Screen name="Roteiro" initialParams={route.params} component={ListaPropostaDeRoteiro} />
            <Tab.Screen name="Orçamento" initialParams={route.params} component={MenuOrcamento} />
            <Tab.Screen name="Participantes" initialParams={route.params} component={DetalhesParticipantes} />
        </Tab.Navigator>
    );
}