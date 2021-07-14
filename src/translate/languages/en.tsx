const messages = {
    en: {
        translations: {
            login: {
                titulo: 'Hello!',
                saudacao: 'Welcome to Labtrip.',
                senha: 'password',
                redefinir: 'Forgot your password?',
                primeiroAcesso: 'First access?'
            },
            redefinirSenha: {
                titulo: 'Let\'s reset your password',
                inserirCodigo: 'Enter the code which you received',
                inserirEmail: 'Enter your e-mail',
                InserirNovaSenha: 'Enter your new password and confirm it',
                sucesso: 'your password has been reset successfully',
                erro: 'Error updating password.',
                erroCriterios: 'The password must contain at least seven characters and one number.',
                senha: 'password',
                email: 'youremail@email.com',
                redefinir: 'I forgot my password',
                codigo: 'code',
                senhaAtual: 'Enter current password',
                digiteSenha: 'Enter the new password',
                confirmeSenha: 'Confirm the new password',
                aguarde: 'Wait...'
            },
            botoes: {
                salvar: 'Save',
                cancelar: 'Cancel',
                deletar: 'Delete',
                editar: 'Edit',
                sim: 'Yes',
                nao: 'No',
                entrar: 'Login',
                confirmar: 'Confirm',
                redefinir: 'Reset',
                sairDaConta: 'Logoff',
                alterarSenha: 'Update password',
                versionar: 'Version',
                criar: 'Create'
            },
            modais: {
                aguarde: 'Wait...',
                loginInvalido: 'Invalid email and/or password',
                emailInvalido: 'Invalid email',
                codigoInvalido: 'Incorrect code',
            },
            adicionarAtividadeRoteiro: {
                atividade: 'Activity',
                custo: 'Price',
                dataInicio: 'Start date',
                dataFim: 'End date',
                observacoes: 'Observations',
                adicionar: 'Add',
                sucessoAlterar: 'Activity updated sucessful.',
                erroAlterar: 'Error updating activity. ',
                sucessoAdicionar: 'Activity added sucessful.',
                erroAdicionar: 'Error adding activity. ',
                pesquisarAtividades: 'Search activities'
            },
            listaViagens: {
                pequisarViagem: 'Search travel...',
            },
            listaPropostaDeRoteiro: {
                propostasRoteiro: 'Itinerary options',
                esconderRoteiros: 'Hide disapproved itineraries'
            },
            editarOrcamentoPlanejado: {
                orcamentoGeral: 'Shared budget',
                orcamentoGeralDesc: '*The shared budget will have as a minimum value the sum of all activities in the itinerary.',
                sucesso: "Budget updated successful.",
                erro: "Error updating budget.",
            },
            editarDespesaAdicional: {
                descricao: 'Description',
                orcamentoGeral: 'Shared budget',
                orcamentoGeralDesc: '*The shared budget will have as a minimum value the sum of all activities in the itinerary.',
                sucesso: "Additional expense updated successful",
                erro: "Error updating additional expense.",
            },
            detalhesParticipantes: {
                sucessoRemover: 'Participant removed sucessful.',
                erroRemover: 'Error removing participant.',
                sucessoSalvar: 'Participants saved sucessful.',
                erroSalvar: 'Error saving participants.',
                removerParticipante: 'Remove participant',
                desejaRemover: 'Do you really want to remove the participant?',
                salvarParticipantes: 'Save participants'
            },
            detalhesOrcamento: {
                erroBuscarDetalhes: 'Error searching travel details. ',
                erroCriarOrcamento: 'Error creating budget. ',
                ativarOrcamento: 'Activate budget',
                despesasAdicionais: 'Additional expenses'
            },
            status: {
                planejamento: 'Planning',
                planejado: 'Planned',
                emAndamento: 'In progress',
                concluido: 'Concluded',
                cancelado: 'Canceled',
                aprovado: 'Approved',
                reprovado: 'Disapproved'
            },
            detalhesAtividade: {
                erroCapturarDetalhes: 'Error searching device infos. Please, close e open the app again.',
                sucessoExcluir: 'Activity removed sucessful.',
                erroExcluir: 'Error removing activity.',
                excluirAtividade: 'Remove activity',
                desejaRemover: 'Do you really want remove activity?',
                sucessoSalvarArquivo: 'File saved sucessful.',
                erroSalvarArquivo: 'Error saving file: ',
                dataInicio: 'Start date: ',
                dataFim: 'End date: ',
            },
            convidarParticipante: {
                sucessoConvite: 'Invite sent sucessful.',
                erroConvite: 'Error sending invite.',
                emailConvidado: 'Guest email',
                permissaoUsuario: 'Guest permission:',
                convidar: 'Invite',
                message: 'Insert the guest email to add to the travel.'
            },
            adicionarDespesa: {
                sucessoAdicionar: 'Additional expense created sucessful.',
                erroAdicionar: 'Error creating additional expense: ',
                descricao: 'Description',
                valorDespesa: 'Expense value'
            },
            editarViagem: {
                sucessoSalvar: 'Travel saved sucessful.',
                erroSalvar: 'Error saving travel.',
                nomeViagem: 'Travel name',
                salvarViagem: 'Save travel',
                adicionarProprietarioLabel: 'Add travel proprietary',
                adicionarProprietario: 'A travel proprietary is required.',
                buscarNovamente: 'No users found. Insert the full email',
                digiteEmailCompleto: 'Insert the full email',
                dataInicio: 'Start date',
                dataFim: 'End date',
                deveTerApelido: 'The travel must have a name.'
            },
            editarUsuario: {
                sucessoSalvar: 'User saved sucessful.',
                erroSalvar: 'Error saving user.',
                nomeUsuario: 'User name',
                emailUsuario: 'User email',
                dataNascimentoUsuario: 'User birth date',
                celularUsuario: 'Cell phone',
                tipoUsuario: 'User role',
                encerrarSessao: 'Logoff',
                desejaMesmoSair: 'Are you sure you want to logoff?'
            },
            editarRoteiro: {
                sucessoAlterar: 'Itinerary updated sucessful.',
                erroAlterar: 'Error updating itinerary.',
                sucessoVersionar: 'Itinerary versioned sucessful.',
                erroVersionar: 'Error versioning itinerary: ',
                sucessoExcluir: 'Itinerary removed sucessful.',
                erroExcluir: 'Error removing itinerary: '
            },
            editarAgencia: {
                nomeAgencia: 'Agency name',
                addFuncionario: 'Add employees',
                erroBuscarUsuario: 'Error searching users',
                usuarioJaAdicionado: 'User has already been added',
                erroSalvar: 'Error saving agency details.',
                sucessoFuncionario: 'Employees saved sucessful.',
                erroFuncionario: 'Error adding employees',
                sucesso: 'Agency saved sucessful.'
            },
            criarUsuario: {
                preencherTodosCampos: 'You must fill all the fields to create an user.',
                nome: 'Name',
                email: 'Email',
                dataNascimento: 'Birth date',
                perfilUsuario: 'User role',
                sucesso: 'User created sucessful.',
                jaExiste: 'An user is already using this email.',
                erro: 'Error saving user.'
            },
            criarRoteiro: {
                sucesso: 'Itinerary created sucessful.',
                erro: 'Error creating itinerary.',
                criacaoRoteiro: 'Create itinerary proposal',
                descricaoRoteiro: 'Itinerary description',
                deveTerDescricao: 'An itinerary must have a description.'
            },
            criarAtividadeCallback: {
                sucesso: 'Activity created sucessful.',
                erro: 'Error creating activity: ',
                erroLocal: 'Error searching places: ',
                descricaoAtividade: 'Activity description',
                local: 'Place',
                deveTerDescricao: 'The activity must have description'
            },
            cadastroUsuarios: {
                nome: 'Name',
                email: 'Email',
                perfil: 'Role'
            },
            cadastroAgencias: {
                agencia: 'Agency',
                status: 'Status'
            },
            chat: {
                digiteAqui: 'Type something...'
            }
        }
    }
}

export { messages }