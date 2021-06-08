import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BarraPesquisa from '../../components/barraPesquisa';
import CardViagem from '../../components/cardViagem';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Viagem {
  id: string,
  descricao: string,
  dataInicio: Date,
  dataFim: Date,
  statusId: number,
  dono: string
}

export default function ListaEditarViagens() {
  let token;
  const moment = require('moment');
  const navigation = useNavigation();
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getViagens = async () => {
    return await fetch('https://labtrip-backend.herokuapp.com/viagens', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    });
  }

  const request = async () => {
    try {
      const value = await AsyncStorage.getItem('AUTH');
      if (value != null) {
        token = JSON.parse(value)
        const response = await getViagens();
        const json = await response.json();
        if (response.status == 200) {
          //filtrando lista apenas para viagens que estejam com o status = 2 - em planejamento
          setViagens(json.filter(function (e) {
            return e.statusId = 2
          }));
        }
      }
    }
    catch (e) {
      alert(e)
    }
  }

  useEffect(() => {
    request()
  }, []);



  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    request()
    setRefreshing(false)
  }, [refreshing]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <BarraPesquisa texto={'Pesquisar viagem...'} viagens={viagens} callbackFunction={setViagens} />
      <FlatList
        style={{ flexGrow: 1, flex: 1, flexDirection: 'column' }}
        contentContainerStyle={{ alignItems: 'center' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        extraData={viagens}
        data={viagens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardViagem nome={item.descricao} dataInicio={moment(item.dataInicio).format('DD/MM/yyyy')}
            dataFim={moment(item.dataFim).format('DD/MM/yyyy')} dono={item.dono} local={""} status={item.statusId}
            navigate={"MenuDetalhesViagemAgencia"} item={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  botaoMais: {
    marginTop: 20,
  }
});
