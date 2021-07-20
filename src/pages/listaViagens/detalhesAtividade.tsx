import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ActivityIndicator, FlatList, ScrollView, RefreshControl } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardDadoEssencial from '../../components/cardDadoEssencial';
import * as DocumentPicker from 'expo-document-picker';
import mime from 'mime';
import i18n from '../../translate/i18n';

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

export default function DetalhesAtividade({ route }) {
    const moment = require('moment');
    const [atividade, setAtividade] = useState(route.params.atividade);
    const [gostei, setGostei] = useState(parseInt(route.params.atividade.votoPositivo) || 0);
    const [naoGostei, setNaoGostei] = useState(parseInt(route.params.atividade.votoNegativo) || 0);
    const [gostou, setGostou] = useState(Boolean);
    const [showLoader, setShowLoader] = React.useState(false);
    const [dadosEssenciais, setDadosEssenciais] = useState<DadoEssencial[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [valorFormatado, setValorFormatado] = useState(route.params.atividade.custo.toFixed(2));
    const [idPermissao, setIdPermissao] = useState(4);
    const navigation = useNavigation();
    let token, userId, status, corDoStatus;

    const getUsuario = async (idUsuario, token) => {
        return await fetch('https://labtrip-backend.herokuapp.com/usuarios/' + idUsuario, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
    }

    const getIdPermissao = async () => {
        const token = await AsyncStorage.getItem('AUTH') || "";
        const idUsuario = await AsyncStorage.getItem('USER_ID') || "";
        const response = await getUsuario(JSON.parse(idUsuario), JSON.parse(token));
        const json = await response.json();
        setIdPermissao(json.perfilId);
    }

    switch (route.params.atividade.statusId) {
        case 1:
            status = i18n.t('status.planejamento');
            corDoStatus = '#B7AF0B'
            break;
        case 2:
            status = i18n.t('status.planejado');
            corDoStatus = '#B7AF0B'
            break;
        case 3:
            status = i18n.t('status.emAndamento');
            corDoStatus = '#00AEFF';
            break;
        case 5:
            status = i18n.t('status.concluido');
            corDoStatus = '#0FD06F';
            break;
        default:
            status = i18n.t('status.cancelado')
            corDoStatus = '#333333';
            break;
    }

    const getAtividade = async () => {
        try {
            let localToken = await retornaToken() || '';

            const response = await fetch('https://labtrip-backend.herokuapp.com/roteiroAtividades/' + atividade.id, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localToken
                }
            });

            if (response.status == 200) {
                const json = await response.json();
                console.log(json)
                setGostei(json.votoPositivo || 0);
                setNaoGostei(json.votoNegativo || 0);
                setValorFormatado(json.custo.toFixed(2));
                setAtividade(json);
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const getDadosEssenciais = async () => {
        try {
            let localToken = await retornaToken() || '';

            const response = await fetch('https://labtrip-backend.herokuapp.com/dadosEssenciais/roteiroAtividade/' + atividade.id, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localToken
                }
            });

            if (response.status == 200) {
                const json = await response.json();
                setDadosEssenciais(json);
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
            localToken = JSON.parse(localToken)
        }
        return localToken;
    }

    const votaAtividade = async (gostou) => {
        let localToken = await retornaToken() || '';

        return await fetch('https://labtrip-backend.herokuapp.com/votacoes', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            },
            body: JSON.stringify({
                roteiroAtividadeId: route.params.atividade.id,
                usuarioId: userId,
                gostou: gostou
            })
        });
    }

    const atualizaAtividade = async (gostou) => {
        return await fetch('https://labtrip-backend.herokuapp.com/votacoes/' + route.params.atividade.id + '/' + userId, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                roteiroAtividadeId: route.params.atividade.id,
                usuarioId: userId,
                gostou: gostou
            })
        });
    }

    const votar = async (gostou) => {
        try {
            let value = await AsyncStorage.getItem('AUTH');
            let user = await AsyncStorage.getItem('USER_ID');
            if (value !== null && user !== null) {
                token = JSON.parse(value)
                userId = JSON.parse(user)
                const response = await votaAtividade(gostou);
                if (response.status == 201) {
                    if (gostou == true) {
                        setGostei(gostei + 1);
                    }
                    else {
                        setNaoGostei(naoGostei + 1);
                    }
                } else if (response.status == 204) {
                    if (gostou == true) {
                        setGostei(gostei - 1);
                    }
                    else {
                        setNaoGostei(naoGostei - 1);
                    }
                }
                else {
                    const json = await response.json()
                    alert(json.mensagem)
                }
            }
            else {
                alert(i18n.t('detalhesAtividade.erroCapturarDetalhes'))
            }
        } catch (e) {
            alert(e)
        }
    }

    const excluiAtividade = async () => {
        try {
            setShowLoader(true);
            let localToken = await retornaToken() || '';
            const response = await fetch('https://labtrip-backend.herokuapp.com/roteiroAtividades/' + atividade.id, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localToken
                }
            });

            const json = await response.json();
            if (response.status == 200) {
                alert(i18n.t('detalhesAtividade.sucessoExcluir'));
                navigation.goBack()
            }
            else {
                alert(i18n.t('detalhesAtividade.erroExcluir'));
            }
        }
        catch (e) {
            console.log(e)
            alert(i18n.t('detalhesAtividade.erroExcluir'));
        }
        finally {
            setShowLoader(false);
        }
    }

    const confirmaExcluir = async () => {
        try {
            Alert.alert(
                i18n.t('detalhesAtividade.excluirAtividade'),
                i18n.t('detalhesAtividade.desejaRemover'),
                [
                    {
                        text: i18n.t('botoes.sim'),
                        onPress: async () => {
                            excluiAtividade();
                        }
                    },
                    {
                        text: i18n.t('botoes.nao'),
                        onPress: () => {

                        }
                    }
                ]
            )
        }
        catch (e) {
            alert(i18n.t('detalhesAtividade.erroExcluir'))
        }
    }

    const request = async () => {
        try {
            setShowLoader(true)
            await getAtividade();
            await getDadosEssenciais();
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setShowLoader(false);
        }
    }

    useEffect(() => {
        getIdPermissao();
        request();
    }, []);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await request()
        setRefreshing(false)
    }, [refreshing]);

    const salvaArquivo = async (arquivo) => {
        try {
            let localToken = await retornaToken() || '';

            const user = await AsyncStorage.getItem('USER_ID');
            if (user !== null) {
                userId = JSON.parse(user)
            }

            const response = await fetch('https://labtrip-backend.herokuapp.com/dadosEssenciais/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localToken
                },
                body: JSON.stringify({
                    usuarioId: userId,
                    roteiroAtividadeId: atividade.id,
                    nomeArquivo: arquivo.name,
                    chaveArquivo: null,
                    urlArquivo: null,
                    privado: false
                })
            });
            const json = await response.json();
            if (response.status == 201) {
                const form = new FormData();
                form.append('file', arquivo);
                const responseArquivo = await fetch('https://labtrip-backend.herokuapp.com/dadosEssenciais/arquivoDadosEssenciais/' + json.id, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                        'x-access-token': localToken
                    },
                    body: form
                });

                if (responseArquivo.status == 200) {
                    alert(i18n.t('detalhesAtividade.sucessoSalvarArquivo'));
                    onRefresh()
                }
                else {
                    const jsonArquivo = await responseArquivo.json()
                    alert(i18n.t('detalhesAtividade.erroSalvarArquivo') + jsonArquivo.mensagem)
                }
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const UploadFile = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({
            });
            if (result.type == "cancel") {
            }
            else {
                const fileToUpload = {
                    uri: result.uri,
                    name: result.name,
                    type: mime.getType(result.uri)
                };
                console.log(fileToUpload)
                setShowLoader(true)
                await salvaArquivo(fileToUpload);
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setShowLoader(false)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLoader}
                onRequestClose={() => {
                    setShowLoader(!showLoader)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ActivityIndicator style={styles.loader} animating={showLoader} size="large" color="#0FD06F" />
                        <Text style={styles.textStyle}>
                            {i18n.t('modais.aguarde')}
                        </Text>
                    </View>
                </View>

            </Modal>
            <ScrollView style={{ flexDirection: 'column' }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={{ alignItems: 'center', height: '100%' }}>
                    <View style={styles.containerDetalhes}>
                        <Text style={styles.tituloDetalhes}>{route.params.atividade.local}</Text>
                        <View style={styles.containerDataStatus}>
                            <Text style={styles.textoDetalhes}>{i18n.t('detalhesAtividade.dataInicio') + ' ' + moment(atividade.dataInicio).format('DD/MM/yyyy') + ' ' + moment(atividade.dataInicio).format('HH:mm')}</Text>
                        </View>
                        <View style={styles.containerDataStatus}>
                            <Text style={styles.textoDetalhes}>{i18n.t('detalhesAtividade.dataFim') + ' ' + moment(atividade.dataFim).format('DD/MM/yyyy') + ' ' + moment(atividade.dataFim).format('HH:mm')}</Text>
                        </View>
                        <Text style={styles.textoDetalhes}>{atividade.endereco}</Text>
                        <Text style={[styles.textoDetalhes, { color: corDoStatus }]}>{status}</Text>
                    </View>
                    {idPermissao != 4
                        ? <View style={styles.containerBotoes}>
                            <TouchableOpacity style={styles.botaoEditar} onPress={() => {
                                navigation.navigate('EditarAtividadeRoteiro', { atividade: atividade });
                            }}>
                                <Text style={styles.botaoTexto}>{i18n.t('botoes.editar')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botaoExcluir} onPress={async () => {
                                confirmaExcluir();
                            }} >
                                <Text style={styles.botaoTexto}>{i18n.t('botoes.deletar')}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                    }
                    <Text style={styles.tituloDetalhes}>{i18n.t('detalhesAtividade.custo')}: R$ {valorFormatado}</Text>
                    {route.params.planejamento == true && (
                        <View style={styles.containerVotos}>
                            <TouchableOpacity style={styles.botaoVoto} onPress={() => {
                                setGostou(true)
                                votar(true);
                            }}>
                                <MaterialCommunityIcons name="heart" color={'#FF2424'} size={31} />
                                <Text>{gostei}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botaoVoto} onPress={() => {
                                setGostou(false)
                                votar(false);
                            }}>
                                <MaterialCommunityIcons name="close-thick" color={'#000000'} size={31} />
                                <Text>{naoGostei}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={[styles.containerDetalhes, { height: 200, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3%' }]}>
                        <View style={{ width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.tituloDetalhes}>
                                {i18n.t('detalhesAtividade.midias')}
                            </Text>
                            <TouchableOpacity onPress={() => UploadFile()}>
                                <AntDesign name="pluscircleo" size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', minHeight: 110 }}>
                            <ScrollView horizontal={true} style={{ flexDirection: 'row' }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', padding: 5 }}>
                                {
                                    dadosEssenciais.map((d) => {
                                        return (<CardDadoEssencial key={d.id.toString()}
                                            metaDados={d} refresh={onRefresh}
                                        />)
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>

                </View>

                <Text style={styles.textoDetalhes}>{moment(route.params.atividade.dataInicio).format('HH:mm')}</Text>
                <Text style={styles.textoDetalhes}>{route.params.atividade.endereco}</Text>
                <Text style={[styles.textoDetalhes, { color: corDoStatus }]}>{status}</Text>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    containerDetalhes: {
        marginTop: '3%',
        marginBottom: '3%',
        backgroundColor: '#F2F2F2',
        width: '96%',
        borderRadius: 7,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#E2E0E0'
    },
    containerDataStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerVotos: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '96%',
        margin: '3%'
    },
    textoStatus: {
        color: '#0FD06F',
        marginRight: '5%',
        fontSize: 15,
    },
    textoDetalhes: {
        marginLeft: '5%',
        color: '#999999',
        marginBottom: '3%',
        fontSize: 15,
        maxWidth: '90%',
        flexWrap: 'wrap'
    },
    tituloDetalhes: {
        textAlign: 'center',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '80%',
        color: '#999999',
        fontSize: 24,
        margin: 5
    },
    botaoVoto: {
        flexDirection: 'row',
    },
    containerBotoes: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    botaoEditar: {
        backgroundColor: '#3385FF',
        width: '35%',
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    botaoExcluir: {
        backgroundColor: '#FF3333',
        width: '35%',
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center'
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