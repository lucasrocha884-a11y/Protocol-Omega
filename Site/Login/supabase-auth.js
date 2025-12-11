// ================================================================================
// MÓDULO DE AUTENTICAÇÃO COM SUPABASE
// ================================================================================
//
// Este arquivo contém todas as funções de integração com Supabase para:
// - Cadastro de novos usuários
// - Login de usuários existentes
// - Recuperação de senha
// - Gestão de sessão
//
// ================================================================================

// Inicializar cliente Supabase
const supabase = supabase.createClient(
    SUPABASE_CONFIG.SUPABASE_URL,
    SUPABASE_CONFIG.SUPABASE_ANON_KEY
);

// ================================================================================
// FUNÇÃO: CADASTRAR NOVO JOGADOR
// ================================================================================
// 
// Esta função:
// 1. Cria um novo usuário no Supabase Auth usando o nome do Discord como email
// 2. Insere os dados do jogador na tabela 'jogadores'
//
// COMO FUNCIONA:
// - O Supabase Auth requer um email, então usamos: nomeDiscord@omega.local
// - A senha é armazenada de forma segura pelo Supabase
// - Os metadados do jogador são salvos na tabela 'jogadores'
//
// ================================================================================
async function cadastrarJogador(formData) {
    try {
        console.log('📝 Iniciando cadastro de novo jogador...');
        
        // 1. Criar usuário no Supabase Auth
        // Usamos o nome do Discord como base para o email
        const emailTemp = `${formData.nomeDiscord.replace('#', '_')}@omega.local`;
        
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

        if (authError) {
            console.error('❌ Erro ao criar usuário:', authError);
            throw authError;
        }

        console.log('✅ Usuário criado no Auth:', authData.user.id);

        // 2. Inserir dados do jogador na tabela
        const { data: jogadorData, error: jogadorError } = await supabase
            .from('jogadores')
            .insert([
                {
                    auth_user_id: authData.user.id,
                    nome_discord: formData.nomeDiscord,
                    nome_roblox: formData.nomeRoblox,
                    lvl: formData.lvl,
                    posicao_principal: formData.posicaoPrincipal,
                    posicoes_jogaveis: formData.posicoesJogaveis,
                    descricao_jogo: formData.descricaoJogo
                }
            ])
            .select();

        if (jogadorError) {
            console.error('❌ Erro ao salvar dados do jogador:', jogadorError);
            throw jogadorError;
        }

        console.log('✅ Dados do jogador salvos:', jogadorData);

        return {
            success: true,
            message: 'Cadastro realizado com sucesso!',
            data: jogadorData[0]
        };

    } catch (error) {
        console.error('❌ Erro no cadastro:', error);
        return {
            success: false,
            message: error.message || 'Erro ao realizar cadastro',
            error: error
        };
    }
}

// ================================================================================
// FUNÇÃO: FAZER LOGIN
// ================================================================================
//
// Esta função:
// 1. Converte o nome do Discord em email temporário
// 2. Autentica o usuário no Supabase
// 3. Busca os dados completos do jogador
//
// RETORNA:
// - success: true/false
// - session: sessão do usuário (contém tokens)
// - jogador: dados completos do perfil
//
// ================================================================================
async function fazerLogin(nomeDiscord, senha) {
    try {
        console.log('🔐 Iniciando login...');
        
        // Converter nome do Discord para email temporário
        const emailTemp = `${nomeDiscord.replace('#', '_')}@omega.local`;
        
        // 1. Autenticar usuário
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: emailTemp,
            password: senha
        });

        if (authError) {
            console.error('❌ Erro ao fazer login:', authError);
            throw authError;
        }

        console.log('✅ Login realizado:', authData.user.id);

        // 2. Buscar dados do jogador
        const { data: jogadorData, error: jogadorError } = await supabase
            .from('jogadores')
            .select('*')
            .eq('auth_user_id', authData.user.id)
            .single();

        if (jogadorError) {
            console.error('⚠️ Erro ao buscar dados do jogador:', jogadorError);
        }

        return {
            success: true,
            message: 'Login realizado com sucesso!',
            session: authData.session,
            jogador: jogadorData
        };

    } catch (error) {
        console.error('❌ Erro no login:', error);
        return {
            success: false,
            message: error.message || 'Erro ao fazer login',
            error: error
        };
    }
}

// ================================================================================
// FUNÇÃO: RECUPERAR SENHA
// ================================================================================
//
// Esta função envia um email de recuperação de senha para o usuário.
//
// COMO FUNCIONA:
// 1. Converte o nome do Discord em email temporário
// 2. Chama a API do Supabase para enviar email de reset
// 3. O usuário recebe um link para redefinir a senha
//
// CONFIGURAÇÃO NECESSÁRIA:
// No Supabase, vá em Authentication > URL Configuration e configure:
// - Site URL: URL do seu site (ex: http://localhost:3000)
// - Redirect URLs: Adicione a URL de reset (ex: http://localhost:3000/reset-password)
//
// IMPORTANTE: 
// Para produção, você precisará configurar um servidor de email no Supabase
// ou usar um provedor como SendGrid, AWS SES, etc.
//
// ================================================================================
async function recuperarSenha(nomeDiscord) {
    try {
        console.log('📧 Iniciando recuperação de senha...');
        
        // Converter nome do Discord para email temporário
        const emailTemp = `${nomeDiscord.replace('#', '_')}@omega.local`;
        
        // Enviar email de recuperação
        const { data, error } = await supabase.auth.resetPasswordForEmail(emailTemp, {
            redirectTo: `${window.location.origin}/reset-password.html`
        });

        if (error) {
            console.error('❌ Erro ao enviar email de recuperação:', error);
            throw error;
        }

        console.log('✅ Email de recuperação enviado');

        return {
            success: true,
            message: 'Instruções de recuperação enviadas com sucesso!'
        };

    } catch (error) {
        console.error('❌ Erro na recuperação de senha:', error);
        return {
            success: false,
            message: error.message || 'Erro ao enviar instruções de recuperação',
            error: error
        };
    }
}

// ================================================================================
// FUNÇÃO: ATUALIZAR SENHA (usada na página de reset)
// ================================================================================
//
// Esta função é chamada na página de reset-password.html
// quando o usuário clica no link recebido por email
//
// COMO USAR:
// 1. Usuário clica no link do email
// 2. É redirecionado para reset-password.html
// 3. Insere a nova senha
// 4. Esta função atualiza a senha no Supabase
//
// ================================================================================
async function atualizarSenha(novaSenha) {
    try {
        console.log('🔑 Atualizando senha...');
        
        const { data, error } = await supabase.auth.updateUser({
            password: novaSenha
        });

        if (error) {
            console.error('❌ Erro ao atualizar senha:', error);
            throw error;
        }

        console.log('✅ Senha atualizada com sucesso');

        return {
            success: true,
            message: 'Senha atualizada com sucesso!'
        };

    } catch (error) {
        console.error('❌ Erro ao atualizar senha:', error);
        return {
            success: false,
            message: error.message || 'Erro ao atualizar senha',
            error: error
        };
    }
}

// ================================================================================
// FUNÇÃO: VERIFICAR SESSÃO ATIVA
// ================================================================================
//
// Verifica se o usuário já está logado
// Útil para manter o usuário logado entre refreshes da página
//
// ================================================================================
async function verificarSessao() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
            console.log('✅ Sessão ativa encontrada');
            return {
                success: true,
                session: session,
                user: session.user
            };
        } else {
            console.log('ℹ️ Nenhuma sessão ativa');
            return {
                success: false,
                message: 'Nenhuma sessão ativa'
            };
        }
    } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        return {
            success: false,
            error: error
        };
    }
}

// ================================================================================
// FUNÇÃO: FAZER LOGOUT
// ================================================================================
async function fazerLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) throw error;
        
        console.log('✅ Logout realizado');
        return { success: true };
    } catch (error) {
        console.error('❌ Erro ao fazer logout:', error);
        return {
            success: false,
            error: error
        };
    }
}

// ================================================================================
// LISTENER DE MUDANÇAS DE AUTENTICAÇÃO
// ================================================================================
//
// Este listener monitora mudanças no estado de autenticação
// Útil para reagir a login, logout, expiração de token, etc.
//
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