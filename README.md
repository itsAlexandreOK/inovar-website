# Comunica Net - Sistema de Gestão de Clientes

Sistema completo com autenticação, dashboard, gerenciamento de câmeras e teste de velocidade de internet.

## 🚀 Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **NextAuth.js** - Autenticação
- **PostgreSQL** - Banco de dados
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta Google (para OAuth)

## 🔧 Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/itsAlexandreOK/inovar-website.git
cd inovar-website
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Configure o banco de dados:
```bash
npx prisma migrate deploy
npx prisma generate
```

5. Inicie o servidor:
```bash
npm run dev
```

## 🌐 Deploy no Vercel

### 1. Acesse o Vercel
- Vá para [vercel.com](https://vercel.com)
- Faça login com GitHub

### 2. Importe o Projeto
- Clique em "Add New Project"
- Selecione: `itsAlexandreOK/inovar-website`
- Clique em "Import"

### 3. Configure as Variáveis de Ambiente
Adicione estas variáveis no Vercel:

```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://seu-dominio.vercel.app
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
EMAIL_FROM=Seu Nome <seu-email@gmail.com>
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### 4. Configure o Banco de Dados (Vercel Postgres)
- No dashboard do projeto, vá em "Storage"
- Clique em "Create Database"
- Selecione "Postgres"
- A `DATABASE_URL` será adicionada automaticamente

### 5. Execute as Migrações
No terminal local:
```bash
npx prisma migrate deploy
```

### 6. Deploy
- Clique em "Deploy"
- Aguarde o build completar
- Seu site estará no ar! 🎉

## 📝 Variáveis de Ambiente Necessárias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXTAUTH_SECRET` | Chave secreta do NextAuth | Gerar com `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL da aplicação | https://seu-site.vercel.app |
| `GOOGLE_CLIENT_ID` | ID do Google OAuth | xxx.apps.googleusercontent.com |
| `GOOGLE_CLIENT_SECRET` | Secret do Google OAuth | GOCSPX-xxx |
| `DATABASE_URL` | URL do PostgreSQL | postgresql://... |
| `SMTP_*` | Configuração de email | Gmail ou outro SMTP |

## 🎯 Funcionalidades

- ✅ Autenticação com Google OAuth
- ✅ Sistema de registro com verificação por email
- ✅ Dashboard com navegação animada
- ✅ Gerenciamento de câmeras RTSP
- ✅ Teste de velocidade de internet real (download via CDN)
- ✅ Sistema de perfil de usuário

## 📦 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção
npm run dev:backend  # Inicia servidor Express (câmeras)
```

## 📄 Licença

Este projeto está sob a licença MIT.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
