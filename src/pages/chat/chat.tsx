import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import CardMensagem from '../../components/cardMensagem'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {io} from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';


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
  const [topico, setTopico] = useState(route.params.topico);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [mensagem, setMensagem] = React.useState('');
  const [usuarioId, setUsuarioId] = useState('');
  let [socket, setSocket] = React.useState(io('http://192.168.0.13:5001/', { transports: ["websocket"] }));

  const messages = [
    {
      metadata: {
        id: '0',
        usuarioId: 'abc',
        enviadoPor: 'Gabriel'
      },
      mensagem: 'Olá'
    },
    {
      metadata: {
        id: '2',
        usuarioId: 'bca',
        enviadoPor: 'Maria'
      },
      mensagem: 'Olá'
    }
  ]

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


  const conectaSocket = async () => {
    let localToken = await retornaToken() || '';
    socket.connect();
    socket.on("connect", () => {
      console.log("Frontend, connected!");
    });
    socket.emit('joinRoom', {token: localToken, room: viagem.id+'/'+topico.descricao})
    console.log('join')

    socket.on('message', (message) => {
      setMensagens([...mensagens, message]);
    })

    socket.on('messages', (messages) => {
      setMensagens(messages);
    })

    return
  }

  const onSendMessage = () => {
    socket.emit('chatMessage', mensagem);
    setMensagem('');
  }

  useEffect(() => {
    try{
      retornaUserId();
      conectaSocket();
      return
    }
    catch(e){
      console.log('Error')
      console.log(e)
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
      <View>
        <Text>{topico.descricao}</Text>
      </View>
      <FlatList
        style={{ flexGrow: 1, flex: 1, flexDirection: 'column' , width: '100%'}}
        contentContainerStyle={{}}
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
  }
})