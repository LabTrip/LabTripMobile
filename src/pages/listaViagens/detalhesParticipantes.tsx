import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import BotaoMais from '../../components/botaoMais';
import CardParticipante from '../../components/cardParticipante';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

interface Viagem {
    id: string,
    descricao: string,
    dataInicio: Date,
    dataFim: Date,
    statusId: number,
    participantes : [
        usuarioId: string,
        permissaoViagemId: string
    ]
  }

  interface Participante {
    usuarioId: string,
    nome: string,
    viagemId: string,
    permissaoViagemId: string,
    descricao: string
  }

export default function DetalhesParticipantes({ route }) {
    const navigation = useNavigation();
    let Token;
    const [token, setToken] = useState(Token);
    const [refreshing, setRefreshing] = useState(false);
    const [participantes, setParticipantes] = useState<Participante[]>([]);
    const [viagem, setViagem] = useState(route.params.viagem);
    const [id, setId] = useState(4);

    let [addUser, setAddUser] = React.useState({
        id: id.toString(),
        nome: "Testeaaaa n" + id.toString(),
        dono: true,
        proprietario: true,
    });



    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setTimeout(()=>{

        }, 2000)
        setRefreshing(false)
    }, [refreshing]);

    const getViagem = async () => {
      let localToken = retornaToken();
        return await fetch('https://labtrip-backend.herokuapp.com/viagens/', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localToken
          }
        });
      }

    const getParticipantesViagem = async () => {
      let localToken = retornaToken();
      
      return await fetch('https://labtrip-backend.herokuapp.com/viagens/participantes/' + viagem.id, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localToken
        }
      });
    }

    const retornaToken = () => {
      let localToken;
      if(Token){
        localToken = Token;
      }
      else{
        localToken = token;
      }

      return localToken;
    }
    
      useEffect(() => {
        const request = async () => {
          try {
            const value = await AsyncStorage.getItem('AUTH');
            if (value != null) {
              Token = JSON.parse(value)
              const response = await getParticipantesViagem();
              const json = await response.json();
              if (response.status == 200) {
                setParticipantes(json.participantes);
              }
            }
          }
          catch (e) {
            console.log(e)
          }
        }
        request()
      }, [refreshing]);

    return (
      <View style={styles.container}>
            <BotaoMais onPress={() => {
               navigation.navigate('ConvidarParticipantes');
            }} />
            <FlatList
                contentContainerStyle={{ alignItems: 'center' }}
                data={participantes}
                refreshControl={
                  <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                  />
                }
                keyExtractor={(item) => item.usuarioId}
                renderItem={({ item }) => {
                    const backgroundColor = item.usuarioId === viagem.usuarioDonoId ? "#CCEEFF" : "#787878";
                    const dono = item.usuarioId === viagem.usuarioDonoId;
                    return (
                        <CardParticipante nome={item.nome} dono={dono} proprietario={true}
                            style={{ backgroundColor: "#CCEEFF" }}
                        />
                    )
                }
                }
            />
        
      </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
})
