import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Image, View, Switch, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { black } from 'react-native-paper/lib/typescript/styles/colors';

interface Permissoes{
    id: string,
    descricao: string
}

export default function CardParticipante(props) {
    let icon, color;
    const [isEnabled, setIsEnabled] = useState(props.proprietario);
    const [selectedValue, setSelectedValue] = useState(props.permissaoViagemId);
    const [permissoesGerais, setPermissoesGerais] = useState<Permissoes[]>([]);
    const [permissoes, setPermissoes] = useState<Permissoes[]>([]);
    const [editar, setEditar] = useState(false);

    useEffect(() => {
        const request = async () => {
          try {
            const response = await getPermissoesViagem();
            const responseGeral = await getPermissoesViagemGeral();
            permitirEdicaoUsuario(response);
          }
          catch (e) {
            console.log(e)
          }
        }
        request()
    }, []);

    const getPermissoesViagem = async () => {
        let localToken = await retornaToken() || '';
        
        const response = await fetch('https://labtrip-backend.herokuapp.com/viagens/permissoes-viagem/'+props.item.viagemId, {
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

        return json.permissoes;
      }

      const getPermissoesViagemGeral = async () => {
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
          setPermissoesGerais([]);
          setPermissoesGerais(json.permissoes);
        }

        return json.permissoes;
      }

      const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
          localToken = JSON.parse(localToken)
        }
  
        return localToken;
      }

    const permitirEdicaoUsuario = (permissoes) => {
      let editar = false;
      permissoes.map((p) => {
        if(p.id == props.item.permissaoViagemId){ 
          editar = true;
        }
      })
      setEditar(editar);
    }

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    if (props.dono == true) {
        icon = 'crown';
        color = '#575757';
    } else {
        icon = 'close-thick';
        color = 'red';

    }
    return (
        <View style={styles.cardParticipante}>
            <Image source={require('../imgs/perfil.png')} style={styles.fotoPerfil} />
            <View style={styles.headerCardParticipante}>
                <Text style={styles.textoParticipante}> {props.nome}
            
                </Text>
                <View style={styles.containerProprietarioSwitch}>
                <Text style={styles.label}>Permissao do usuário:</Text>
                {
                  editar == true
                  ? (<Picker style={styles.pickerComponente}
                        prompt="Tipo de usuário"
                        mode="dropdown"
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, value) => {
                            setSelectedValue(itemValue)
                            props.item.permissaoViagemId = itemValue;
                            props.alteraParticipante(props.item)
                        }}>
                        {
                          
                        permissoes.map(p => {
                            return (
                            <Picker.Item  key={p.id} label={p.descricao} value={p.id} color={'#000000'}/>
                            )
                        })
                        }
                    </Picker>)
                  : (<Picker style={styles.pickerComponente}
                        prompt="Tipo de usuário"
                        enabled={editar}
                        mode="dropdown"
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, value) => {
                            setSelectedValue(itemValue)
                            props.item.permissaoViagemId = itemValue;
                            props.alteraParticipante(props.item)
                        }}>
                        {
                        permissoesGerais.map(p => {
                            return (
                            <Picker.Item  key={p.id} label={p.descricao} value={p.id} color={'#000000'}/>
                            )
                        })
                        }
                    </Picker>)
                }
                  
                </View>
            </View>

            <TouchableOpacity onPress={() => {
                if(icon == 'close-thick'){
                    props.removeParticipante(props.item);
                }
                
            }} disabled={!props.editar}>
            <MaterialCommunityIcons name={icon} color={color} size={30} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    cardParticipante: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '3%',
        width: '90%',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 26,
        marginTop: '3%',
        marginBottom: '3%',
        marginHorizontal: '5%'
    },
    containerProprietarioSwitch: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '90%'
    },
    textoParticipante: {
        color: 'black',
        fontSize: 18,
        width: '60%',
        maxWidth: '60%',
        flexWrap: 'wrap',
        textAlign: 'center'
    },

    xis: {
        color: 'red',
        fontSize: 20,
    },
    fotoPerfil: {
        borderRadius: 50,
        width: 60,
        height: 60
    },
    headerCardParticipante: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: "50%"
    },
    pickerComponente: {
      alignSelf: 'center',
      width: '100%',
      fontSize: 10,
      borderStyle: 'solid',
      borderColor: 'black',
      color: '#333333'
    },
    label: {
      textAlign: 'center',
      fontSize: 10,
      color: '#999999',
      width: '100%'
    }
});