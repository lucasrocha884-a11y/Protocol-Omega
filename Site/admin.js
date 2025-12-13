// ================================================================================
// PAINEL ADMIN - Protocol Omega 3.0
// ================================================================================

// Verificar se é admin
const usuario = getUsuarioLogado();

if (!usuario || !usuario.isAdmin) {
    alert('❌ Acesso negado! Apenas administradores podem acessar esta página.');
    window.location.href = 'index.html';
}

let todosJogadores = [];
let jogadoresFiltrados = [];

// ================================================================================
// CARREGAR DADOS INICIAIS
// ================================================================================
function carregarDados() {
    console.log('👑 Carregando painel admin...');
    
    // Atualizar nome do admin
    document.getElementById('adminName').textContent = usuario.nomeDiscord;
    
    // Carregar todos os jogadores
    todosJogadores = getJogadores();
    jogadoresFiltrados = todosJogadores;
    
    // Atualizar estatísticas
    atualizarEstatisticas();
    
    // Renderizar tabela
    renderizarTabela();
    
    console.log('✅ Painel admin carregado!');
}

// ================================================================================
// ATUALIZAR ESTATÍSTICAS
// ================================================================================
function atualizarEstatisticas() {
    const total = todosJogadores.length;
    
    // Total de jogadores
    document.getElementById('totalPlayers').textContent = total;
    
    if (total === 0) {
        document.getElementById('avgLevel').textContent = '0';
        document.getElementById('maxLevel').textContent = '0';
        document.getElementById('recentPlayers').textContent = '0';
        return;
    }
    
    // Nível médio
    const somaLvl = todosJogadores.reduce((acc, j) => acc + j.lvl, 0);
    const media = Math.round(somaLvl / total);
    document.getElementById('avgLevel').textContent = media;
    
    // Maior nível
    const maxLvl = Math.max(...todosJogadores.map(j => j.lvl));
    document.getElementById('maxLevel').textContent = maxLvl;
    
    // Jogadores novos (últimos 7 dias)
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    
    const novos = todosJogadores.filter(j => {
        const dataCriacao = new Date(j.dataCriacao);
        return dataCriacao >= seteDiasAtras;
    });
    
    document.getElementById('recentPlayers').textContent = novos.length;
}

// ================================================================================
// RENDERIZAR TABELA DE JOGADORES
// ================================================================================
function renderizarTabela() {
    const tbody = document.getElementById('playersTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (jogadoresFiltrados.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tbody.innerHTML = jogadoresFiltrados.map(jogador => {
        const dataCriacao = new Date(jogador.dataCriacao).toLocaleDateString('pt-BR');
        
        return `
            <tr>
                <td>
                    <div class="player-cell">
                        <i data-lucide="user" class="cell-icon"></i>
                        <strong>${jogador.nomeDiscord}</strong>
                    </div>
                </td>
                <td>
                    <div class="player-cell">
                        <i data-lucide="gamepad-2" class="cell-icon"></i>
                        ${jogador.nomeRoblox}
                    </div>
                </td>
                <td>
                    <span class="level-badge" style="background: ${getCorNivel(jogador.lvl)}">
                        ${jogador.lvl}
                    </span>
                </td>
                <td>${jogador.posicaoPrincipal}</td>
                <td>
                    <div class="positions-compact">
                        ${jogador.posicoesJogaveis.map(p => `<span class="pos-tag">${p}</span>`).join('')}
                    </div>
                </td>
                <td class="date-cell">${dataCriacao}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="visualizarJogador('${jogador.id}')">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="confirmarDelecao('${jogador.id}', '${jogador.nomeDiscord}')">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Reinicializar ícones Lucide
    lucide.createIcons();
}

function getCorNivel(lvl) {
    if (lvl < 25) return 'linear-gradient(90deg, #3b82f6, #60a5fa)';
    if (lvl < 50) return 'linear-gradient(90deg, #3b82f6, #8b5cf6)';
    if (lvl < 75) return 'linear-gradient(90deg, #8b5cf6, #a855f7)';
    return 'linear-gradient(90deg, #a855f7, #ec4899)';
}

// ================================================================================
// VISUALIZAR DETALHES DO JOGADOR
// ================================================================================
function visualizarJogador(id) {
    const jogador = todosJogadores.find(j => j.id === id);
    
    if (!jogador) {
        alert('❌ Jogador não encontrado!');
        return;
    }
    
    const dataCriacao = new Date(jogador.dataCriacao).toLocaleString('pt-BR');
    
    const mensagem = `
👤 DETALHES DO JOGADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Discord: ${jogador.nomeDiscord}
Roblox: ${jogador.nomeRoblox}
Nível: ${jogador.lvl}
Posição Principal: ${jogador.posicaoPrincipal}
Posições Jogáveis: ${jogador.posicoesJogaveis.join(', ')}

Descrição do Jogo:
${jogador.descricaoJogo || 'Nenhuma descrição fornecida'}

Cadastrado em: ${dataCriacao}
ID: ${jogador.id}
    `;
    
    alert(mensagem);
}

// ================================================================================
// DELETAR JOGADOR
// ================================================================================
function confirmarDelecao(id, nomeDiscord) {
    const confirmacao = confirm(
        `⚠️ ATENÇÃO!\n\nDeseja realmente DELETAR o jogador:\n${nomeDiscord}\n\nEsta ação NÃO pode ser desfeita!`
    );
    
    if (confirmacao) {
        const resultado = deletarJogador(id);
        
        if (resultado.success) {
            alert(`✅ ${resultado.message}`);
            
            // Recarregar dados
            carregarDados();
        } else {
            alert(`❌ ${resultado.message}`);
        }
    }
}

// ================================================================================
// BUSCA/FILTRO
// ================================================================================
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase().trim();
    
    if (!termo) {
        jogadoresFiltrados = todosJogadores;
    } else {
        jogadoresFiltrados = todosJogadores.filter(j => 
            j.nomeDiscord.toLowerCase().includes(termo) ||
            j.nomeRoblox.toLowerCase().includes(termo) ||
            j.posicaoPrincipal.toLowerCase().includes(termo)
        );
    }
    
    renderizarTabela();
});

// ================================================================================
// BOTÃO ATUALIZAR
// ================================================================================
const btnRefresh = document.getElementById('btnRefresh');

btnRefresh.addEventListener('click', () => {
    searchInput.value = '';
    carregarDados();
    
    // Animação de rotação
    const icon = btnRefresh.querySelector('i');
    icon.style.animation = 'spin 0.5s ease-in-out';
    setTimeout(() => {
        icon.style.animation = '';
    }, 500);
});

// ================================================================================
// BOTÃO LOGOUT
// ================================================================================
const btnLogout = document.getElementById('btnLogout');

btnLogout.addEventListener('click', () => {
    const confirmar = confirm('Deseja realmente sair?');
    
    if (confirmar) {
        logout();
        alert('👋 Logout realizado com sucesso!');
        window.location.href = 'index.html';
    }
});

// ================================================================================
// INICIALIZAR
// ================================================================================
carregarDados();
lucide.createIcons();

console.log('👑 Painel Admin Protocol Omega 3.0 iniciado!');

// Estilo para animação de rotação
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
