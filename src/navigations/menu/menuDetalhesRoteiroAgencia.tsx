import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import normalize from '../../components/fontSizeResponsive';
import EditarRoteiro from '../../pages/laboratorio/editarRoteiro';
import CriarRoteiro from '../../pages/laboratorio/criarRoteiro';
import ListaAtividadesDoRoteiro from '../../pages/laboratorio/listaAtividadesDoRoteiro';


const Tab = createMaterialTopTabNavigator();

export default function MenuDetalhesRoteiroAgencia({ route }) {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Roteiro" initialParams={route.params} component={EditarRoteiro} />
            <Tab.Screen name="Atividades" component={ListaAtividadesDoRoteiro} />
        </Tab.Navigator>
    );
}