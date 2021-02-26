import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { i18n } from '../../translate/i18n';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function Login() {
  const navigation = useNavigation();
  const [email, onChangeTextEmail] = React.useState('');
  const [senha, onChangeTextSenha] = React.useState('');
  const auth = async () => {
    return await fetch('https://labtrip-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        senha: senha
      })
    });
  }
  let descErro = null;
  return (
    <SafeAreaView style={styles.container} >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', }}>
        <View style={styles.scrollContainer}>
          <Image source={require('../../imgs/logo.png')} style={styles.logo} />

          <Text style={styles.title}>Olá!</Text>
          <Text style={styles.title}>Seja bem-vindo ao Labtrip.</Text>
          <TextInput keyboardType={'email-address'} placeholder='email@email.com' style={styles.input}
            onChangeText={text => onChangeTextEmail(text.trim())} value={email} />
          <TextInput keyboardType={'visible-password'} placeholder='senha' style={styles.input} secureTextEntry={true}
            onChangeText={text => onChangeTextSenha(text)} value={senha} />
          <TouchableOpacity style={styles.botaoLogin} onPress={() => {
            auth().then(response => {
              return response.json();
            }).then((json) => {
              if (json.codigo == "200") {
                const token =  json.token;
                navigation.navigate('MenuPrincipal', {
                  token: token,
                });
              }
              else {
                console.log("Credenciais inválidas");
                alert(json.erro);
              }
            });
          }}>
            <Text style={styles.botaoLoginTexto}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('RedefinirInserirEmail')}>
            <Text style={styles.link} >
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3385FF',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'Roboto',
    textAlign: 'center'
  },
  logo: {
    width: 192,
    height: 58,
    marginBottom: 15
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
  botaoLogin: {
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
  botaoLoginTexto: {
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
