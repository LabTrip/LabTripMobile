import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import DetalhesParticipantes from '../../pages/listaViagens/detalhesParticipantes';
import EditarViagem from '../../pages/laboratorio/editarViagem'
import ListaPropostaDeRoteiro from '../../pages/laboratorio/listaPropostaDeRoteiro'
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../translate/i18n';

const Tab = createMaterialTopTabNavigator();
let token;

export default function MenuDetalhesViagemAgencia({ route }) {
    const getViagem = async () => {
        return await fetch('https://labtrip-backend.herokuapp.com/viagens/' + route.params.viagem.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
    }

    const request = async () => {
        const value = await AsyncStorage.getItem('AUTH')
        if (value != null) {
            token = JSON.parse(value)
            const response = await getViagem();
            const json = await response.json();
            if (response.status == 200) {
                route.params.viagem.alterar = json.alterar;
            }else{
                alert( i18n.t('cardViagem.erro') + ": " + json.mensagem + "\n" + i18n.t('cardViagem.verifiqueConexao'));
            }
        }
    }

    request();
    
    return (
        <Tab.Navigator>
            <Tab.Screen name={i18n.t('menuDetalhesViagemAgencia.viagem')} initialParams={route.params} component={EditarViagem} />
            <Tab.Screen name={i18n.t('menuDetalhesViagemAgencia.roteiros')} initialParams={route.params} component={ListaPropostaDeRoteiro} />
            <Tab.Screen name={i18n.t('menuDetalhesViagem.participantes')} initialParams={route.params} component={DetalhesParticipantes} />
        </Tab.Navigator>
    );
}