import React, { useState } from 'react';
import { FlatList, Linking, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CardAtividade from '../../components/cardAtividade';
import ScrollViewFlat from '../../components/scrollViewFlat';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DetalhesRoteiro({ route }) {
    const [selectedValue, setSelectedValue] = useState();
    const viagem = route.params.viagem;

    let atividades = [
        {
            id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
            nome: "Visita ao IFSP",
            local: "R. Pedro Vicente, 625 - Canindé, São Paulo - SP, 01109-010",
            horario: "18:50",
        },
        {
            id: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
            nome: "Café da Torre Eiffel",
            local: "Paris, França",
            horario: "20:00",
        },
        {
            id: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
            nome: "Visita ao Louvre",
            local: "Paris, França",
            horario: "22:00",
        },
    ];

    return (
        <View style={styles.conteudo}>
            <View style={styles.containerTop}>
                <Text style={styles.texto}>Data</Text>
                <Picker
                    prompt="Data"
                    selectedValue={selectedValue}
                    style={{ height: 48, width: 150 }}
                    onValueChange={(itemValue) => {
                        setSelectedValue(itemValue);
                    }}
                >
                    <Picker.Item label="21/01/2021" value="21/01/2021" />
                    <Picker.Item label="22/01/2021" value="22/01/2021" />

                </Picker>
                <TouchableOpacity style={styles.botaoIconeTop} onPress={() => Linking.openURL('https://dl.dropbox.com/s/0skuwdlhg6q4fol/History%20of%20GIF.gif?dl=1')}>
                    <MaterialCommunityIcons name={'file-download'} color={'#575757'} size={30} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoIconeTop} onPress={() => alert('clicou no chat')}>
                    <MaterialCommunityIcons name={'chat-processing'} color={'#575757'} size={30} />
                </TouchableOpacity>
            </View>
            <ScrollViewFlat>
                <FlatList
                    data={atividades}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CardAtividade nome={item.nome} local={item.local} horario={item.horario} item={item} viagem={viagem} data={selectedValue} />
                    )}
                />
            </ScrollViewFlat>
        </View>
    );
}

const styles = StyleSheet.create({
    conteudo: {
        flex: 1,
        backgroundColor: '#fff'
    },
    containerTop: {
        marginTop: '3%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    texto: {
        color: '#999999',
        fontSize: 18,
    },
    botaoIconeTop: {
        marginLeft: '5%'
    }
});
