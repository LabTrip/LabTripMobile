import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '../../translate/i18n';
import * as Linking from 'expo-linking';


export default function RedefinirInserirSenha({route}) {
  const {email, codigoVerificacao} = route.params;
  const navigation = useNavigation();
  const [senha, onChangeSenha] = React.useState('');
  const [confirmSenha, onChangeConfirmSenha] = React.useState('');
  const [senhaForte, setSenhaForte] = React.useState(false);

  const redefine = async () => {
    return fetch('https://labtrip-backend.herokuapp.com/login/redefine',{
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        codigoVerificacao: codigoVerificacao,
        senha: senha
      })      
    });
  }

  

  const verificaSenhas = () => {
    if(senha != confirmSenha){
      alert("As senhas não conferem.");
      return false;
    }
    return true;
  }

  const validaForcaSenha = async () => {
      var regex = /\d/g;
      if(senha.length >= 7 && regex.test(senha) ){
          await setSenhaForte(true);
      }
      else{
          await setSenhaForte(false);
      }
  }


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', }}>
        <View style={styles.scrollContainer}>
      <Image source={require('../../imgs/logo.png')} style={styles.logo} />
      <Text style={styles.titulo}>{i18n.t('redefinirSenha.titulo')}</Text>
      <Text style={styles.texto}>{i18n.t('redefinirSenha.InserirNovaSenha')}</Text>
      <TextInput placeholder={i18n.t('redefinirSenha.digiteSenha')} secureTextEntry={true} style={styles.input} 
      onChangeText={text => {onChangeSenha(text); validaForcaSenha()}} value={senha}/>
      {
                senhaForte 
                ? <View style={styles.passwordContainerValid} ></View> 
                : <View style={styles.passwordContainer}></View>
      }
      <TextInput placeholder={i18n.t('redefinirSenha.confirmeSenha')} secureTextEntry={true} style={styles.input} 
      onChangeText={text => onChangeConfirmSenha(text)} value={confirmSenha}/>
      <TouchableOpacity onPress={ () => Linking.openURL('https://labtrip-backend.herokuapp.com/public/termo-de-uso')}>
        <Text style={styles.textoObs}>*{i18n.t('redefinirSenha.termoTexto')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botaoRedefinir} onPress={async () => {
        if(verificaSenhas()){
          if(senhaForte){
            let response = await redefine();
            let json = await response.json();
            if (response.status >= 200 && response.status <= 299) {
              navigation.navigate('RedefinirSucesso')
            }
            else {
              alert(json.mensagem);
            }
          }
          else{
            alert(i18n.t('redefinirSenha.erroCriterios'))
          }
          
        }
        }}>
        <Text style={styles.botaoRedefinirTexto}>{i18n.t('botoes.redefinir')}</Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
      <StatusBar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3385FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    color: 'white',
    fontSize: 25,
    fontFamily: 'Roboto',
    textAlign: 'center'
  },
  texto: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Roboto',
    textAlign: 'center',
    maxWidth: '90%'
  },
  textoObs: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Roboto',
    textAlign: 'center',
    maxWidth: '90%',
    marginTop: '2%',
    textDecorationLine: 'underline'
  },
  logo: {
    width: 192,
    height: 58,
    marginBottom: 50
  },
  input: {
    marginTop: 20,
    padding: 10,
    width: 300,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 32,
  },
  botaoRedefinir: {
    backgroundColor: '#0FD06F',
    width: 144,
    height: 50,

    padding: 10,
    borderRadius: 40,
    marginTop: 30,

    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  botaoRedefinirTexto: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 24,
  },
  link: {
    fontSize: 20,
    marginTop: 30,
    textDecorationLine: 'underline',
    color: '#fff'
  },
  passwordContainer: {
      marginTop: 5,
      width: '89%',
      height: 3,
      borderRadius: 41,
      backgroundColor: '#EBEBEB',
      color: '#333333',
  },
  passwordContainerValid: {
      marginTop: 5,
      width: '89%',
      height: 3,
      borderRadius: 41,
      backgroundColor: '#23FD02',
      color: '#333333',
  }
});
