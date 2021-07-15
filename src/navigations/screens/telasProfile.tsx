import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import EditarPerfil from '../../pages/profile/editarPerfil';
import AlterarSenha from '../../pages/profile/alterarSenha';
import i18n from '../../translate/i18n';

const { Navigator, Screen } = createStackNavigator();

export default function TelasProfile() {
    return (
        <Navigator initialRouteName="EditarPerfil">
            <Screen name="EditarPerfil" options={{ headerShown: false }} component={EditarPerfil} />
            <Screen name="AlterarSenha" options={{title: i18n.t('botoes.alterarSenha')}} component={AlterarSenha} />
        </Navigator>
    );
}