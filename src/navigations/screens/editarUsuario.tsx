import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import MenuDetalhesViagem from '../menu/menuDetalhesViagem';
import ListaViagens from '../../pages/listaViagens/listaViagens';
import DetalhesAtividade from '../../pages/listaViagens/detalhesAtividade';
import i18n from '../../translate/i18n';

const { Navigator, Screen } = createStackNavigator();

export default function TelasListaViagens() {
    return (
        <Navigator initialRouteName="ListaViagens">
            <Screen name="ListaViagens" options={{ headerShown: false }} component={ListaViagens} />
            <Screen name="MenuDetalhesViagem" options={{ headerShown: false }} component={MenuDetalhesViagem} />
            <Screen name="DetalhesAtividade" options={{title: i18n.t('telasEditarAgencia.detalhesAtividade')}} component={DetalhesAtividade} />
        </Navigator>
    );
}