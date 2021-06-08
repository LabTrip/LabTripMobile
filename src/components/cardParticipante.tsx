import React, { useState } from 'react';
import { StyleSheet, Text, Image, View, Switch, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function CardParticipante(props) {
    let icon, color;
    const [isEnabled, setIsEnabled] = useState(props.proprietario);
    const [selectedValue, setSelectedValue] = useState(props.permissaoViagemId);
    const [permissoes, setPermissoes] = useState([
        {
            "id": 1,
            "descricao": "Proprietário"
        },
        {
            "id": 2,
            "descricao": "Membro"
        },
        {
            "id": 3,
            "descricao": "Agente"
        },
        {
            "id": 4,
            "descricao": "Gerente de agencia"
        }
    ]);

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
                <Text style={styles.label}>Tipo de usuário:</Text>
                    <Picker style={styles.pickerComponente}
                        prompt="Tipo de usuário"
                        mode="dropdown"

                        selectedValue={selectedValue}
                        onValueChange={(itemValue, value) => {
                        setSelectedValue(itemValue)
                        }}>
                        {
                        permissoes.map(p => {
                            return (
                            <Picker.Item key={p.id} label={p.descricao} value={p.id} />
                            )
                        })
                        }

                    </Picker>
                </View>
            </View>

            <TouchableOpacity onPress={props.onPress}>
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
      backgroundColor: '#F5F5F5',
      color: '#333333'
    },
    label: {
      textAlign: 'center',
      fontSize: 10,
      color: '#999999',
      width: '100%'
    }
});