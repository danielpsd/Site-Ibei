#!/bin/bash

# 🚀 Script de Deploy - Igreja Batista Ebenézer de Ivinhema
# Este script automatiza o processo de publicação na GoDaddy

set -e

echo "=========================================="
echo "🚀 DEPLOY - Igreja Batista Ebenézer"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações
REMOTE_USER=${REMOTE_USER:-"seu-usuario"}
REMOTE_HOST=${REMOTE_HOST:-"seu-dominio.com"}
REMOTE_PATH=${REMOTE_PATH:-"/home/$REMOTE_USER/public_html"}
BACKUP_DIR="./backups"

# Funções
print_step() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Passo 1: Verificar ambiente
echo -e "\n${YELLOW}Passo 1: Verificando ambiente...${NC}"

if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado!"
    exit 1
fi
print_step "package.json encontrado"

if [ ! -f ".env.production" ]; then
    print_warning ".env.production não encontrado - usando .env"
fi
print_step "Variáveis de ambiente OK"

# Passo 2: Build
echo -e "\n${YELLOW}Passo 2: Fazendo build...${NC}"

if [ -d "dist" ]; then
    rm -rf dist
    print_step "Limpado diretório dist anterior"
fi

pnpm build
print_step "Build concluído com sucesso"

# Passo 3: Criar backup local
echo -e "\n${YELLOW}Passo 3: Criando backup local...${NC}"

mkdir -p $BACKUP_DIR
BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf $BACKUP_FILE dist/ node_modules/ package.json pnpm-lock.yaml 2>/dev/null || true
print_step "Backup criado: $BACKUP_FILE"

# Passo 4: Conectar via SSH e fazer deploy
echo -e "\n${YELLOW}Passo 4: Fazendo upload para servidor...${NC}"

# Verificar se SSH está configurado
if ! ssh -o ConnectTimeout=5 $REMOTE_USER@$REMOTE_HOST "echo 'SSH OK'" > /dev/null 2>&1; then
    print_error "Não foi possível conectar via SSH"
    print_warning "Configure SSH sem senha ou use: ssh-copy-id $REMOTE_USER@$REMOTE_HOST"
    exit 1
fi
print_step "Conexão SSH OK"

# Fazer backup remoto
echo "Fazendo backup remoto..."
ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz . 2>/dev/null || true"
print_step "Backup remoto criado"

# Upload do build
echo "Fazendo upload dos arquivos..."
scp -r dist/* $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/dist/ 2>/dev/null || true
print_step "Arquivos de build enviados"

# Upload de dependências
echo "Instalando dependências no servidor..."
ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && pnpm install --production"
print_step "Dependências instaladas"

# Passo 5: Configurar variáveis de ambiente
echo -e "\n${YELLOW}Passo 5: Configurando variáveis de ambiente...${NC}"

if [ -f ".env.production" ]; then
    scp .env.production $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/.env
    print_step "Variáveis de ambiente configuradas"
else
    print_warning "Lembre-se de configurar .env no servidor!"
fi

# Passo 6: Reiniciar aplicação
echo -e "\n${YELLOW}Passo 6: Reiniciando aplicação...${NC}"

ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && pm2 restart church-site || pm2 start dist/index.js --name 'church-site'"
print_step "Aplicação reiniciada"

# Passo 7: Verificar status
echo -e "\n${YELLOW}Passo 7: Verificando status...${NC}"

sleep 2

if ssh $REMOTE_USER@$REMOTE_HOST "pm2 list | grep church-site | grep online" > /dev/null; then
    print_step "Aplicação está online!"
else
    print_error "Aplicação não está respondendo"
    print_warning "Verifique os logs: ssh $REMOTE_USER@$REMOTE_HOST 'pm2 logs church-site'"
    exit 1
fi

# Passo 8: Teste de conectividade
echo -e "\n${YELLOW}Passo 8: Testando conectividade...${NC}"

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://seu-dominio.com.br)
if [ "$RESPONSE" = "200" ]; then
    print_step "Site respondendo corretamente (HTTP $RESPONSE)"
else
    print_warning "Site retornou HTTP $RESPONSE (esperado 200)"
fi

# Resumo
echo -e "\n${GREEN}=========================================="
echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
echo "==========================================${NC}"
echo ""
echo "Informações:"
echo "  • Domínio: seu-dominio.com.br"
echo "  • Servidor: $REMOTE_HOST"
echo "  • Caminho: $REMOTE_PATH"
echo "  • Backup: $BACKUP_FILE"
echo ""
echo "Próximos passos:"
echo "  1. Verifique o site em https://seu-dominio.com.br"
echo "  2. Teste login e funcionalidades"
echo "  3. Verifique logs: ssh $REMOTE_USER@$REMOTE_HOST 'pm2 logs church-site'"
echo ""
echo "Para rollback:"
echo "  ssh $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_PATH && tar -xzf backup-YYYYMMDD-HHMMSS.tar.gz && pm2 restart church-site'"
echo ""

# Opcional: Abrir site no navegador
read -p "Deseja abrir o site no navegador? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    open https://seu-dominio.com.br || xdg-open https://seu-dominio.com.br || echo "Abra https://seu-dominio.com.br manualmente"
fi
