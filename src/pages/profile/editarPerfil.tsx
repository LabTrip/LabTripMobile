import React, { useEffect, useState } from 'react';
import { Modal, ActivityIndicator, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, RefreshControl, Alert, Button, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { usePermissions } from 'expo-permissions';
import { TextInputMask } from 'react-native-masked-text'
import DateTimePicker from '@react-native-community/datetimepicker';
import mime from 'mime';
const moment = require('moment');
import i18n from '../../translate/i18n';


export default function EditarPerfil() {
    const [nome, onChangeTextNome] = useState("");
    const [email, onChangeTextEmail] = useState("");
    const [data, onChangeTextData] = useState(moment());
    const [telefone, onChangeTextTelefone] = useState("");
    const [idUsuario, setIdUsuario] = useState("");
    const [tokenUsuario, setTokenUsuario] = useState("");
    const [showLoader, setShowLoader] = React.useState(false);
    const [permission, askForPermission] = usePermissions(Permissions.MEDIA_LIBRARY, { ask: true });
    const [image, setImage] = useState('');

    /************************************************************* */

    const [date, setDate] = useState(new Date('1900-01-01T00:00:00.000Z'));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        console.log(currentDate)
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };


    /************************************************************* */

    const navigation = useNavigation();

    let token, userId;

    const atualizaFoto = async (file) => {
        const form = new FormData();
        form.append('file', file);

        const request = await fetch('https://labtrip-backend.herokuapp.com/usuarios/fotoperfil/' + idUsuario, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'x-access-token': tokenUsuario
            },
            body: form
        });

        return request;
    }

    /*request para ver foto de perfil*/
    const buscaFoto = async () => {
        return await fetch('https://labtrip-backend.herokuapp.com/usuarios/fotoperfil/' + userId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'image/jpeg',
                'x-access-token': token
            }
        });
    }


    const getUsuario = async () => {
        return await fetch('https://labtrip-backend.herokuapp.com/usuarios/' + userId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
    }

    const editaUsuario = async () => {
        return await fetch('https://labtrip-backend.herokuapp.com/usuarios/' + idUsuario, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': tokenUsuario
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                telefone: telefone.replace('(', '').replace(')', '').replace('-', ''),
                dataNascimento: date.toString()
            })
        });
    }

    const buscaPreencheUsuario = async () => {
        try {
            const value = await AsyncStorage.getItem('AUTH');
            const user = await AsyncStorage.getItem('USER_ID');
            if (value !== null) {
                token = JSON.parse(value)
            }
            if (user !== null) {

                userId = JSON.parse(user)
            }
            const response = await getUsuario();
            const json = await response.json();
            if (response.status == 200) {
                onChangeTextNome(json.nome);
                onChangeTextEmail(json.email);
                setDate(new Date(json.dataNascimento));
                onChangeTextTelefone(json.telefone);
            }
        }
        catch (e) {
            alert(e)
        }
    }

    const storeData = async (value, key) => {
        try {
            await AsyncStorage.setItem(key, value)
            return "ok";
        } catch (e) {
            // saving error
            return e
        }
    }

    useEffect(() => {
        const request = async () => {
            try {
                setShowLoader(true);
                const value = await AsyncStorage.getItem('AUTH');
                const user = await AsyncStorage.getItem('USER_ID');
                if (value !== null) {
                    token = JSON.parse(value)
                    console.log(token)
                    setTokenUsuario(JSON.parse(value))
                }
                if (user !== null) {
                    userId = JSON.parse(user)
                    setIdUsuario(JSON.parse(user))
                }
                const response = await getUsuario();
                const json = await response.json();
                const responseFoto = await buscaFoto();
                const blob = await responseFoto.blob();
                if (response.status == 200) {
                    onChangeTextNome(json.nome);
                    onChangeTextEmail(json.email);
                    setDate(new Date(json.dataNascimento));
                    onChangeTextTelefone(json.telefone);
                }
                if (responseFoto.status == 200) {
                    console.log("tipo: " + blob.type + ", tamanho: " + blob.size);
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        var base64data = reader.result?.toString() || "";
                        setImage(base64data)
                    }
                    console.log("o request retornou 200");
                    /*var objectURL = URL.createObjectURL(blob);
                    console.log(objectURL)*/
                }
            }
            catch (e) {
                alert(e)
            }
            finally {
                setShowLoader(false);
            }
        }
        request()
    }, [])

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        buscaPreencheUsuario();
        setRefreshing(false);
    }, []);

    const confirmaLogout = async () => {
        Alert.alert(
            i18n.t('editarUsuario.encerrarSessao'),
            i18n.t('editarUsuario.desejaMesmoSair'),
            [
                {
                    text: i18n.t('botoes.sim'),
                    onPress: async () => {
                        const responseAuth = await storeData('', 'AUTH')
                        const responseUserId = await storeData('', 'USER_ID')
                        if (responseAuth == 'ok' && responseUserId == 'ok') {
                            navigation.dispatch(
                                StackActions.replace('Login', {
                                })
                            )
                        }
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
            base64: false
        });
        if (!result.cancelled) {
            setImage(result.uri)
            let imageURI = "file:///" + result.uri.split("file:/").join("");
            const fileToUpload = {
                uri: imageURI,
                name: result.uri.split("/").pop(),
                type: mime.getType(imageURI)
            };
            atualizaFoto(fileToUpload);

        }
    };

    return (
        <View style={styles.container}>
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
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.conteudo}>
                    <TouchableOpacity onPress={() => {
                        /** COLOCAR AQUI CODIGO DA SELEÇÃO DE FOTO */
                        pickImage();
                    }}>
                        {
                            image !== ''
                                ? (<Image source={{ uri: image, }} style={styles.fotoPerfil} />)
                                : (<Image source={require('../../imgs/perfil.png')} style={styles.fotoPerfil} />)
                        }
                    </TouchableOpacity>
                    <TextInput placeholder={i18n.t('cadastroUsuarios.nome')} value={nome} style={styles.input}
                        onChangeText={text => onChangeTextNome(text)} />
                    <TextInput placeholder={"Email"} value={email} style={styles.input}
                        onChangeText={text => onChangeTextEmail(text)} />

                    <TouchableOpacity style={styles.containerDataCelular} onPress={showDatepicker}>
                        <TextInput placeholder={"DD/MM/YYYY"} style={styles.inputDate}
                            keyboardType="default" value={moment(date).format('DD/MM/yyyy')} autoCapitalize={'none'} editable={false} />
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                display="default"
                                onChange={onChange}
                            />
                        )}
                    </TouchableOpacity>

                    <TextInputMask
                        type={'cel-phone'}
                        options={{
                            maskType: 'BRL',
                            withDDD: true,
                            dddMask: '(99) '
                        }}
                        value={telefone}
                        style={styles.input}
                        onChangeText={text => {
                            onChangeTextTelefone(text)
                        }}
                    />
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('AlterarSenha', { userId: idUsuario, token: tokenUsuario })
                    }
                    }>
                        <Text style={styles.link}>
                        {i18n.t('botoes.alterarSenha')}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.containerBotoes}>
                        <TouchableOpacity style={styles.botaoSalvar} onPress={async () => {
                            setShowLoader(true);
                            let response = await editaUsuario();
                            if (response.status == 200) {
                                setShowLoader(false);
                                alert('Dados alterados com sucesso.')
                            }
                            else {
                                setShowLoader(false);
                                alert('Erro ao alterar dados.')
                            }
                            console.log(moment(data, "DD/MM/YYYY").format("YYYY-MM-DD"))
                        }}>
                            <Text style={styles.botaoSalvarTexto}>{i18n.t('botoes.salvar')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botaoSair} onPress={async () => {

                            await confirmaLogout();

                        }} >
                            <Text style={styles.botaoSalvarTexto}>{i18n.t('botoes.sairDaConta')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    conteudo: {
        alignItems: 'center',
    },
    containerBotoes: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    fotoPerfil: {
        width: 150,
        height: 150,
        marginTop: 20,
        borderRadius: 82,
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
    botaoSair: {
        backgroundColor: '#FF3333',
        width: '35%',
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    botaoSalvarTexto: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center'
    },
    link: {
        marginTop: '5%',
        textDecorationLine: 'underline',
        fontSize: 20,
    },
    containerDataCelular: {
        flexDirection: 'row',
    },
    inputDataCelular: {
        marginTop: 25,
        width: 266,
        height: 50,
        backgroundColor: '#fff',
        textAlign: 'center',
        justifyContent: 'space-around',
        fontWeight: 'bold',
        borderRadius: 32,
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
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
    },
    inputDate: {
        marginTop: '3%',
        width: '90%',
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        textAlign: 'center',
        color: '#333333'
    },
});