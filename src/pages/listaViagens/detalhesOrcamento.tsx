import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import BotaoMais from '../../components/botaoMais';
import CardOrcamento from '../../components/cardOrcamento';
import CardDespesasAdicionais from '../../components/cardDespesaAdicional';
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function DetalhesOrcamento({ route }) {
    const navigation = useNavigation();
    const rota = route.name;
    let botaoChat;
    if (rota == 'Geral' || rota == 'Orçamento') {
        botaoChat = <TouchableOpacity style={{ marginTop: '4%' }} onPress={() => alert('clicou na messagem')}>
            <MaterialCommunityIcons name={'chat-processing'} color={'#575757'} size={42} />
        </TouchableOpacity>;
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerTop}>
                <BotaoMais onPress={() =>
                    navigation.navigate('AdicionarDespesa')} />
                {botaoChat}
            </View>
            <CardOrcamento planejado={30000} saldoAtual={10000} />

            <Text style={styles.label}>Despesas adicionais: </Text>
            <CardDespesasAdicionais data={'12/03/2021'} descricao={'Dogão na praça'} valor={458} />

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        textAlign: 'left',
    },
    label: {
        fontSize: 18,
        color: '#999999',
        marginTop: '5%',
        marginBottom: '1%',
    },
    cardOrcamento: {
        height: 100,
        width: '90%',
        backgroundColor: '#F2F2F2',
        borderRadius: 7,
    },
    containerTop: {
        flexDirection: 'row',

    }
})
