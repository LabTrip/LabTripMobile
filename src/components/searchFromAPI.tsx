import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet, Text, FlatList } from 'react-native';

interface Lista {
    id: string,
    name: string
}

export default function SearchFromAPI(props) {
    const [termoBusca, onChangeTermoBusca] = useState(props.termoBusca || "");
    const [lista, setLista] = useState<Lista[]>([]);

    const insereNaLista = async (callback, texto) => {
        const novaLista = await callback(texto);
        setLista(novaLista);
    }

    const renderItem = ({ item }) => {
        console.log(item)
        console.log('********')
       return (<View style={styles.listItem}>
            <TouchableOpacity onPress={() => props.callbackSetLocal(item)} >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        </View>)
    }

    return (
        <View style={styles.barra}>
            <TextInput placeholder={props.texto} style={styles.input} value={termoBusca} 
                onChangeText={text => {
                    onChangeTermoBusca(text)
                    insereNaLista(props.callbackFunctionBusca, text)
                }} 
            />
            <FlatList
                style={{ flexGrow: 1, flex: 1, flexDirection: 'column'}}
                contentContainerStyle={{ alignItems: 'center' }}
                data={lista}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    barra: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        marginTop: '3%',
        width: '95%',
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        color: '#333333',
    },
    flatList: {
        width: '70%'
    },
    listItem: {
        marginVertical: 2,
        borderRadius: 20,
        backgroundColor: '#EBEBEB',
        borderStyle: 'solid',
        borderColor: '#E2E1E1',
        padding: 5,
        flexGrow: 1,
        width: 150,
        height: 150
    }
}
);