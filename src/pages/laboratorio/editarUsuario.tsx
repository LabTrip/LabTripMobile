import React, { useEffect, useState } from 'react';
import { Modal, ActivityIndicator, Text, View, StyleSheet, TextInput, TouchableOpacity, Image, Platform, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardAgente from '../../components/cardAgente'
import ScrollViewFlat from '../../components/scrollViewFlat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotaoLupa from '../../components/botaoLupa'
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-datepicker'
const moment = require('moment');
import { TextInputMask } from 'react-native-masked-text'
import DateTimePicker from '@react-native-community/datetimepicker';
import i18n from '../../translate/i18n';


interface Usuario {
  id: string,
  nome: string,
  email: string
}

interface Funcionario {
  id: string,
  nome: string,
  email: string
}

interface Perfil {
  descricao: string,
  id: string
}

interface usuario {
  id: string,
  nome: string,
  email: string
}

export default function EditarUsuario({ route }) {
  const { usuario } = route.params;
  const navigation = useNavigation();
  const [tokken, setTokken] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState(usuario.nome);
  let token;
  const [perfil, setPerfis] = useState<Perfil[]>([]);
  const [selectedValue, setSelectedValue] = useState(usuario.perfilId);
  const [email, onChangeTextEmail] = useState(usuario.email);
  const [telefone, onChangeTextTelefone] = useState(usuario.telefone);
  const [showLoader, setShowLoader] = React.useState(false);
  const [dataNasc, setDataNasc] = useState(usuario.dataNascimento)


  /************************************************************* */

  const [date, setDate] = useState(new Date(usuario.dataNascimento));
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

  const showTimepicker = () => {
    showMode('time');
  };


  /************************************************************* */

  const editaUsuario = async (corpo) => {
    return await fetch('https://labtrip-backend.herokuapp.com/usuarios/' + usuario.id, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': tokken
      },
      body: JSON.stringify(corpo)
    });
  }

  const buscaUsuario = async (email) => {
    return await fetch('https://labtrip-backend.herokuapp.com/usuarios/email/' + email, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token.toString()
      }
    });
  }


  const getPerfis = async () => {
    return await fetch('https://labtrip-backend.herokuapp.com/perfis/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    });
  }

  useEffect(() => {
    const request = async () => {
      try {
        setShowLoader(true);
        const value = await AsyncStorage.getItem('AUTH');
        if (value != null) {
          setTokken(JSON.parse(value))
          token = JSON.parse(value)
          const response = await getPerfis();
          const json = await response.json();
          if (response.status == 200) {
            setPerfis(json.perfis);
          }

        }
        const response = await buscaUsuario(usuario.email)
        const json = await response.json();
        if (response.status == 200) {
          console.log(json)
          setNomeUsuario(json[0].nome);
          onChangeTextEmail(json[0].email);
          setDataNasc(moment(json[0].dataNascimento).add(1, 'days').format('DD/MM/yyyy'));
          onChangeTextTelefone(json[0].telefone);
        }
      }
      catch (e) {
        console.log(e)
      }
      finally {
        setShowLoader(false);
      }
    }
    request()
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
        <Text style={styles.label}>{i18n.t('editarUsuario.nomeUsuario')}</Text>
          <TextInput placeholder={i18n.t('editarUsuario.nomeUsuario')} style={styles.input}
            onChangeText={texto => setNomeUsuario(texto)} value={nomeUsuario} />
          <Text style={styles.label}>{i18n.t('editarUsuario.emailUsuario')}</Text>
          <TextInput placeholder={i18n.t('editarUsuario.emailUsuario')} style={styles.input}
            keyboardType="email-address"
            onChangeText={text => onChangeTextEmail(text.trim())} value={email} autoCapitalize={'none'} />
          <Text style={styles.label}>{i18n.t('editarUsuario.dataNascimentoUsuario')}</Text>

          <TouchableOpacity style={styles.containerDataCelular} onPress={showDatepicker}>
            <TextInput placeholder={"DD/MM/YYYY"} style={styles.inputDate}
            keyboardType="default" value={moment(date).format('DD/MM/yyyy')} autoCapitalize={'none'} editable={false}/>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                display="default"
                onChange={onChange}
              />
            )}
          </TouchableOpacity>

          <Text style={styles.label}>{i18n.t('editarUsuario.celularUsuario')}</Text>
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
          <Text style={styles.label}>{i18n.t('editarUsuario.tipoUsuario')}</Text>
          <Picker style={styles.pickerComponente}
            prompt="Tipo de usuário"
            mode="dropdown"

            selectedValue={selectedValue}
            onValueChange={(itemValue, value) => {
              setSelectedValue(itemValue)
            }}>
            {
              perfil.map(p => {
                return (
                  <Picker.Item key={p.id} label={p.descricao} value={p.id} />
                )
              })
            }

          </Picker>
          <TouchableOpacity style={styles.botaoSalvar} onPress={async () => {
            try {
              setShowLoader(true);
              let response = await editaUsuario({
                nome: nomeUsuario,
                email: email,
                dataNascimento: date,
                telefone: telefone.replace('(','').replace(')','').replace('-',''),
                perfilId: selectedValue
              });
              let json = await response.json();
              if (response.status >= 200 && response.status <= 299) {
                alert('Dados do usuário alterados com sucesso!')
                navigation.goBack();
              }
              else {
                alert(json.mensagem);
              }
            }
            catch (e) {
              alert("Erro ao editar usuário.");
            }
            finally {
              setShowLoader(false);
            }
          }}>
            <Text style={styles.botaoSalvarTexto}>{i18n.t('botoes.salvar')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: '3%',
    marginHorizontal: '2%',
    textAlign: 'center',
    fontSize: 18,
    color: '#999999',
    width: '45%'
  },
  input: {
    marginTop: '3%',
    width: '95%',
    padding: 15,
    fontSize: 16,
    borderRadius: 41,
    backgroundColor: '#EBEBEB',
    color: '#333333'
  },
  inputDate: {
    marginTop: '3%',
    width: '95%',
    padding: 15,
    fontSize: 16,
    borderRadius: 41,
    backgroundColor: '#EBEBEB',
    textAlign: 'center',
    color: '#333333'
  },
  inputDataCelular: {
    marginTop: '3%',
    marginHorizontal: '2%',
    padding: 15,
    fontSize: 16,
    borderRadius: 41,
    backgroundColor: '#EBEBEB',
    color: '#333333',
    width: '95%'
  },
  pickerComponente: {
    marginTop: '3%',
    width: '95%',
    padding: 15,
    fontSize: 16,
    borderRadius: 41,
    backgroundColor: '#EBEBEB',
    color: '#333333'
  },
  botaoSalvar: {
    backgroundColor: '#3385FF',
    flex: 1,
    padding: 10,
    borderRadius: 40,
    marginTop: '5%',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center'
  },
  botaoDeletar: {
    backgroundColor: '#f64535',
    flex: 1,
    padding: 10,
    borderRadius: 40,
    marginTop: '5%',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center'
  },
  botaoSalvarTexto: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 24
  },
  botaoDeletarTexto: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 24
  },
  cardParticipante: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '3%',
    width: '95%',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 26,
    marginTop: '3%',
    marginBottom: '3%',
  },
  textoParticipante: {
    color: 'black',
    fontSize: 18,
    width: '60%',
    maxWidth: '60%',
    flexWrap: 'wrap',
    textAlign: 'center'
  },
  headerCardParticipante: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  fotoPerfil: {
    borderRadius: 50,
    width: 60,
    height: 60
  },
  containerDataCelular: {
    flexDirection: 'row',
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
});