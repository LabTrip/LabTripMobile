import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import BarraPesquisa from '../../components/barraPesquisa';
import CardViagem from '../../components/cardViagem';
import ScrollViewFlat from '../../components/scrollViewFlat';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Tab = createMaterialBottomTabNavigator();

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
  const [refreshing, setRefreshing] = React.useState(false);

  let viagensData = [
    {
      id: 'a6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      nome: "Fim de semana em Ubatuba",
      dataInicio: "26/02/2021",
      dataFim: "28/02/2021",
      local: "Ubatuba - SP",
      status: 1,
      navigate: "MenuDetalhesViagemAgencia"
    },
    {
      id: 'a6b86b273ff34fce19d6b804efaaaf5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      nome: "Fim de semana em Ubatuba",
      dataInicio: "26/02/2021",
      dataFim: "28/02/2021",
      local: "Ubatuba - SP",
      status: 2,
      navigate: "MenuDetalhesViagemAgencia"
    },
    {
      id: '4e07408562bedb8b60aaaace05c1decfe3ad16b72230967de01f640b7e4729b49fce',
      nome: "Fim de semana em Ubatuba",
      dataInicio: "26/02/2021",
      dataFim: "28/02/2021",
      local: "Ubatuba - SP",
      status: 3,
      navigate: "MenuDetalhesViagemAgencia"
    },
    {
      id: '4e07408562bedb8b60ce05c1decfe3ad16b72230961fe01f640b7e4729baaa49fce',
      nome: "Fim de semana em Ubatuba",
      dataInicio: "26/02/2021",
      dataFim: "28/02/2021",
      local: "Ubatuba - SP",
      status: 5,
      navigate: "MenuDetalhesViagemAgencia"
    },
    {
      id: '4e07428562bedb8b60ce05c1decfe3ad16b72230961fe01f640b7e4729baaa49fce',
      nome: "Fim de semana em Ubatuba",
      dataInicio: "26/02/2021",
      dataFim: "28/02/2021",
      local: "Ubatuba - SP",
      status: 4,
      navigate: "MenuDetalhesViagemAgencia"
    }
  ];

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

  useEffect(() => {
    const request = async () => {
      try {
        const value = await AsyncStorage.getItem('AUTH');
        if (value != null) {
          token = JSON.parse(value)
          const response = await getViagens();
          const json = await response.json();
          if (response.status == 200) {
            setViagens(json);
          }
          console.log(viagens)
        }
      }
      catch (e) {
        alert(e)
      }
    }
    request()
  }, [refreshing]);



  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false)
  }, [refreshing]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <BarraPesquisa texto={'Pesquisar viagem...'} />
      
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={styles.botaoMais} onPress={() => navigation.navigate('CriarViagem')}>
            <Image source={require('../../imgs/plus-circle.png')} />
          </TouchableOpacity>
        </View>
        
          <FlatList
            style={{ flexGrow: 1, flex: 1, flexDirection: 'column'}}
            contentContainerStyle={{alignItems: 'center'}}
            data={viagens}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardViagem nome={item.descricao} dataInicio={moment(item.dataInicio).format('DD/MM/yyyy')} 
              dataFim={moment(item.dataFim).format('DD/MM/yyyy')} dono={item.dono} local={""} status={item.statusId} 
              navigate={"MenuDetalhesViagemAgencia"} item={item} />
            )}
          />
      
    </View >
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
