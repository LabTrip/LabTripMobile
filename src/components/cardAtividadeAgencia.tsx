import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import i18n from '../translate/i18n';

export default function CardAtividadeAgencia(props) {
    const moment = require('moment');
    const navigation = useNavigation();

    
    return (
        <TouchableOpacity style={styles.cardRoteiro} onPress={() => navigation.navigate('DetalhesAtividade', { atividade: props.atividade, planejamento: true, moeda: props.moeda})}>
            <Text style={styles.textoTitulo}>{props.atividade.descricao} </Text>
            <View style={styles.detalhes}>
                <Text style={styles.textoDetalhes}>{i18n.t('cardAtividadeAgencia.local')}: {props.atividade.endereco}{"\n"}{i18n.t('cardAtividadeAgencia.horario')}: { i18n.locale == 'pt-BR' ? moment(props.atividade.dataInicio).local().format('HH:mm') : moment(props.atividade.dataInicio).local().format('hh:mm A')}</Text>
                {/*<TouchableOpacity>
                    <MaterialCommunityIcons name="heart" color={'#FF2424'} size={29} />
                    <Text>1</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="close-thick" color={'black'} size={29} />
                    <Text>1</Text>
                </TouchableOpacity>*/}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardRoteiro: {
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        marginTop: '3%',
        width: '100%',
        padding: 5,
        borderRadius: 10
    },
    textoTitulo: {
        fontWeight: '300',
        fontSize: 18,
        color: '#999999',
        marginLeft: 15,
        width: '80%',
        flexWrap: 'wrap',
    },
    textoDetalhes: {
        fontSize: 16,
        color: '#999999',
        marginLeft: 0,
        width: '80%',
        flexWrap: 'wrap',
    },
    detalhes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
});