import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { TextInputMask } from 'react-native-masked-text';


export default function EditarOrcamentoPlanejado({ route }) {
    const [orcPlanejado, setOrcPlanejado] = useState(route.params.orcamento.toString());
    const navigation = useNavigation();
    let valorUnmasked;
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Orçamento planejado*</Text>
            <TextInputMask
                type={'money'}
                options={{
                    maskType: 'INTERNATIONAL',

                }}
                value={orcPlanejado}
                style={styles.input}
                onChangeText={(orcPlanejado) => {
                    setOrcPlanejado(orcPlanejado);
                }}
                placeholder="Valor da despesa"
                ref={(ref) => valorUnmasked = ref}
            />
            <Text style={styles.texto}>*O orçamento planejado terá no mínimo o valor da soma de todas atividades já agendadas.</Text>
            <View style={styles.containerBotoes}>
                <TouchableOpacity style={styles.botaoSalvar} onPress={() => {

                }}>
                    <Text style={styles.textoBotao}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.goBack()}>
                    <Text style={styles.textoBotao}>Cancelar</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    containerBotoes: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    label: {
        fontSize: 18,
        color: '#999999',
        textAlign: 'center',
        marginTop: '10%'
    },
    texto: {
        width: '80%',
        flexWrap: 'wrap',
        marginTop: '3%',
        textAlign: 'center'
    },
    input: {
        marginTop: '5%',
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
        width: '35%',
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    botaoCancelar: {
        backgroundColor: '#FF3333',
        width: '35%',
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    textoBotao: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center'

    }
})