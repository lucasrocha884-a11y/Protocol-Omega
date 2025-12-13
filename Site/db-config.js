// ================================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS ONLINE - GitHub Gist
// ================================================================================

// INSTRUÇÕES DE CONFIGURAÇÃO:
// 1. Acesse: https://github.com/settings/tokens
// 2. Clique em "Generate new token" > "Generate new token (classic)"
// 3. Dê um nome: "Protocol Omega 3.0 Database"
// 4. Marque a permissão: "gist" (Create gists)
// 5. Clique em "Generate token"
// 6. Copie o token e cole abaixo

const DB_CONFIG = {
    // Cole seu token do GitHub aqui:
    GITHUB_TOKEN: 'SEU_TOKEN_AQUI',
    
    // ID do Gist (será criado automaticamente na primeira vez)
    GIST_ID: null,
    
    // Nome do arquivo no Gist
    GIST_FILENAME: 'protocol-omega-database.json',
    
    // Descrição do Gist
    GIST_DESCRIPTION: 'Protocol Omega 3.0 - Banco de Dados de Jogadores'
};

// ================================================================================
// VERIFICAR SE O TOKEN ESTÁ CONFIGURADO
// ================================================================================
function isTokenConfigured() {
    return DB_CONFIG.GITHUB_TOKEN && DB_CONFIG.GITHUB_TOKEN !== 'SEU_TOKEN_AQUI';
}

// ================================================================================
// OBTER GIST ID DO LOCALSTORAGE
// ================================================================================
function getGistId() {
    if (DB_CONFIG.GIST_ID) return DB_CONFIG.GIST_ID;
    
    const savedGistId = localStorage.getItem('omega_gist_id');
    if (savedGistId) {
        DB_CONFIG.GIST_ID = savedGistId;
        return savedGistId;
    }
    
    return null;
}

// ================================================================================
// SALVAR GIST ID NO LOCALSTORAGE
// ================================================================================
function saveGistId(gistId) {
    DB_CONFIG.GIST_ID = gistId;
    localStorage.setItem('omega_gist_id', gistId);
}

console.log('⚙️ Configuração do banco de dados carregada');
console.log('🔑 Token configurado:', isTokenConfigured() ? '✅ Sim' : '❌ Não');
