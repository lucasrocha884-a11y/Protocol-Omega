// ================================================================================
// CONFIGURAÇÃO DO SUPABASE
// ================================================================================
//
// INSTRUÇÕES PARA CONFIGURAR:
//
// 1. Acesse https://supabase.com e crie uma conta (se ainda não tiver)
//
// 2. Crie um novo projeto:
//    - Clique em "New Project"
//    - Escolha um nome (ex: "protocol-omega")
//    - Defina uma senha forte para o banco de dados
//    - Escolha a região mais próxima de você
//    - Clique em "Create new project"
//
// 3. Aguarde alguns minutos até o projeto ser criado
//
// 4. Obtenha as credenciais:
//    - No menu lateral, clique em "Project Settings" (ícone de engrenagem)
//    - Clique em "API"
//    - Copie a "Project URL" e cole abaixo em SUPABASE_URL
//    - Copie a "anon public" key e cole abaixo em SUPABASE_ANON_KEY
//
// 5. Configure a tabela de usuários:
//    - No menu lateral, clique em "SQL Editor"
//    - Clique em "New query"
//    - Cole o código SQL abaixo e clique em "Run":
//
/*
-- Criar tabela de jogadores
CREATE TABLE jogadores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_discord TEXT NOT NULL UNIQUE,
    nome_roblox TEXT NOT NULL,
    lvl INTEGER NOT NULL DEFAULT 1 CHECK (lvl >= 1 AND lvl <= 99),
    posicao_principal TEXT NOT NULL,
    posicoes_jogaveis TEXT[] NOT NULL,
    descricao_jogo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE jogadores ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ler todos os jogadores
CREATE POLICY "Jogadores são visíveis para todos"
    ON jogadores FOR SELECT
    USING (true);

-- Policy: Usuários podem inserir seus próprios dados
CREATE POLICY "Usuários podem criar seu próprio perfil"
    ON jogadores FOR INSERT
    WITH CHECK (auth.uid() = auth_user_id);

-- Policy: Usuários podem atualizar apenas seus próprios dados
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON jogadores FOR UPDATE
    USING (auth.uid() = auth_user_id);
*/
//
// 6. Configure o Email Auth (para recuperação de senha):
//    - No menu lateral, clique em "Authentication"
//    - Clique em "Providers"
//    - Certifique-se que "Email" está habilitado
//    - Role para baixo e configure "Email Templates" > "Reset Password"
//    - Personalize o template se desejar
//
// 7. Cole suas credenciais abaixo:
// ================================================================================

const SUPABASE_CONFIG = {
    // Cole sua Project URL aqui (ex: https://xyzcompany.supabase.co)
    SUPABASE_URL: 'https://khkqwgetapexehhyswqj.supabase.co',
    
    // Cole sua anon/public key aqui
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoa3F3Z2V0YXBleGVoaHlzd3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NjUwMzIsImV4cCI6MjA4MTA0MTAzMn0.5DxSQEWj9fEzMbu4ENmBeYCE3OLbD9QiADaT2Ep2YK8'
};

// ================================================================================
// NÃO MODIFIQUE ABAIXO DESTA LINHA
// ================================================================================

// Validar se as credenciais foram configuradas
if (SUPABASE_CONFIG.SUPABASE_URL === 'SUA_PROJECT_URL_AQUI' || 
    SUPABASE_CONFIG.SUPABASE_ANON_KEY === 'SUA_ANON_KEY_AQUI') {
    console.error('⚠️ ERRO: Por favor, configure suas credenciais do Supabase no arquivo config.js');
    console.error('📖 Leia as instruções detalhadas no início do arquivo config.js');
}
