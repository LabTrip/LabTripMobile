import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import DetalhesParticipantes from '../../pages/listaViagens/detalhesParticipantes';
import EditarViagem from '../../pages/laboratorio/editarViagem'
import ListaPropostaDeRoteiro from '../../pages/laboratorio/listaPropostaDeRoteiro'
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                alert("Erro ao buscar informações da viagem: " + json.mensagem + "\n Reinicie o aplicativo e tente novamente!");
            }
        }
    }

    request();

    return (
        <Tab.Navigator>
            <Tab.Screen name="Viagem" initialParams={route.params} component={EditarViagem} />
            <Tab.Screen name="Roteiros" initialParams={route.params} component={ListaPropostaDeRoteiro} />
            <Tab.Screen name="Participantes" initialParams={route.params} component={DetalhesParticipantes} />
        </Tab.Navigator>
    );
}