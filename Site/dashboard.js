// ================================================================================
// DASHBOARD - Protocol Omega 3.0
// ================================================================================

console.log('🎮 Iniciando Dashboard do Jogador...');

// ================================================================================
// VERIFICAR SE O USUÁRIO ESTÁ LOGADO
// ================================================================================
const usuario = getUsuarioLogado();

if (!usuario) {
    // Se não está logado, redireciona para login
    alert('❌ Você precisa fazer login primeiro!');
    window.location.href = 'index.html';
    throw new Error('Usuário não logado');
}

if (usuario.isAdmin) {
    // Se é admin, redireciona para área admin
    alert('⚠️ Admins devem usar o painel administrativo');
    window.location.href = 'admin.html';
    throw new Error('Admin detectado');
}

console.log('✅ Usuário autenticado:', usuario.nomeDiscord);

// Variável global para armazenar o jogador atual
let jogadorAtual = usuario;

// ================================================================================
// CARREGAR DADOS DO USUÁRIO NA PÁGINA
// ================================================================================
function carregarDadosUsuario() {
    console.log('📊 Carregando dados do jogador...');
    
    // Atualizar nome no header
    const playerNameElement = document.getElementById('playerName');
    if (playerNameElement) {
        playerNameElement.textContent = jogadorAtual.nomeDiscord;
    }
    
    // Atualizar cards de informação
    const playerDiscordElement = document.getElementById('playerDiscord');
    if (playerDiscordElement) {
        playerDiscordElement.textContent = jogadorAtual.nomeDiscord;
    }
    
    const playerRobloxElement = document.getElementById('playerRoblox');
    if (playerRobloxElement) {
        playerRobloxElement.textContent = jogadorAtual.nomeRoblox;
    }
    
    const playerLvlElement = document.getElementById('playerLvl');
    if (playerLvlElement) {
        playerLvlElement.textContent = jogadorAtual.lvl;
    }
    
    const playerPositionElement = document.getElementById('playerPosition');
    if (playerPositionElement) {
        playerPositionElement.textContent = jogadorAtual.posicaoPrincipal;
    }
    
    // Atualizar slider de nível
    const lvlSlider = document.getElementById('lvlSliderEdit');
    const currentLvl = document.getElementById('currentLvl');
    const lvlBarFill = document.getElementById('lvlBarFillEdit');
    
    if (lvlSlider && currentLvl && lvlBarFill) {
        lvlSlider.value = jogadorAtual.lvl;
        currentLvl.textContent = jogadorAtual.lvl;
        lvlBarFill.style.width = jogadorAtual.lvl + '%';
        
        // Cor da barra baseada no nível
        atualizarCorBarra(jogadorAtual.lvl, lvlBarFill);
    }
    
    // Atualizar posições jogáveis
    const positionsList = document.getElementById('positionsList');
    if (positionsList && jogadorAtual.posicoesJogaveis) {
        positionsList.innerHTML = jogadorAtual.posicoesJogaveis.map(pos => `
            <span class="position-tag">${pos}</span>
        `).join('');
    }
    
    // Atualizar descrição
    const gameDescription = document.getElementById('gameDescription');
    if (gameDescription) {
        gameDescription.textContent = jogadorAtual.descricaoJogo || 'Nenhuma descrição fornecida';
    }
    
    console.log('✅ Dashboard carregado com sucesso!');
}

// ================================================================================
// FUNÇÃO PARA ATUALIZAR COR DA BARRA
// ================================================================================
function atualizarCorBarra(value, elemento) {
    if (value < 25) {
        elemento.style.background = 'linear-gradient(90deg, #3b82f6, #60a5fa)';
    } else if (value < 50) {
        elemento.style.background = 'linear-gradient(90deg, #3b82f6, #8b5cf6)';
    } else if (value < 75) {
        elemento.style.background = 'linear-gradient(90deg, #8b5cf6, #a855f7)';
    } else {
        elemento.style.background = 'linear-gradient(90deg, #a855f7, #ec4899)';
    }
}

// ================================================================================
// SLIDER DE NÍVEL - Atualização em tempo real
// ================================================================================
const lvlSlider = document.getElementById('lvlSliderEdit');
const currentLvl = document.getElementById('currentLvl');
const lvlBarFill = document.getElementById('lvlBarFillEdit');

if (lvlSlider && currentLvl && lvlBarFill) {
    lvlSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Atualizar display
        currentLvl.textContent = value;
        
        // Atualizar barra
        lvlBarFill.style.width = value + '%';
        
        // Atualizar cor
        atualizarCorBarra(value, lvlBarFill);
    });
}

// ================================================================================
// BOTÃO DE ATUALIZAR NÍVEL
// ================================================================================
const btnUpdateLevel = document.getElementById('btnUpdateLevel');

if (btnUpdateLevel) {
    btnUpdateLevel.addEventListener('click', () => {
        const novoNivel = parseInt(lvlSlider.value);
        
        if (!jogadorAtual || !jogadorAtual.id) {
            alert('❌ Erro ao identificar jogador');
            console.error('Jogador atual inválido:', jogadorAtual);
            return;
        }
        
        console.log(`🔄 Atualizando nível de ${jogadorAtual.lvl} para ${novoNivel}...`);
        
        // Atualizar o jogador
        const resultado = atualizarJogador(jogadorAtual.id, { lvl: novoNivel });
        
        if (resultado.success) {
            // Atualizar na tela
            document.getElementById('playerLvl').textContent = novoNivel;
            
            // Atualizar variável local
            jogadorAtual.lvl = novoNivel;
            
            // Feedback visual
            alert('✅ Nível atualizado com sucesso!');
            console.log('✅ Nível atualizado para:', novoNivel);
            
        } else {
            alert('❌ Erro ao atualizar nível: ' + resultado.message);
            console.error('Erro:', resultado.message);
        }
    });
}

// ================================================================================
// BOTÃO DE LOGOUT
// ================================================================================
const btnLogout = document.getElementById('btnLogout');

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        console.log('👋 Realizando logout...');
        
        // Logout imediato sem confirmação
        logout();
        
        // Redirecionar para página inicial
        window.location.href = 'index.html';
    });
}

// ================================================================================
// CARREGAR DADOS AO INICIAR
// ================================================================================
carregarDadosUsuario();

// ================================================================================
// INICIALIZAR ÍCONES LUCIDE
// ================================================================================
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
    console.log('✅ Ícones Lucide carregados');
}

console.log('🚀 Dashboard Protocol Omega 3.0 iniciado!');
