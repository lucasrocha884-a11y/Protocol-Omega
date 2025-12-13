// ================================================================================
// SISTEMA DE ARMAZENAMENTO SIMPLES - LocalStorage
// ================================================================================
// 
// Guarda todos os dados no navegador do usuário
// Não precisa configurar NADA - funciona automaticamente!
// 
// ================================================================================

// ================================================================================
// ADMINISTRADORES (definidos manualmente)
// ================================================================================

const ADMINS = [
    { discord: 'Admin', senha: 'admin123' },
    { discord: 'ProtocolAdmin', senha: 'omega2024' }
    // Adicione mais admins aqui se quiser
];

function verificarAdmin(nomeDiscord, senha) {
    return ADMINS.some(admin => 
        admin.discord === nomeDiscord && admin.senha === senha
    );
}

// ================================================================================
// FUNÇÕES DE CADASTRO
// ================================================================================

function cadastrarJogador(dados) {
    try {
        // Pegar todos os jogadores já cadastrados
        const jogadores = getJogadores();
        
        // Verificar se o Discord já está cadastrado
        const discordExiste = jogadores.find(j => j.nomeDiscord === dados.nomeDiscord);
        if (discordExiste) {
            return {
                success: false,
                message: '❌ Este Discord já está cadastrado!'
            };
        }
        
        // Verificar se o Roblox já está cadastrado
        const robloxExiste = jogadores.find(j => j.nomeRoblox === dados.nomeRoblox);
        if (robloxExiste) {
            return {
                success: false,
                message: '❌ Este nome do Roblox já está cadastrado!'
            };
        }
        
        // Criar novo jogador
        const novoJogador = {
            id: gerarID(),
            nomeDiscord: dados.nomeDiscord,
            nomeRoblox: dados.nomeRoblox,
            senha: dados.senha, // Em produção, use hash!
            lvl: dados.lvl,
            posicaoPrincipal: dados.posicaoPrincipal,
            posicoesJogaveis: dados.posicoesJogaveis,
            descricaoJogo: dados.descricaoJogo,
            dataCriacao: new Date().toISOString()
        };
        
        // Adicionar à lista
        jogadores.push(novoJogador);
        
        // Salvar no localStorage
        localStorage.setItem('omega_jogadores', JSON.stringify(jogadores));
        
        console.log('✅ Jogador cadastrado:', novoJogador);
        
        return {
            success: true,
            message: '✅ Cadastro realizado com sucesso!',
            jogador: novoJogador
        };
        
    } catch (error) {
        console.error('❌ Erro ao cadastrar:', error);
        return {
            success: false,
            message: '❌ Erro ao realizar cadastro'
        };
    }
}

// ================================================================================
// FUNÇÕES DE LOGIN
// ================================================================================

function fazerLogin(nomeDiscord, senha) {
    try {
        const jogadores = getJogadores();
        
        // Buscar jogador pelo nome do Discord
        const jogador = jogadores.find(j => j.nomeDiscord === nomeDiscord);
        
        if (!jogador) {
            return {
                success: false,
                message: '❌ Nome do Discord não encontrado!'
            };
        }
        
        // Verificar senha
        if (jogador.senha !== senha) {
            return {
                success: false,
                message: '❌ Senha incorreta!'
            };
        }
        
        // Login bem-sucedido - salvar sessão
        localStorage.setItem('omega_usuario_logado', JSON.stringify(jogador));
        
        console.log('✅ Login realizado:', jogador.nomeDiscord);
        
        return {
            success: true,
            message: '✅ Login realizado com sucesso!',
            jogador: jogador
        };
        
    } catch (error) {
        console.error('❌ Erro ao fazer login:', error);
        return {
            success: false,
            message: '❌ Erro ao fazer login'
        };
    }
}

// ================================================================================
// RECUPERAÇÃO DE SENHA
// ================================================================================

function recuperarSenha(nomeDiscord) {
    try {
        const jogadores = getJogadores();
        
        // Buscar jogador pelo Discord
        const jogador = jogadores.find(j => j.nomeDiscord === nomeDiscord);
        
        if (!jogador) {
            return {
                success: false,
                message: '❌ Nome do Discord não encontrado!'
            };
        }
        
        // Em um sistema real, enviaria email
        // Aqui vamos mostrar a senha (só para demo!)
        console.log('🔑 Senha recuperada:', jogador.senha);
        
        return {
            success: true,
            message: `✅ Sua senha é: ${jogador.senha}`,
            senha: jogador.senha
        };
        
    } catch (error) {
        console.error('❌ Erro ao recuperar senha:', error);
        return {
            success: false,
            message: '❌ Erro ao recuperar senha'
        };
    }
}

function redefinirSenha(nomeDiscord, novaSenha) {
    try {
        const jogadores = getJogadores();
        
        // Buscar jogador pelo Discord
        const index = jogadores.findIndex(j => j.nomeDiscord === nomeDiscord);
        
        if (index === -1) {
            return {
                success: false,
                message: '❌ Jogador não encontrado!'
            };
        }
        
        // Atualizar senha
        jogadores[index].senha = novaSenha;
        
        // Salvar
        localStorage.setItem('omega_jogadores', JSON.stringify(jogadores));
        
        console.log('✅ Senha redefinida para:', nomeDiscord);
        
        return {
            success: true,
            message: '✅ Senha redefinida com sucesso!'
        };
        
    } catch (error) {
        console.error('❌ Erro ao redefinir senha:', error);
        return {
            success: false,
            message: '❌ Erro ao redefinir senha'
        };
    }
}

// ================================================================================
// FUNÇÕES DE SESSÃO
// ================================================================================

function getUsuarioLogado() {
    const usuario = localStorage.getItem('omega_usuario_logado');
    return usuario ? JSON.parse(usuario) : null;
}

function logout() {
    localStorage.removeItem('omega_usuario_logado');
    console.log('👋 Logout realizado');
}

// ================================================================================
// FUNÇÕES AUXILIARES
// ================================================================================

function getJogadores() {
    const jogadores = localStorage.getItem('omega_jogadores');
    return jogadores ? JSON.parse(jogadores) : [];
}

function atualizarJogador(id, dadosAtualizados) {
    try {
        const jogadores = getJogadores();
        const index = jogadores.findIndex(j => j.id === id);
        
        if (index === -1) {
            return { success: false, message: '❌ Jogador não encontrado!' };
        }
        
        // Atualizar dados
        jogadores[index] = { ...jogadores[index], ...dadosAtualizados };
        
        // Salvar
        localStorage.setItem('omega_jogadores', JSON.stringify(jogadores));
        
        // Se for o usuário logado, atualizar sessão também
        const usuarioLogado = getUsuarioLogado();
        if (usuarioLogado && usuarioLogado.id === id) {
            localStorage.setItem('omega_usuario_logado', JSON.stringify(jogadores[index]));
        }
        
        console.log('✅ Jogador atualizado:', jogadores[index]);
        
        return { 
            success: true, 
            message: '✅ Dados atualizados com sucesso!',
            jogador: jogadores[index]
        };
        
    } catch (error) {
        console.error('❌ Erro ao atualizar jogador:', error);
        return { success: false, message: '❌ Erro ao atualizar dados' };
    }
}

function deletarJogador(id) {
    try {
        const jogadores = getJogadores();
        const jogadorRemovido = jogadores.find(j => j.id === id);
        
        if (!jogadorRemovido) {
            return { success: false, message: '❌ Jogador não encontrado!' };
        }
        
        // Remover jogador
        const novosJogadores = jogadores.filter(j => j.id !== id);
        
        // Salvar
        localStorage.setItem('omega_jogadores', JSON.stringify(novosJogadores));
        
        console.log('🗑️ Jogador removido:', jogadorRemovido.nomeDiscord);
        
        return {
            success: true,
            message: `✅ Jogador ${jogadorRemovido.nomeDiscord} removido com sucesso!`
        };
        
    } catch (error) {
        console.error('❌ Erro ao deletar jogador:', error);
        return { success: false, message: '❌ Erro ao remover jogador' };
    }
}

function gerarID() {
    return 'jogador_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function limparDados() {
    localStorage.removeItem('omega_jogadores');
    localStorage.removeItem('omega_usuario_logado');
    console.log('🗑️ Todos os dados foram limpos');
}

// ================================================================================
// EXPORTAR FUNÇÕES
// ================================================================================

console.log('💾 Sistema de armazenamento carregado!');
console.log('📊 Jogadores cadastrados:', getJogadores().length);