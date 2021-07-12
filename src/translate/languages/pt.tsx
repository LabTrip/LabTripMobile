const messages  = {
    pt: {
        translations: {
            login: {
                titulo: 'Olá!',
                saudacao: 'Seja bem vindo ao Labtrip.',
                senha: 'senha',
                redefinir: 'Esqueceu sua senha?',
                primeiroAcesso: 'Primeiro acesso?'
            },
            redefinirSenha:{
                titulo: 'Vamos redefinir sua senha.',
                inserirCodigo:'Insira o código recebido por e-mail.',
                inserirEmail: 'Insira o e-mail cadastrado.',
                InserirNovaSenha: 'Insira sua nova senha e a confirmação.',
                sucesso: 'A senha foi redefinida com sucesso .',
                erro: 'Erro ao alterar a senha.',
                erroCriterios: 'A senha deve conter ao menos sete caracteres e um número.',
                senha: 'senha',
                email: 'seuemail@email.com',
                redefinir: 'Esqueceu sua senha?',
                codigo: 'código',
                senhaAtual: 'Digite a senha atual',
                digiteSenha: 'Digite a nova senha',
                confirmeSenha: 'Confirme a nova senha',
            },
            botoes:{
                salvar: 'Salvar',
                cancelar: 'Cancelar',
                deletar:'Deletar',
                editar:'Editar',
                sim:'Sim',
                nao:'Não',
                entrar: 'Entrar',
                confirmar: 'Confirmar',
                redefinir: 'Redefinir',
                sairDaConta: 'Sair da conta',
                alterarSenha: 'Alterar senha',
                versionar: 'Versionar',
                criar: 'Criar'
            },
            modais:{
                aguarde: 'Aguarde...',
                loginInvalido: 'E-mail e/ou senha inválidos',
                emailInvalido: 'Email inválido',
                codigoInvalido: 'Código inválido',
            },
            adicionarAtividadeRoteiro: {
                atividade: 'Atividade',
                custo: 'Custo',
                dataInicio: 'Data de início',
                dataFim: 'Data fim',
                observacoes: 'Observações',
                adicionar: 'adicionar',
                sucessoAlterar: 'atividade alterada com sucesso.',
                erroAlterar: 'Erro ao atualizar atividade. ',
                sucessoAdicionar: 'Atividade adicionada com sucesso.',
                erroAdicionar: 'Erro ao adicionar atividade. ',
                pesquisarAtividades: 'Pesquisar atividades'
            },
            listaViagens: {
                pequisarViagem: 'Pesquisar viagem...',
            },
            listaPropostaDeRoteiro: {
                propostasRoteiro: 'Propostas de roteiro',
                esconderRoteiros: 'Esconder roteiro reprovados'
            },
            editarOrcamentoPlanejado: {
                orcamentoGeral: 'Orçamento geral',
                orcamentoGeralDesc: '*O orçamento geral terá no mínimo o valor da soma de todas atividades já agendadas.',
                sucesso: "Orçamento atualizado com sucesso.",
                erro: "Erro ao atualizar orçamento.",
            },
            editarDespesaAdicional: {
                descricao: 'Descrição',
                sucesso: "Despesa adicional alterada com sucesso.",
                erro: "Erro ao atualizar despesa extra.",
            },
            detalhesParticipantes: {
                sucessoRemover: 'Participante removido com sucesso.',
                erroRemover: 'Erro ao remover participante.',
                sucessoSalvar: 'Participantes salvos com sucesso.',
                erroSalvar: 'Erro ao salvar participantes.',
                removerParticipante: 'Remover participante',
                desejaRemover: 'Deseja mesmo remover o participante?',
                salvarParticipantes: 'Salvar participantes'
            },
            detalhesOrcamento: {
                erroBuscarDetalhes: 'Erro ao buscar detalhes da viagem. ',
                erroCriarOrcamento: 'Erro ao criar orçamento. ',
                ativarOrcamento: 'Ativar orçamento',
                despesasAdicionais: 'Despesas adicionais'
            },
            status: {
                planejamento: 'Planejamento',
                planejado: 'Planejado',
                emAndamento: 'Em andamento',
                concluido: 'Concluído',
                cancelado: 'Cancelado',
                aprovado: 'Aprovado',
                reprovado: 'Reprovado'
            },
            detalhesAtividade: {
                erroCapturarDetalhes: 'Erro ao ao capturar informações no dispositivo, feche o app e tente novamente.',
                sucessoExcluir: 'atividade removida com sucesso.',
                erroExcluir: 'Erro ao remover atividade.',
                excluirAtividade: 'Remover atividade',
                desejaRemover: 'Deseja mesmo remover a atividade?',
                sucessoSalvarArquivo: 'Arquivo salvo com sucesso.',
                erroSalvarArquivo: 'Erro ao salvar arquivo: '
            },
            convidarParticipante: {
                sucessoConvite: 'Convite enviado com sucesso.',
                erroConvite: 'Erro ao enviar convite.',
                emailConvidado: 'Email do convidado',
                permissaoUsuario: 'Permissão do convidado:',
                convidar: 'Convidar',
                message: 'Digite o email do participante que deseja inserir na viagem.'
            },
            adicionarDespesa: {
                sucessoAdicionar: 'Despesa adicional criada com sucesso.',
                erroAdicionar: 'Erro ao criar despesa adicional: ',
                descricao: 'Descrição',
                valorDespesa: 'Valor da despesa'
            },
            editarViagem: {
                sucessoSalvar: 'Viagem salva com sucesso.',
                erroSalvar: 'Erro ao salvar viagem.',
                nomeViagem: 'Nomw da viagem',
                salvarViagem: 'Salvar viagem',
                adicionarProprietarioLabel: 'Adicionar proprietário da viagem',
                adicionarProprietario: 'A viagem deve ter um proprietário.',
                buscarNovamente: 'Nenhum usuário encontrado. Digite o e-mail completo.',
                digiteEmailCompleto: 'Insira o e-mail completo.',
                dataInicio: 'Data de início',
                dataFim: 'Data fim',
                deveTerApelido: 'A vaigem deve ter um nome.'
            },
            editarUsuario: {
                sucessoSalvar: 'Usuário salvo com sucesso.',
                erroSalvar: 'Erro ao salvar usuário.',
                nomeUsuario: 'Nome do usuário',
                emailUsuario: 'E-mail do usuário',
                dataNascimentoUsuario: 'Data de nascimento',
                celularUsuario: 'Celular',
                tipoUsuario: 'Perfil de usuário',
                encerrarSessao: 'Encerrar sessão',
                desejaMesmoSair: 'Deseja mesmo encerrar a sessão?'
            },
            editarRoteiro: {
                sucessoAlterar: 'Roteiro atualizado com sucesso.',
                erroAlterar: 'Erro ao atualizar roteiro.',
                sucessoVersionar: 'Roteiro versionado com sucesso.',
                erroVersionar: 'Erro  ao versionar roteiro: ',
                sucessoExcluir: 'Roteiro removido com sucesso.',
                erroExcluir: 'Erro ao removar roteiro: '
            },
            editarAgencia: {
                nomeAgencia: 'Nome da agencia',
                addFuncionario: 'Adicionar funcionários',
                erroBuscarUsuario: 'Erro ao buscar usuários.',
                usuarioJaAdicionado: 'O usuário já foi adicionado',
                erroSalvar: 'Erro ao salvar detalhes da agencia.',
                sucessoFuncionario: 'funcionário convidados com sucesso.',
                erroFuncionario: 'Erro ao convidar funcionários.',
                sucesso: 'Agencia salva com sucesso.'
            },
            criarUsuario: {
                preencherTodosCampos: 'Você precisa preencher todos os capos para criar um usuário.',
                nome: 'Nome',
                email: 'E-mail',
                dataNascimento: 'Data de nascimento',
                perfilUsuario: 'Perfil do usuário',
                sucesso: 'Usuário criado com sucesso.',
                jaExiste: 'Já existe um usuário usando este e-mail.',
                erro: 'Erro ao salvar usuário.'
            },
            criarAtividadeCallback: {
                sucesso: 'Atividade criada com sucesso.',
                erro: 'Erro ao criar atividade: ',
                erroLocal: 'Erro ao buscar locais: ',
                descricaoAtividade: 'Descrição da atividade',
                local: 'Local',
                deveTerDescricao: 'A atividade deve ter uma descrição'
            },
            cadastroUsuarios: {
                nome: 'Nome',
                email: 'E-mail',
                perfil: 'Perfil'
            },
            cadastroAgencias: {
                agencia: 'Agencia',
                status: 'Status'
            },
            chat: {
                digiteAqui: 'Digite algo...'
            }
            

        }
    }
}

export{messages}