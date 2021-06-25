import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '../../translate/i18n';



export default function RedefinirSucesso() {
  const navigation = useNavigation();
 
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../imgs/logo.png')} style={styles.logo} />
      <Text style={styles.texto}>{i18n.t('redefinirSenha.sucesso')}</Text>
      <TouchableOpacity style={styles.botaoRedefinir} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.botaoRedefinirTexto}>{i18n.t('botoes.entrar')}</Text>
      </TouchableOpacity>
      <StatusBar/>
    </SafeAreaView>
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
    padding: 10,
    borderRadius: 40,
    marginTop: 30,
    height: 50,
    width: 144,
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
  }
});
