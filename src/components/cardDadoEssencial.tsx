import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Image, View, Switch, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { black } from 'react-native-paper/lib/typescript/styles/colors';

interface Permissoes {
  id: string,
  descricao: string
}

export default function CardParticipante(props) {
  let icon, color;
  const [arquivo, setArquivo] = useState('');
  const [metaDados, setMetadados] = useState(props.metaDados);
  const [image, setImage] = useState('');

  useEffect(() => {
    
  }, []);

  const retornaToken = async () => {
    let localToken = await AsyncStorage.getItem('AUTH');
    if (localToken != null) {
      localToken = JSON.parse(localToken)
    }

    return localToken;
  }

  const getdocumentProfile = async () => {

    const buscaFoto = async () => {
      let localToken = await retornaToken() || '';
      return await fetch('https://labtrip-backend.herokuapp.com/usuarios/fotoperfil/' + metaDados.usuarioId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'image/jpeg',
          'x-access-token': localToken
        }
      });
    }

    const responseFoto = await buscaFoto();
    const blob = await responseFoto.blob();

    if (responseFoto.status == 200) {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        var base64data = reader.result?.toString() || "";
        setImage(base64data)
      }
    }
  }

  const excluiDocumento = async () => {
      let localToken = await retornaToken() || '';
      const response = await fetch('https://labtrip-backend.herokuapp.com/dadosEssenciais/arquivoDadosEssenciais/' + metaDados.id, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'x-access-token': localToken
        }
      });
    

    if (response.status == 204) {
      alert('Arquivo deletado com sucesso!');
      props.refresh();
    }
    else{
      alert('Erro ao deletar arquivo!');
    }
  }

  return (
    <TouchableOpacity key={metaDados.id} style={styles.conteudoCard} onPress={() => alert('baixou o arquivo: ' + metaDados.nomeArquivo + ', id: ' + metaDados.id)}>
        <View style={styles.textContainer}>
          <Text style={styles.textoCard}  numberOfLines={3} ellipsizeMode={'head'}>{metaDados.nomeArquivo}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => alert('Baixar')}>
            <MaterialCommunityIcons name="file-download" color={'#848484'} size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => excluiDocumento()}>
            <MaterialCommunityIcons name="close-thick" color={'red'} size={30} />
          </TouchableOpacity>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    conteudoCard: {
        margin: 7,
        height: '90%',
        minHeight: 70,
        backgroundColor: '#DFDEDE',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        borderRadius: 20,
        maxWidth: 150,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#D8D6D6'
    },
    textContainer:{
      width: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    buttonsContainer:{
      width: '90%',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    textoCard:{
        maxWidth:'80%',
        textAlign: 'center',
        color: '#5E5E5E'
    }
});