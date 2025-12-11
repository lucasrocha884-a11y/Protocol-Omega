// ================================================================================
// APLICAÇÃO PRINCIPAL - PROTOCOL OMEGA 3.0
// ================================================================================

// Elementos do DOM
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formLogin = document.getElementById('formLogin');
const formRegister = document.getElementById('formRegister');
const btnForgotPassword = document.getElementById('btnForgotPassword');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const formForgotPassword = document.getElementById('formForgotPassword');
const forgotPasswordFormDiv = document.getElementById('forgotPasswordForm');
const forgotPasswordSuccessDiv = document.getElementById('forgotPasswordSuccess');

// Posições jogáveis (seleção múltipla)
const posicoesButtons = document.querySelectorAll('.position-btn');
let posicoesJogaveisSelecionadas = [];

// LVL Slider (controle do nível)
const lvlSlider = document.getElementById('registerLvl');
const lvlDisplay = document.getElementById('lvlDisplay');
const lvlBarFill = document.getElementById('lvlBarFill');

// ================================================================================
// ATUALIZAR DISPLAY DO NÍVEL (LVL) EM TEMPO REAL
// ================================================================================
if (lvlSlider) {
    lvlSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Atualizar display do número
        lvlDisplay.textContent = value;
        
        // Atualizar barra de progresso
        lvlBarFill.style.width = value + '%';
        
        // Mudar cor da barra baseado no nível
        if (value < 25) {
            lvlBarFill.style.background = 'linear-gradient(90deg, #3b82f6, #60a5fa)';
        } else if (value < 50) {
            lvlBarFill.style.background = 'linear-gradient(90deg, #3b82f6, #8b5cf6)';
        } else if (value < 75) {
            lvlBarFill.style.background = 'linear-gradient(90deg, #8b5cf6, #a855f7)';
        } else {
            lvlBarFill.style.background = 'linear-gradient(90deg, #a855f7, #ec4899)';
        }
    });
}

// ================================================================================
// TOGGLE ENTRE LOGIN E CADASTRO
// ================================================================================
btnLogin.addEventListener('click', () => {
    btnLogin.classList.add('active');
    btnRegister.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
});

btnRegister.addEventListener('click', () => {
    btnRegister.classList.add('active');
    btnLogin.classList.remove('active');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
});

// ================================================================================
// SELEÇÃO DE POSIÇÕES JOGÁVEIS
// ================================================================================
posicoesButtons.forEach(button => {
    button.addEventListener('click', () => {
        const posicao = button.getAttribute('data-position');
        
        if (button.classList.contains('active')) {
            // Remover posição
            button.classList.remove('active');
            posicoesJogaveisSelecionadas = posicoesJogaveisSelecionadas.filter(p => p !== posicao);
        } else {
            // Adicionar posição
            button.classList.add('active');
            posicoesJogaveisSelecionadas.push(posicao);
        }
        
        console.log('Posições selecionadas:', posicoesJogaveisSelecionadas);
    });
});

// ================================================================================
// SUBMIT - FORMULÁRIO DE LOGIN
// ================================================================================
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nomeDiscord = document.getElementById('loginDiscord').value.trim();
    const senha = document.getElementById('loginPassword').value;
    
    console.log('🔐 Tentando fazer login...');
    
    // Desabilitar botão durante o processo
    const submitBtn = formLogin.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Entrando...</span>';
    
    try {
        // Chamar função de login do Supabase
        const resultado = await fazerLogin(nomeDiscord, senha);
        
        if (resultado.success) {
            // Login bem-sucedido
            alert(`✅ ${resultado.message}\n\nBem-vindo, ${resultado.jogador.nome_discord}!`);
            console.log('Dados do jogador:', resultado.jogador);
            
            // Aqui você pode redirecionar para a página principal da aplicação
            // window.location.href = '/dashboard.html';
            
            // OU mostrar os dados na tela
            mostrarDadosJogador(resultado.jogador);
            
        } else {
            // Erro no login
            alert(`❌ Erro no login:\n${resultado.message}`);
        }
        
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro inesperado ao fazer login');
    } finally {
        // Reabilitar botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        lucide.createIcons();
    }
});

// ================================================================================
// SUBMIT - FORMULÁRIO DE CADASTRO
// ================================================================================
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Coletar dados do formulário
    const formData = {
        nomeDiscord: document.getElementById('registerDiscord').value.trim(),
        nomeRoblox: document.getElementById('registerRoblox').value.trim(),
        senha: document.getElementById('registerPassword').value,
        lvl: parseInt(document.getElementById('registerLvl').value),
        posicaoPrincipal: document.getElementById('posicaoPrincipal').value,
        posicoesJogaveis: posicoesJogaveisSelecionadas,
        descricaoJogo: document.getElementById('descricaoJogo').value.trim()
    };
    
    // Validações
    if (!formData.nomeDiscord || !formData.nomeRoblox || !formData.senha) {
        alert('❌ Preencha todos os campos obrigatórios');
        return;
    }
    
    if (!formData.posicaoPrincipal) {
        alert('❌ Selecione sua posição principal');
        return;
    }
    
    if (formData.posicoesJogaveis.length === 0) {
        alert('❌ Selecione pelo menos uma posição jogável');
        return;
    }
    
    if (formData.senha.length < 6) {
        alert('❌ A senha deve ter pelo menos 6 caracteres');
        return;
    }
    
    if (!formData.lvl || formData.lvl < 1 || formData.lvl > 99) {
        alert('❌ O nível deve estar entre 1 e 99');
        return;
    }
    
    console.log('📝 Dados do cadastro:', formData);
    
    // Desabilitar botão durante o processo
    const submitBtn = formRegister.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Criando conta...</span>';
    
    try {
        // Chamar função de cadastro do Supabase
        const resultado = await cadastrarJogador(formData);
        
        if (resultado.success) {
            // Cadastro bem-sucedido
            alert(`✅ ${resultado.message}\n\nConta criada com sucesso!\n\nAgora você pode fazer login.`);
            
            // Limpar formulário
            formRegister.reset();
            posicoesJogaveisSelecionadas = [];
            posicoesButtons.forEach(btn => btn.classList.remove('active'));
            
            // Voltar para tela de login
            btnLogin.click();
            
        } else {
            // Erro no cadastro
            alert(`❌ Erro no cadastro:\n${resultado.message}`);
        }
        
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro inesperado ao criar conta');
    } finally {
        // Reabilitar botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        lucide.createIcons();
    }
});

// ================================================================================
// MODAL DE RECUPERAÇÃO DE SENHA
// ================================================================================

// Abrir modal
btnForgotPassword.addEventListener('click', () => {
    forgotPasswordModal.style.display = 'flex';
    forgotPasswordFormDiv.style.display = 'block';
    forgotPasswordSuccessDiv.style.display = 'none';
    document.getElementById('forgotDiscord').value = '';
});

// Fechar modal
btnCloseModal.addEventListener('click', () => {
    forgotPasswordModal.style.display = 'none';
});

// Fechar modal ao clicar fora
forgotPasswordModal.addEventListener('click', (e) => {
    if (e.target === forgotPasswordModal) {
        forgotPasswordModal.style.display = 'none';
    }
});

// Submit do formulário de recuperação
formForgotPassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nomeDiscord = document.getElementById('forgotDiscord').value.trim();
    
    if (!nomeDiscord) {
        alert('❌ Digite seu nome do Discord');
        return;
    }
    
    console.log('📧 Enviando email de recuperação...');
    
    // Desabilitar botão durante o processo
    const submitBtn = formForgotPassword.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Enviando...</span>';
    
    try {
        // Chamar função de recuperação do Supabase
        const resultado = await recuperarSenha(nomeDiscord);
        
        if (resultado.success) {
            // Mostrar mensagem de sucesso
            forgotPasswordFormDiv.style.display = 'none';
            forgotPasswordSuccessDiv.style.display = 'block';
            
            // Fechar modal após 3 segundos
            setTimeout(() => {
                forgotPasswordModal.style.display = 'none';
            }, 3000);
            
        } else {
            alert(`❌ Erro:\n${resultado.message}`);
        }
        
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao enviar instruções de recuperação');
    } finally {
        // Reabilitar botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        lucide.createIcons();
    }
});

// ================================================================================
// FUNÇÃO AUXILIAR: MOSTRAR DADOS DO JOGADOR (após login)
// ================================================================================
function mostrarDadosJogador(jogador) {
    console.log('👤 DADOS DO JOGADOR:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Discord: ${jogador.nome_discord}`);
    console.log(`Roblox: ${jogador.nome_roblox}`);
    console.log(`Posição Principal: ${jogador.posicao_principal}`);
    console.log(`Posições Jogáveis: ${jogador.posicoes_jogaveis.join(', ')}`);
    console.log(`Descrição: ${jogador.descricao_jogo}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Aqui você pode criar uma interface para mostrar os dados
    // Por exemplo, esconder os formulários e mostrar uma dashboard
    
    // Exemplo simples: adicionar um card na página
    const card = document.createElement('div');
    card.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 1rem;
        padding: 1.5rem;
        color: white;
        max-width: 300px;
        z-index: 1001;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    `;
    
    card.innerHTML = `
        <h3 style="color: #60a5fa; margin-bottom: 1rem;">🎮 Perfil</h3>
        <p><strong>Discord:</strong> ${jogador.nome_discord}</p>
        <p><strong>Roblox:</strong> ${jogador.nome_roblox}</p>
        <p><strong>Posição:</strong> ${jogador.posicao_principal}</p>
        <button onclick="this.parentElement.remove()" style="
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: linear-gradient(90deg, #dc2626, #991b1b);
            border: none;
            border-radius: 0.5rem;
            color: white;
            cursor: pointer;
            width: 100%;
        ">Fechar</button>
    `;
    
    document.body.appendChild(card);
}

// ================================================================================
// VERIFICAR SESSÃO AO CARREGAR A PÁGINA
// ================================================================================
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Protocol Omega 3.0 iniciado');
    
    // Verificar se há uma sessão ativa
    const sessao = await verificarSessao();
    
    if (sessao.success) {
        console.log('✅ Sessão ativa detectada');
        // Usuário já está logado, pode redirecionar ou mostrar dashboard
    } else {
        console.log('ℹ️ Usuário não está logado');
    }
    
    // Inicializar ícones
    lucide.createIcons();
});

// ================================================================================
// CARREGAR LOGO DO PROTOCOL OMEGA 3.0
// ================================================================================
// Se você tiver a logo, substitua a URL do placeholder
const logoImg = document.getElementById('logoImg');
// logoImg.src = 'caminho/para/sua/logo.png';