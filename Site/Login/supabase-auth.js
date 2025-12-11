// ================================================================================
// MÓDULO DE AUTENTICAÇÃO COM SUPABASE
// ================================================================================
//
// Funções para:
// - Cadastro de novos usuários
// - Login
// - Recuperação e atualização de senha
// - Gestão de sessão
//
// ================================================================================

// Inicializar cliente Supabase
const supabase = supabase.createClient(
    SUPABASE_CONFIG.SUPABASE_URL,
    SUPABASE_CONFIG.SUPABASE_ANON_KEY
);

// ================================================================================
// UTILITÁRIO: Gerar email temporário a partir do nome do Discord
// ================================================================================
function gerarEmailTemp(nomeDiscord) {
    return `${nomeDiscord.replace('#', '_')}@omega.local`;
}

// ================================================================================
// CADASTRAR NOVO JOGADOR
// ================================================================================
async function cadastrarJogador(formData) {
    try {
        console.log('📝 Iniciando cadastro de novo jogador...');

        const emailTemp = gerarEmailTemp(formData.nomeDiscord);

        // 1. Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: emailTemp,
            password: formData.senha,
            options: {
                data: {
                    nome_discord: formData.nomeDiscord,
                    nome_roblox: formData.nomeRoblox,
                    lvl: formData.lvl
                }
            }
        });

        if (authError) throw authError;
        console.log('✅ Usuário criado no Auth:', authData.user.id);

        // 2. Inserir dados do jogador
        const { data: jogadorData, error: jogadorError } = await supabase
            .from('jogadores')
            .insert([{
                auth_user_id: authData.user.id,
                nome_discord: formData.nomeDiscord,
                nome_roblox: formData.nomeRoblox,
                lvl: formData.lvl,
                posicao_principal: formData.posicaoPrincipal,
                posicoes_jogaveis: formData.posicoesJogaveis,
                descricao_jogo: formData.descricaoJogo
            }])
            .select();

        if (jogadorError) throw jogadorError;
        console.log('✅ Dados do jogador salvos:', jogadorData);

        return { success: true, message: 'Cadastro realizado com sucesso!', data: jogadorData[0] };

    } catch (error) {
        console.error('❌ Erro no cadastro:', error);
        return { success: false, message: error.message || 'Erro ao realizar cadastro', error };
    }
}

// ================================================================================
// LOGIN
// ================================================================================
async function fazerLogin(nomeDiscord, senha) {
    try {
        console.log('🔐 Iniciando login...');
        const emailTemp = gerarEmailTemp(nomeDiscord);

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: emailTemp,
            password: senha
        });

        if (authError) throw authError;
        console.log('✅ Login realizado:', authData.user.id);

        const { data: jogadorData, error: jogadorError } = await supabase
            .from('jogadores')
            .select('*')
            .eq('auth_user_id', authData.user.id)
            .single();

        if (jogadorError) console.warn('⚠️ Erro ao buscar dados do jogador:', jogadorError);

        return { success: true, message: 'Login realizado com sucesso!', session: authData.session, jogador: jogadorData };

    } catch (error) {
        console.error('❌ Erro no login:', error);
        return { success: false, message: error.message || 'Erro ao fazer login', error };
    }
}

// ================================================================================
// RECUPERAR SENHA
// ================================================================================
async function recuperarSenha(nomeDiscord) {
    try {
        console.log('📧 Iniciando recuperação de senha...');
        const emailTemp = gerarEmailTemp(nomeDiscord);

        const { error } = await supabase.auth.resetPasswordForEmail(emailTemp, {
            redirectTo: `${window.location.origin}/reset-password.html`
        });

        if (error) throw error;
        console.log('✅ Email de recuperação enviado');

        return { success: true, message: 'Instruções de recuperação enviadas com sucesso!' };

    } catch (error) {
        console.error('❌ Erro na recuperação de senha:', error);
        return { success: false, message: error.message || 'Erro ao enviar instruções de recuperação', error };
    }
}

// ================================================================================
// ATUALIZAR SENHA
// ================================================================================
async function atualizarSenha(novaSenha) {
    try {
        console.log('🔑 Atualizando senha...');
        const { error } = await supabase.auth.updateUser({ password: novaSenha });

        if (error) throw error;
        console.log('✅ Senha atualizada com sucesso');

        return { success: true, message: 'Senha atualizada com sucesso!' };

    } catch (error) {
        console.error('❌ Erro ao atualizar senha:', error);
        return { success: false, message: error.message || 'Erro ao atualizar senha', error };
    }
}

// ================================================================================
// VERIFICAR SESSÃO
// ================================================================================
async function verificarSessao() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
            console.log('✅ Sessão ativa encontrada');
            return { success: true, session, user: session.user };
        }

        console.log('ℹ️ Nenhuma sessão ativa');
        return { success: false, message: 'Nenhuma sessão ativa' };

    } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        return { success: false, error };
    }
}

// ================================================================================
// LOGOUT
// ================================================================================
async function fazerLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        console.log('✅ Logout realizado');
        return { success: true };

    } catch (error) {
        console.error('❌ Erro ao fazer logout:', error);
        return { success: false, error };
    }
}

// ================================================================================
// LISTENER DE AUTENTICAÇÃO
// ================================================================================
supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Mudança de autenticação:', event);

    switch (event) {
        case 'SIGNED_IN':
            console.log('✅ Usuário logado:', session.user.id);
            break;
        case 'SIGNED_OUT':
            console.log('👋 Usuário deslogado');
            break;
        case 'TOKEN_REFRESHED':
            console.log('🔄 Token atualizado');
            break;
        case 'USER_UPDATED':
            console.log('📝 Dados do usuário atualizados');
            break;
        case 'PASSWORD_RECOVERY':
            console.log('🔑 Recuperação de senha iniciada');
            break;
    }
});
