import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import MenuLaboratorio from '../menu/menuLaboratorio';
import CriarViagem from '../../pages/laboratorio/criarViagem';
import EditarViagem from '../../pages/laboratorio/editarViagem';
import CadastroAgencias from '../../pages/laboratorio/cadastroAgencias';
import CadastroUsuarios from '../../pages/laboratorio/cadastroUsuarios';
import CriarAgencia from '../../pages/laboratorio/criarAgencia';
import CriarUsuario from '../../pages/laboratorio/criarUsuario';
import EditarAgencia from '../../pages/laboratorio/editarAgencia';
import EditarUsuario from '../../pages/laboratorio/editarUsuario';
import MenuDetalhesViagemAgencia from '../menu/menuDetalhesViagemAgencia';
import EditarDespesaAdicional from '../../pages/listaViagens/editarDespesaAdicional';
import EditarOrcamentoPlanejado from '../../pages/listaViagens/editarOrcamentoPlanejado';
import AdicionarDespesa from '../../pages/listaViagens/adicionarDespesa';
import ConvidarParticipantes from '../../pages/listaViagens/convidarParticipante';
import CriarRoteiro from '../../pages/laboratorio/criarRoteiro';
import MenuDetalhesRoteiroAgencia from '../menu/menuDetalhesRoteiroAgencia';
import DetalhesAtividade from '../../pages/listaViagens/detalhesAtividade';
import Chat from '../../pages/chat/chat'
import AdicionarAtividadeRoteiro from '../../pages/laboratorio/adicionarAtividadeRoteiro'
import CriarAtividade from '../../pages/laboratorio/criarAtividadeCallBack'
import EditarAtividadeRoteiro from '../../pages/laboratorio/editarAtividadeRoteiro'
import AdicionarMidias from '../../pages/listaViagens/adicionarMidias';
import i18n from '../../translate/i18n';

const { Navigator, Screen } = createStackNavigator();

export default function TelasLaboratorio() {
  return (
    <Navigator>
      <Screen name="Laboratorio" options={{ headerShown: false }} component={MenuLaboratorio} />
      <Screen name="CriarViagem" options={{ title: i18n.t('telasLaboratorio.criarViagem') }} component={CriarViagem} />
      <Screen name="EditarViagem" options={{ title: i18n.t('telasLaboratorio.editarViagem') }} component={EditarViagem} />
      <Screen name="EditarRoteiro" options={{ title: i18n.t('telasLaboratorio.editarRoteiro') }} component={MenuDetalhesRoteiroAgencia} />
      <Screen name="CadastrarAgencia" component={CadastroAgencias} />
      <Screen name="CadastrarUsuario" component={CadastroUsuarios} />
      <Screen name="CriarAgencia" options={{ title: i18n.t('telasLaboratorio.criarAgencia') }} component={CriarAgencia} />
      <Screen name="CriarUsuario" options={{ title: i18n.t('telasLaboratorio.criarUsuario') }} component={CriarUsuario} />
      <Screen name="EditarAgencia" options={{ title: i18n.t('telasLaboratorio.editarAgencia') }} component={EditarAgencia} />
      <Screen name="EditarUsuario" options={{ title: i18n.t('telasLaboratorio.editarUsuario') }} component={EditarUsuario} />
      <Screen name="MenuDetalhesViagemAgencia" options={{ title: i18n.t('telasLaboratorio.editarViagem') }} component={MenuDetalhesViagemAgencia} />
      <Screen name="EditarOrcamentoPlanejado" options={{ title: i18n.t('telasLaboratorio.editarOrcamentoPlanejado') }} component={EditarOrcamentoPlanejado} />
      <Screen name="EditarDespesaAdicional" options={{ title: i18n.t('telasLaboratorio.editarDespesaAdicional') }} component={EditarDespesaAdicional} />
      <Screen name="AdicionarDespesa" options={{ title: i18n.t('telasLaboratorio.adicionarDespesa') }} component={AdicionarDespesa} />
      <Screen name="ConvidarParticipantes" options={{ title: i18n.t('telasLaboratorio.convidarParticipantes') }} component={ConvidarParticipantes} />
      <Screen name="CriarRoteiro" options={{ title: i18n.t('telasLaboratorio.criarRoteiro') }} component={CriarRoteiro} />
      <Screen name="DetalhesAtividade" options={{ title: i18n.t('telasEditarAgencia.detalhesAtividade') }} component={DetalhesAtividade} />
      <Screen name="Chat" options={{ title: "Chat" }} component={Chat} />
      <Screen name="AdicionarAtividadeRoteiro" options={{ title: i18n.t('telasLaboratorio.adicionarAtividadesNoRoteiro') }} component={AdicionarAtividadeRoteiro} />
      <Screen name="CriarAtividade" options={{ title: i18n.t('telasLaboratorio.criarAtividades') }} component={CriarAtividade} />
      <Screen name="EditarAtividadeRoteiro" options={{ title: i18n.t('telasLaboratorio.editarAtividades') }} component={EditarAtividadeRoteiro} />
      <Screen name="AdicionarMidias" options={{ title: i18n.t('telasLaboratorio.adicionarMidias') }} component={AdicionarMidias} />
    </Navigator>
  );
}