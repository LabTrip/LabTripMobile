import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BarraNotificacao from '../../components/barraNotificacao';
const moment = require("moment");

interface Notificacao {
  notificacaoId: string,
  usuarioId: string,
  dataNotificacao: Date,
  visualizado: string,
  id: string,
  descricao: string
  icone: string
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();

  const retornaToken = async () => {
      let localToken = await AsyncStorage.getItem('AUTH');
      if (localToken != null) {
          localToken = JSON.parse(localToken)
      }
      return localToken;
  }

  const buscaNotificacoes = async () => {
      let localToken = await retornaToken() || '';

      const response = await fetch('https://labtrip-backend.herokuapp.com/notificacoes/',{
          method: 'GET',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'x-access-token': localToken
          }
      });

      const json = await response.json();
      //console.log(json)
      if (response.status == 200) {
        setNotificacoes(json.reverse());
      }
      else{
        console.log(json)
      }
  }

  useEffect(() => {
    try {
      buscaNotificacoes();
    }
    catch (e) {
        console.log(e)
    }
  }, [isFocused]);

  const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      const response = await buscaNotificacoes();
      setTimeout(() => {
          setRefreshing(false)
      }, 2000);
  }, [refreshing]);

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1}}
      data={notificacoes}
      refreshControl={
          <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
          />
      }
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => {
          return (
            <BarraNotificacao  icone={item.icone.toString()} texto={item.descricao} corDaBarra="#EBFAFF"  data={item.dataNotificacao}/>
          )
      }
      }
    />
  );
}

