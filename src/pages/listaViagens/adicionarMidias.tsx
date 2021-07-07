import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList, RefreshControl } from 'react-native';
import BotaoMais from '../../components/botaoMais';
import * as DocumentPicker from 'expo-document-picker';
import { createIconSetFromFontello, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mime from 'mime';

interface DadoEssencial {
    id: number,
    usuarioId: string,
    roteiroAtividadeId: number,
    nomeArquivo: string,
    chaveArquivo: string,
    urlArquivo: string,
    dataUpload: string,
    privado: boolean
}

export default function AdicionarMidias({ route }) {
    const [arquivos, setArquivos] = useState<DadoEssencial[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const abortController = new AbortController();
    let token, userId;

    const getDadosEssenciais = async () => {
        return await fetch('https://labtrip-backend.herokuapp.com/dadosEssenciais/roteiroAtividade/' + route.params.atividade.id, {
            signal: abortController.signal,
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
    }

    const salvaArquivo = async (arquivo) => {
        const value = await AsyncStorage.getItem('AUTH');
        const user = await AsyncStorage.getItem('USER_ID');
        if (value !== null && user !== null) {
            token = JSON.parse(value)
            userId = JSON.parse(user)
        }

        const response = await fetch('https://labtrip-backend.herokuapp.com/dadosEssenciais/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                usuarioId: userId,
                roteiroAtividadeId: route.params.atividade.id,
                nomeArquivo: arquivo.name,
                chaveArquivo: null,
                urlArquivo: null,
                privado: false
            })
        });
        const json = await response.json();
        console.log(token)
        console.log('status da primeira requestAddDadoEssencial: ' + response.status);
        if (response.status == 201) {
            const form = new FormData();
            form.append('file', arquivo);
            const responseArquivo = await fetch('https://labtrip-backend.herokuapp.com/dadosEssenciais/arquivoDadosEssenciais/' + json.id, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': token
                },
                body: form
            });
            console.log('id do dado essencial: ' + json.id);
            console.log('token do segundo request: ' + token)
            console.log('status da segunda requestAddAquivo: ' + responseArquivo.status)
            const jsonArquivo = await responseArquivo.json()
            alert(jsonArquivo.mensagem)
        }
    }

    const UploadFile = async () => {
        let result = await DocumentPicker.getDocumentAsync({
        });
        if (result.type == "cancel") {
            alert('cancelou mano :(')
        }
        else {
            const fileToUpload = {
                uri: result.uri,
                name: result.name,
                type: mime.getType(result.uri)
            };
            salvaArquivo(fileToUpload);
        }
    }

    const requestListarArquivos = async () => {
        try {
            const value = await AsyncStorage.getItem('AUTH');
            const user = await AsyncStorage.getItem('USER_ID');
            if (value != null && user !== null) {
                token = JSON.parse(value)
                userId = JSON.parse(user)
                const response = await getDadosEssenciais();
                const json = await response.json();
                if (response.status == 200) {
                    //filtrando para lista apenas viagens que estejam com o status diferente de 2 - Em planejamento.
                    setArquivos(json);
                }
            }
        }
        catch (e) {
            alert(e)
        }
    }

    useEffect(() => {
        requestListarArquivos();
        return function cleanup() {
            abortController.abort();
        }
    }, [refreshing]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        requestListarArquivos();
        setRefreshing(false);
    }, [refreshing]);
    return (
        <View style={styles.conteudo}>
            <BotaoMais onPress={UploadFile} />
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                <View style={styles.containerDetalhes}>
                    {arquivos?.map((item) => {
                        return (
                            <TouchableOpacity key={item.id} style={styles.conteudoCard} onPress={() => alert('baixou o arquivo: ' + item.nomeArquivo + ', id: ' + item.id)}>
                                <Text style={styles.textoCard}>{item.nomeArquivo}</Text>
                                <MaterialCommunityIcons name="file-download" color={'black'} size={80} />
                                <TouchableOpacity onPress={() => alert('excluiu')}>
                                    <MaterialCommunityIcons name="close-thick" color={'red'} size={40} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    conteudo: {
        flex: 1,
        backgroundColor: '#fff',
        //justifyContent: 'center',
        alignItems: 'center',
    },
    containerDetalhes: {
        marginTop: '3%',
        marginBottom: '3%',
        backgroundColor: '#F2F2F2',
        width: '96%',
        borderRadius: 7,
        flexDirection: 'row',
        height: '100%',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    conteudoCard: {
        margin: '3%',
        width: '90%',
        minHeight: 100,
        backgroundColor: '#bdbdbd',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 20
    },
    textoCard:{
        maxWidth:'40%'
    }
});
