import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import MenuDetalhesViagem from '../menu/menuDetalhesViagem';
import ListaViagens from '../../pages/listaViagens/listaViagens';
import DetalhesAtividade from '../../pages/listaViagens/detalhesAtividade';
import ConvidarParticipantes from '../../pages/listaViagens/convidarParticipante';
import EditarOrcamentoPlanejado from '../../pages/listaViagens/editarOrcamentoPlanejado';
import EditarDespesaAdicional from '../../pages/listaViagens/editarDespesaAdicional'
import AdicionarDespesa from '../../pages/listaViagens/adicionarDespesa';
import AdicionarMidias from '../../pages/listaViagens/adicionarMidias';
import Chat from '../../pages/chat/chat';
import EditarAtividadeRoteiro from '../../pages/laboratorio/editarAtividadeRoteiro';
import CriarAtividade from '../../pages/laboratorio/criarAtividadeCallBack';
import i18n from '../../translate/i18n';

const { Navigator, Screen } = createStackNavigator();

export default function TelasListaViagens() {
    return (
        <Navigator initialRouteName="ListaViagens">
            <Screen name="ListaViagens" options={{ headerShown: false }} component={ListaViagens} />
            <Screen name="MenuDetalhesViagem" options={{ headerShown: false }} component={MenuDetalhesViagem} />
            <Screen name="DetalhesAtividade" options={{ title: i18n.t('telasEditarAgencia.detalhesAtividade') }} component={DetalhesAtividade} />
            <Screen name="ConvidarParticipantes" options={{ title: i18n.t('telasLaboratorio.convidarParticipantes') }} component={ConvidarParticipantes} />
            <Screen name="EditarOrcamentoPlanejado" options={{ title: i18n.t('telasLaboratorio.editarOrcamentoPlanejado') }} component={EditarOrcamentoPlanejado} />
            <Screen name="EditarDespesaAdicional" options={{ title: i18n.t('telasLaboratorio.editarDespesaAdicional') }} component={EditarDespesaAdicional} />
            <Screen name="AdicionarDespesa" options={{ title: i18n.t('telasLaboratorio.adicionarDespesa') }} component={AdicionarDespesa} />
            <Screen name="AdicionarMidias" options={{ title: "Editar midias" }} component={AdicionarMidias} />
            <Screen name="Chat" options={{ title: "Chat" }} component={Chat} />
            <Screen name="EditarAtividadeRoteiro" options={{ title: i18n.t('telasLaboratorio.editarAtividades') }} component={EditarAtividadeRoteiro} />
            <Screen name="CriarAtividade" options={{ title: i18n.t('telasLaboratorio.criarAtividades') }} component={CriarAtividade} />

        </Navigator>
    );
}