# Protocol Omega 3.0 - Sistema de Recrutamento de Elite

Sistema de cadastro e login para o time Protocol Omega 3.0, desenvolvido com HTML, CSS e JavaScript puro, integrado com Supabase.

## 📋 Índice

1. [Arquivos do Projeto](#arquivos-do-projeto)
2. [Configuração do Supabase](#configuração-do-supabase)
3. [Como Usar](#como-usar)
4. [Funcionalidades](#funcionalidades)
5. [Recuperação de Senha](#recuperação-de-senha)
6. [Estrutura de Dados](#estrutura-de-dados)

---

## 📁 Arquivos do Projeto

```
protocol-omega/
├── index.html              # Página principal (Login/Cadastro)
├── reset-password.html     # Página de redefinição de senha
├── styles.css              # Estilos da aplicação
├── config.js               # Configurações do Supabase
├── supabase-auth.js        # Funções de autenticação
├── app.js                  # Lógica da aplicação
└── README.md               # Este arquivo
```

---

## ⚙️ Configuração do Supabase

### Passo 1: Criar Conta e Projeto

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **"Start your project"** e faça login (pode usar GitHub)
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: protocol-omega (ou outro nome)
   - **Database Password**: Escolha uma senha forte e guarde-a
   - **Region**: Escolha a região mais próxima
5. Clique em **"Create new project"**
6. Aguarde 2-3 minutos até o projeto ser criado

### Passo 2: Obter Credenciais

1. No menu lateral, clique em **⚙️ Project Settings**
2. Clique em **API**
3. Você verá duas informações importantes:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Abra o arquivo **`config.js`** no seu projeto
5. Substitua as credenciais:

```javascript
const SUPABASE_CONFIG = {
    SUPABASE_URL: 'https://xxxxxxxxxxxxx.supabase.co',  // Cole sua Project URL
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // Cole sua anon public key
};
```

### Passo 3: Criar Tabela no Banco de Dados

1. No menu lateral do Supabase, clique em **🔧 SQL Editor**
2. Clique em **"New query"**
3. Cole o código SQL abaixo:

```sql
-- Criar tabela de jogadores
CREATE TABLE jogadores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_discord TEXT NOT NULL UNIQUE,
    nome_roblox TEXT NOT NULL,
    lvl INTEGER NOT NULL CHECK (lvl >= 1 AND lvl <= 99),
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
```

4. Clique em **"Run"** (ou pressione Ctrl+Enter)
5. Você verá a mensagem **"Success. No rows returned"**

### Passo 4: Configurar Autenticação por Email

1. No menu lateral, clique em **🔐 Authentication**
2. Clique em **Providers**
3. Certifique-se que **Email** está habilitado (toggle verde)
4. Role para baixo e configure:
   - **Confirm email**: Desabilite (toggle vermelho) para testes
   - Em produção, você pode habilitar e configurar um servidor de email

### Passo 5: Configurar URLs de Redirecionamento

1. Ainda em **Authentication**, clique em **URL Configuration**
2. Em **Site URL**, adicione a URL do seu site:
   - Para testes locais: `http://localhost:3000` ou `http://127.0.0.1:5500`
   - Para produção: `https://seusite.com`
3. Em **Redirect URLs**, adicione:
   - `http://localhost:3000/reset-password.html`
   - `http://127.0.0.1:5500/reset-password.html`
   - `https://seusite.com/reset-password.html` (se em produção)

---

## 🚀 Como Usar

### Executar Localmente

1. **Opção 1: Usar Live Server (VS Code)**
   - Instale a extensão "Live Server" no VS Code
   - Clique com botão direito em `index.html`
   - Selecione "Open with Live Server"
   - Abrirá em `http://127.0.0.1:5500`

2. **Opção 2: Usar Python SimpleHTTPServer**
   ```bash
   # Python 3
   python -m http.server 3000
   
   # Python 2
   python -m SimpleHTTPServer 3000
   ```
   - Acesse `http://localhost:3000`

3. **Opção 3: Usar Node.js http-server**
   ```bash
   npx http-server -p 3000
   ```
   - Acesse `http://localhost:3000`

### Testar Cadastro

1. Acesse `index.html` no navegador
2. Clique na aba **"Cadastro"**
3. Preencha os campos:
   - **Nome do Discord**: exemplo#1234
   - **Nome do Roblox**: JogadorPro
   - **Senha**: minhasenha123 (mínimo 6 caracteres)
   - **Posição Principal**: Atacante
   - **Posições Jogáveis**: Clique nas posições que você joga
   - **Descrição do Jogo**: Descreva seu estilo
4. Clique em **"Criar Conta"**
5. Se tudo estiver correto, verá a mensagem de sucesso

### Testar Login

1. Clique na aba **"Login"**
2. Digite o mesmo **Nome do Discord** e **Senha** do cadastro
3. Clique em **"Entrar"**
4. Se correto, verá seus dados no console e um card no canto superior direito

---

## ✨ Funcionalidades

### 1. Cadastro de Jogador
- Nome do Discord (único)
- Nome do Roblox
- Senha (mínimo 6 caracteres)
- Posição Principal (dropdown)
- Posições Jogáveis (seleção múltipla)
- Descrição do Jogo (textarea)

**Validações:**
- Todos os campos são obrigatórios
- Senha deve ter pelo menos 6 caracteres
- Pelo menos uma posição jogável deve ser selecionada
- Nome do Discord deve ser único (não pode duplicar)

**Código de Exemplo:**
```javascript
const formData = {
    nomeDiscord: 'jogador#1234',
    nomeRoblox: 'MeuNomeRoblox',
    senha: 'minhasenha',
    posicaoPrincipal: 'Atacante',
    posicoesJogaveis: ['Atacante', 'Ponta'],
    descricaoJogo: 'Jogo agressivo, gosto de finalizar'
};

const resultado = await cadastrarJogador(formData);
if (resultado.success) {
    console.log('Cadastro OK:', resultado.data);
}
```

### 2. Login
- Autentica usando Nome do Discord + Senha
- Retorna sessão e dados completos do jogador
- Mantém sessão ativa (localStorage)

**Código de Exemplo:**
```javascript
const resultado = await fazerLogin('jogador#1234', 'minhasenha');
if (resultado.success) {
    console.log('Sessão:', resultado.session);
    console.log('Jogador:', resultado.jogador);
}
```

### 3. Verificar Sessão Ativa
- Verifica se usuário já está logado
- Útil para manter login entre refreshes

**Código de Exemplo:**
```javascript
const sessao = await verificarSessao();
if (sessao.success) {
    console.log('Usuário logado:', sessao.user);
}
```

### 4. Logout
```javascript
const resultado = await fazerLogout();
if (resultado.success) {
    console.log('Logout realizado');
}
```

---

## 🔑 Recuperação de Senha

### Como Funciona

1. **Usuário solicita recuperação:**
   - Clica em "Esqueceu a senha?"
   - Digita o Nome do Discord
   - Sistema envia email de recuperação

2. **Usuário recebe email:**
   - Email contém link mágico com tokens
   - Exemplo: `https://seusite.com/reset-password.html#access_token=xxx&type=recovery`

3. **Usuário clica no link:**
   - É redirecionado para `reset-password.html`
   - Página valida o token automaticamente
   - Se válido, mostra formulário de nova senha

4. **Usuário define nova senha:**
   - Digita nova senha (2x para confirmar)
   - Clica em "Atualizar Senha"
   - Senha é atualizada no Supabase

### Código Detalhado

**Solicitar Recuperação:**
```javascript
// No arquivo app.js
const resultado = await recuperarSenha('jogador#1234');
if (resultado.success) {
    console.log('Email enviado!');
}
```

**Atualizar Senha (reset-password.html):**
```javascript
// Automaticamente valida token da URL
window.addEventListener('DOMContentLoaded', async () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (!accessToken || type !== 'recovery') {
        // Token inválido
        mostrarErro();
    }
});

// Ao submeter nova senha
const resultado = await atualizarSenha('novaSenha123');
if (resultado.success) {
    console.log('Senha atualizada!');
}
```

### Configurar Email (Produção)

Para enviar emails reais, você precisa configurar um provedor de email:

1. No Supabase, vá em **Project Settings** > **Auth** > **SMTP Settings**
2. Configure um dos provedores:
   - **SendGrid** (recomendado para iniciantes)
   - **AWS SES**
   - **Resend**
   - Qualquer servidor SMTP

**Exemplo com SendGrid:**
1. Crie conta em [sendgrid.com](https://sendgrid.com)
2. Obtenha API key
3. Configure no Supabase:
   ```
   Host: smtp.sendgrid.net
   Port: 587
   User: apikey
   Password: [sua API key]
   Sender Email: noreply@protocolomega.com
   ```

---

## 📊 Estrutura de Dados

### Tabela: `jogadores`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único do jogador (auto-gerado) |
| `auth_user_id` | UUID | Referência ao usuário do Supabase Auth |
| `nome_discord` | TEXT | Nome do Discord (único) |
| `nome_roblox` | TEXT | Nome do Roblox |
| `lvl` | INTEGER | Nível do jogador (1-99) |
| `posicao_principal` | TEXT | Posição principal do jogador |
| `posicoes_jogaveis` | TEXT[] | Array de posições que joga |
| `descricao_jogo` | TEXT | Descrição do estilo de jogo |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de última atualização |

### Exemplo de Registro

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "auth_user_id": "987fcdeb-51a2-43f7-8d9e-7c9a5f6e4b3d",
  "nome_discord": "jogador#1234",
  "nome_roblox": "ProPlayer99",
  "lvl": 75,
  "posicao_principal": "Atacante",
  "posicoes_jogaveis": ["Atacante", "Ponta", "Meio Campo"],
  "descricao_jogo": "Jogo focado em velocidade e finalização. Tenho 3 anos de experiência...",
  "created_at": "2025-12-11T10:30:00Z",
  "updated_at": "2025-12-11T10:30:00Z"
}
```

---

## 🐛 Debugging

### Verificar Logs no Console

Todos os processos importantes são logados no console:

```javascript
// Abra DevTools (F12) e veja:
console.log('📝 Iniciando cadastro...');        // Início do cadastro
console.log('✅ Usuário criado:', userId);       // Sucesso no auth
console.log('✅ Dados salvos:', jogador);        // Sucesso no banco
console.log('❌ Erro:', error);                  // Erros
```

### Erros Comuns

**1. "Invalid API key"**
- Verifique se copiou corretamente as credenciais em `config.js`

**2. "User already registered"**
- O Discord name já foi cadastrado
- Use outro nome ou delete o usuário anterior no Supabase

**3. "Invalid login credentials"**
- Discord name ou senha incorretos
- Verifique se digitou exatamente como cadastrou

**4. "Failed to fetch"**
- Problema de conexão com Supabase
- Verifique sua internet
- Verifique se a URL do Supabase está correta

**5. "Row Level Security policy violation"**
- As policies do banco não estão corretas
- Execute novamente o SQL de criação da tabela

---

## 📱 Responsividade

O sistema é totalmente responsivo:
- Desktop: Layout com 2 colunas no cadastro
- Tablet: Layout adaptado
- Mobile: Layout em coluna única

---

## 🎨 Personalização

### Mudar Cores

Edite `styles.css`:

```css
/* Gradiente de fundo */
background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #581c87 100%);

/* Cor primária dos botões */
background: linear-gradient(90deg, #2563eb, #9333ea);

/* Cor dos inputs */
background: #1e293b;
border-color: #334155;
```

### Adicionar Logo

Substitua em `index.html` e `reset-password.html`:

```html
<img src="caminho/para/sua/logo.png" alt="Protocol Omega 3.0" class="logo-img">
```

---

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

---

## 💬 Suporte

Se tiver dúvidas:
1. Verifique os logs do console (F12)
2. Leia os comentários no código (estão bem detalhados)
3. Consulte a documentação do Supabase: https://supabase.com/docs

---

**Protocol Omega 3.0** - Sistema de Recrutamento de Elite 🎮⚽