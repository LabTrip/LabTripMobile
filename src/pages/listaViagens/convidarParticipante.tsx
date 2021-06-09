import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';

interface Permissoes{
    id: string,
    descricao: string
}

interface Usuario {
    id: string
}

export default function ConvidarParticipantes({route}) {
    const navigation = useNavigation();
    const [viagem, setViagem] = useState(route.params.viagem)
    const [permissoes, setPermissoes] = useState<Permissoes[]>([]);
    const [selectedValue, setSelectedValue] = useState(2);
    const [email, setEmail] = useState('');
    const [usuario, setUsuario] = useState<Usuario>({id: ''});
    const [showLoader, setShowLoader] = React.useState(false);

    useEffect(() => {
        const request = async () => {
          try {
              setShowLoader(true);
            const response = await getPermissoesViagem();
          }
          catch (e) {
            console.log(e)
          }
          finally{
            setShowLoader(false);
          }
        }
        request()
    }, []);

    const getPermissoesViagem = async () => {
        let localToken = await retornaToken() || '';
        
        const response = await fetch('https://labtrip-backend.herokuapp.com/viagens/permissoes-viagem', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localToken
          }
        });
  
        const json = await response.json();
        if (response.status == 200) {
            setPermissoes([]);
          setPermissoes(json.permissoes);
        }
      }

      const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
          localToken = JSON.parse(localToken)
        }
  
        return localToken;
      }

      const convidaUsuario = async () => {
        let localToken = await retornaToken() || '';
        const usuario = await getUsuario();
        const participante = {
            usuarioId: usuario.id,
            permissaoViagemId: selectedValue
        }
        const participantes = {
            participantes: [
                participante
            ]
        }

        const response = await fetch('https://labtrip-backend.herokuapp.com/viagens/participantes/' + viagem.id, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localToken
          },
          body: JSON.stringify(participantes)
        });
  
        return response;
      }

      const getUsuario = async () => {
        let localToken = await retornaToken() || '';
        
        const response = await fetch('https://labtrip-backend.herokuapp.com/usuarios/email/' + email, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localToken
          }
        });
  
        const json = await response.json();
        if (response.status == 200) {
          setUsuario(json[0]);
          return json[0]
        }
        return response;
      }

      const onClickConvidarParticipante = async () => {
          try{
            setShowLoader(true);
            const response = await convidaUsuario();
            if(response.status == 200){
                alert('Convite enviado com sucesso.')
                navigation.goBack();
            }
            else{
                alert('Erro ao enviar convite.')
            }
          }
          catch(e){
              console.log(e)
          }
          finally{
            setShowLoader(false);
          }
      }


    return (
        <View style={styles.container}>
            <Modal animationType="fade" transparent={true} visible={showLoader}
                    onRequestClose={() => {
                        setShowLoader(!showLoader)
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ActivityIndicator style={styles.loader} animating={showLoader} size="large" color="#0FD06F" />
                            <Text style={styles.textStyle}>
                                Aguarde...
                            </Text>
                        </View>
                    </View>

            </Modal>
            <Text style={styles.texto}>Digite o email do participante que deseja inserir na viagem.</Text>
            <TextInput placeholder='Email do convidado' autoCapitalize={'none'}
            autoCompleteType={'email'} style={styles.input} onChangeText={(text) => {setEmail(text)}} />
            <Text style={styles.label}>Permissao do usuário:</Text>
                    <Picker style={styles.pickerComponente}
                        itemStyle={styles.pickerComponente}
                        prompt="Tipo de usuário"
                        mode="dropdown"

                        selectedValue={selectedValue}
                        onValueChange={(itemValue, value) => {
                            setSelectedValue(itemValue)
                        }}>
                        {
                        permissoes.map(p => {
                            return (
                            <Picker.Item  key={p.id} label={p.descricao} value={p.id} />
                            )
                        })
                        }

                    </Picker>
            <TouchableOpacity style={styles.botaoSalvar} onPress={() => {onClickConvidarParticipante()}}>
                <Text style={styles.botaoSalvarTexto}>Convidar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    }, input: {
        marginTop: '10%',
        width: '90%',
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        color: '#333333',
        textAlign: 'center'
    },
    botaoSalvar: {
        backgroundColor: '#3385FF',
        width: 144,
        height: 50,
        padding: 10,
        borderRadius: 40,
        marginTop: 30,
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
    },
    botaoSalvarTexto: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 24,
    },
    texto:{
        fontSize: 24,
        textAlign: 'center',
        flexWrap: 'wrap',
        maxWidth: '90%',
    },
    pickerComponente: {
      margin: '5%',
      width: '90%',
      padding: 15,
      fontSize: 16,
      borderRadius: 41,
      backgroundColor: '#EBEBEB',
      color: '#333333',
    },
    label: {
      marginTop: '3%',
      marginHorizontal: '2%',
      textAlign: 'center',
      fontSize: 18,
      color: '#999999',
      width: '45%'
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