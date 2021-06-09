import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity, Text, Modal, ActivityIndicator } from 'react-native';
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
    const [refreshing, setRefreshing] = useState(false);
    const [participantes, setParticipantes] = useState<Participante[]>([]);
    const [viagem, setViagem] = useState(route.params.viagem);
    const [id, setId] = useState(4);
    const [showLoader, setShowLoader] = React.useState(false);

    let [addUser, setAddUser] = React.useState({
        id: id.toString(),
        nome: "Testeaaaa n" + id.toString(),
        dono: true,
        proprietario: true,
    });



    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const response = await getParticipantesViagem();
        setTimeout(()=>{

        }, 2000)
        setRefreshing(false)
    }, [refreshing]);

    const getViagem = async () => {
      let localToken = await retornaToken() || '';
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
      let localToken = await retornaToken() || '';
      
      const response = await fetch('https://labtrip-backend.herokuapp.com/viagens/participantes/' + viagem.id, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localToken
        }
      });

      const json = await response.json();
      if (response.status == 200) {
        setParticipantes([]);
        setParticipantes(json.participantes);
      }
    }

    const deleteParticipantesViagem = async (participante) => {
      let localToken = await retornaToken() || '';
      
      const response = await fetch('https://labtrip-backend.herokuapp.com/viagens/participantes/' + viagem.id, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localToken
        },
        body: JSON.stringify({participantes: participante})
      });

      const json = await response.json();
      if (response.status == 204) {
        alert('Participante removido com sucesso!');
        const response = await getParticipantesViagem();
      }
      else{
        alert('Erro ao remover participante.');
      }
    }

    const retornaToken = async () => {
      let localToken = await AsyncStorage.getItem('AUTH');
      if (localToken != null) {
        localToken = JSON.parse(localToken)
      }

      return localToken;
    }
    
      useEffect(() => {
        const request = async () => {
          try {
            const response = await getParticipantesViagem();
          }
          catch (e) {
            console.log(e)
          }
        }
        request()
      }, []);

      const onClickSalvaParticipantes = async () => {
        try {
          let localToken = await retornaToken() || '';
            console.log('participantes: ')
            console.log(participantes)
            setShowLoader(true);
            const response = await fetch('https://labtrip-backend.herokuapp.com/viagens/participantes/' + viagem.id, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localToken
                },
                body: JSON.stringify({participantes: participantes})
            });
            let json = await response.json();
            if (response.status >= 200 && response.status <= 299) {
                alert('Participantes salvos com sucesso!')
            } else {
                alert(json.mensagem);
            }
        }
        catch (e) {
            alert('Erro ao salvar participantes.')
        }
        finally {
            setShowLoader(false);
        }
    }

    const alteraParticipante = async (item) =>{
      let participantesAux = participantes;
      participantes.map((p, index) => {
        if(p.usuarioId == item.usuarioId){
          participantesAux[index] = item
        }
      });

      setParticipantes([]);
      setParticipantes(participantesAux);
    }

    const removerParticipante = async (item) =>{
      Alert.alert(
          'Remover participante',
          'Deseja mesmo remover o participante?',
          [
              {
                  text: 'sim',
                  onPress: async () => {
                    let participantesRemovidos = [item];
                    const response = await deleteParticipantesViagem(participantesRemovidos);
                  }
              },
              {
                  text: 'não',
                  onPress: () => {

                  }
              }
          ]
      )
      
    }

    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={showLoader}
          onRequestClose={() => {
              setShowLoader(!showLoader)
          }}
        >
          <View style={styles.centeredView}>
              <View style={styles.modalView}>
                  <ActivityIndicator style={styles.loader} animating={showLoader} size="large" color="#0FD06F" />
                  <Text style={styles.textStyle}>
                      Aguarde...
              </Text>
              </View>
          </View>
        </Modal>
            <BotaoMais onPress={() => {
               navigation.navigate('ConvidarParticipantes', {viagem});
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
                renderItem={({ item, index }) => {
                    const backgroundColor = item.usuarioId === viagem.usuarioDonoId ? "#CCEEFF" : "#787878";
                    const dono = item.usuarioId === viagem.usuarioDonoId;
                    return (
                        <CardParticipante nome={item.nome} dono={dono} permissaoViagemId={item.permissaoViagemId} proprietario={true}
                            style={{ backgroundColor: "#CCEEFF" }} item={item} alteraParticipante={alteraParticipante} removeParticipante={removerParticipante}
                        />
                    )
                }
                }
            />
          <TouchableOpacity style={styles.botaoCriar} onPress={onClickSalvaParticipantes}>
            <Text style={styles.botaoCriarTexto}>Salvar participantes</Text>
          </TouchableOpacity>
      </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    botaoCriar: {
        backgroundColor: '#3385FF',
        width: 180,
        height: 50,
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center'
    },
    botaoCriarTexto: {
      color: '#fff',
      fontSize: 20,
      textAlign: 'center'
    },
    loader: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        opacity: 0.9,
        borderRadius: 20,
        padding: '20%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    }
})
