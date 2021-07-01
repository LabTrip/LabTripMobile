import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CardDespesaAdicional(props) {
    const [showLoaderDelete, setShowLoaderDelete] = React.useState(false);
    const [showLoader, setShowLoader] = React.useState(false);
    const navigation = useNavigation();

    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
          localToken = JSON.parse(localToken)
        }
        return localToken;
    }

    const deletaDespesa = async () => {
        let localToken = await retornaToken() || '';

        const response = await fetch('https://labtrip-backend.herokuapp.com/orcamentos/despesaExtra/' + props.id, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            }
        });

        const json = await response.json();
        if (response.status == 200) {
            alert('Despesa deletada com sucesso!');
        }
        else{
            alert('Não foi possível deletar despesa: ' + json.mensagem);
        }
    }

    return (
        <View style={styles.cardDespesaAdicional}>
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
                            Aguarde...
                    </Text>
                    </View>
                </View>

            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLoaderDelete}
                onRequestClose={() => {
                    setShowLoaderDelete(!showLoaderDelete)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.textStyle}>
                            Deseja mesmo excluir a despesa "{props.descricao}"
                        </Text>
                        <View style={styles.containerRow}>
                            <TouchableOpacity style={styles.botaoSim} onPress={async () => {
                                setShowLoaderDelete(false);
                                setShowLoader(true);
                                deletaDespesa();
                                setShowLoader(false);
                            }}>
                                <Text style={styles.botaoSalvarTexto}>Sim</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botaoNao} onPress={async () => {
                                
                                setShowLoaderDelete(false);
            
                            }} >
                                <Text style={styles.botaoSalvarTexto}>Não</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.containerRow}>
                <Text style={styles.texto}>{props.data}</Text>
                <TouchableOpacity disabled={!props.editar} onPress={() =>
                    navigation.navigate('EditarDespesaAdicional', 
                    { 
                        data: props.data,
                        descricao: props.descricao,
                        valor: props.valor.toFixed(2),
                        despesasExtras: props.item
                    })} >
                    <MaterialCommunityIcons name={'pencil'} color={'black'} size={25} />
                </TouchableOpacity>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.texto}>{props.descricao}</Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.texto}>Valor: R$ {props.valor.toFixed(2)}</Text>
                <TouchableOpacity disabled={!props.editar} onPress={() =>{
                    setShowLoaderDelete(true);
                }}>
                    <MaterialCommunityIcons name={'close-thick'} color={'black'} size={25} />
                </TouchableOpacity>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    cardDespesaAdicional: {
        width: '90%',
        backgroundColor: '#F2F2F2',
        borderRadius: 7,
        flexDirection: 'column',
        padding: '2%',
        marginVertical: '1%'
    },
    containerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '2%',
        marginRight: '2%',
    },
    texto: {
        fontSize: 18,
        color: '#999999',
        flexWrap: 'wrap',
        width: '90%'
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
    botaoSim: {
        backgroundColor: '#3385FF',
        width: '35%',
        flexGrow: 1,
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    botaoNao: {
        backgroundColor: '#FF3333',
        width: '35%',
        flexGrow: 1,
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
    }
})
