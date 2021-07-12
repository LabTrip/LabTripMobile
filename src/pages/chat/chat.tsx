import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import CardMensagem from '../../components/cardMensagem'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {io} from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import i18n from '../../translate/i18n';

interface Mensagem {
  metadata: {
    id: string,
    usuarioId: string,
    enviadoPor: string
  },
  mensagem: string
}

export default function Chat({ route }) {
  const [viagem, setViagem] = useState(route.params.viagem);
  const isFocused = useIsFocused();
  const [topico, setTopico] = useState(route.params.topico);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [mensagem, setMensagem] = React.useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [showLoader, setShowLoader] = React.useState(false);
  const [socket, setSocket] = React.useState(io('https://labtrip-backend.herokuapp.com/', { transports: ["websocket"] }));
  const [flatList, setFlatList] = useState<any>();

  const retornaUserId = async () => {
    let userId = await AsyncStorage.getItem('USER_ID');
    if (userId != null) {
      userId = JSON.parse(userId)
    }
    setUsuarioId(userId || '');
  }
  

  const retornaToken = async () => {
    let localToken = await AsyncStorage.getItem('AUTH');
    if (localToken != null) {
        localToken = JSON.parse(localToken)
    }
    return localToken;
  }

  const verificaChatExiste = async (token) => {
    const urn = viagem.id + '/' + topico.descricao + '?verificar=true'
    const response = await fetch('https://labtrip-backend.herokuapp.com/chats/' + urn, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
    return response.status;
  }

  const criaChat = async (token) => {
    const response = await fetch('https://labtrip-backend.herokuapp.com/chats/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
              viagemId: viagem.id,
              topico: topico.descricao
            })
        });
    return response.status;
  }

  const conectaSocket = async () => {
    try{
      setShowLoader(true);
      let localToken = await retornaToken() || '';
      const chatExiste = await verificaChatExiste(localToken);
      console.log(chatExiste)
      if(chatExiste == 404){
        const criouChat = await criaChat(localToken);
        console.log(criouChat)        
      }
      socket.connect();
      socket.on("connect", () => {
        //console.log("Frontend, connected!");
      });
      socket.emit('joinRoom', {token: localToken, room: viagem.id+'/'+topico.descricao})
      //console.log('join')

      adicionaListeners();
    }
    catch(e){
      console.log(e)
    }
    finally{
      //setShowLoader(false);
      return
    }
  }

  const adicionaListeners = () => {
    socket.on('message', (message) => {
      setMensagens(mensagens => [...mensagens, message]);
    })

    socket.on('messages', (messages) => {
      setMensagens(messages);
      setShowLoader(false);
    })
  }

  const onSendMessage = () => {
    socket.emit('chatMessage', mensagem);
    setMensagem('');
  }

  useEffect(() => {
    try{
      retornaUserId();
      if(isFocused){
        conectaSocket();
      }
      else{
        //console.log('desconectou')
        socket.disconnect()
      }
      return
    }
    catch(e){
      console.log('Error')
      console.log(e)
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
      <Modal animationType="fade" transparent={true} visible={showLoader}
          onRequestClose={() => {
              setShowLoader(!showLoader)
          }}>
          <View style={styles.centeredView}>
              <View style={styles.modalView}>
                  <ActivityIndicator style={styles.loader} animating={showLoader} size="large" color="#0FD06F" />
                  <Text style={styles.textStyle}>
                    {i18n.t('modais.aguarde')}
                  </Text>
              </View>
          </View>
          
      </Modal>
      <View>
        <Text>{topico.descricao}</Text>
      </View>
      <FlatList
        ref={(view) => {
          setFlatList(view); 
        }}
        onContentSizeChange={() => {
          flatList.scrollToEnd();
        }}
        style={{ flexGrow: 1, flex: 1, flexDirection: 'column' , width: '100%'}}
        data={mensagens}
        keyExtractor={(item) => item.metadata.id.toString()}
        renderItem={({ item }) => (
          <CardMensagem enviadoPor={item.metadata.enviadoPor} mensagem={item.mensagem} item={item} usuarioId={usuarioId}/>
        )}
      />
      <View style={styles.containerInline}>
        <TextInput placeholder='Digite sua mensagem aqui' style={styles.input}
            onChangeText={text => setMensagem(text)} value={mensagem} />
        <TouchableOpacity style={styles.iconContainer} onPress={onSendMessage}>
          <MaterialCommunityIcons name="send" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  botaoMais: {
    margin: 20
  },
  cabecalhoTabela: {
    backgroundColor: 'black',
  },
  textoCabecalho: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  corpoTabela: {
    backgroundColor: '#EBEBEB'
  },
  scroll: {
    flexGrow: 1,
    flexDirection: 'column',
  },
  mensagens: {
    flexGrow: 1, 
    flex: 1, 
    flexDirection: 'column' , 
    width: '100%'
  },
  input: {
    padding: 10,
    width: 320,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 32,
  },
  containerInline: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: '5%',
  },
  iconContainer: {
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: 45
  },
  icon: {
    color: 'black',
    flex: 1,
    fontSize: 20
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