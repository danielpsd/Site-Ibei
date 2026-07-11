# Igreja Batista Ebenézer de Ivinhema - TODO

## Landing Page
- [x] Hero section com imagem cinematográfica e missão
- [x] Seção "Quem Somos" com história da igreja
- [x] Seção "Ministérios" com cards dos ministérios
- [x] Seção "Eventos" com próximos eventos
- [x] Seção "Mural Palavra" com vídeos YouTube e PDFs
- [x] Seção "Galeria de Fotos" com fotos dos cultos
- [x] Navbar com logo IBEI e navegação
- [x] Footer com informações de contato

## Admin Panel
- [x] Dashboard com sidebar navigation
- [x] Autenticação OAuth Manus
- [x] Proteção de rota /admin (apenas admin)
- [x] Estatísticas em tempo real (Membros/Visitantes/Convertidos)
- [x] 8 abas funcionais (Geral/Membros/Visitantes/Convertidos/Aniversários/Métricas/Eventos/Financeiro)

## Member Management
- [x] Formulário de cadastro com 3 abas (Básico/Pessoal/Religioso)
- [x] Validação de CPF/RG/Telefone com Zod
- [x] Listagem de membros em tabela
- [x] Página de detalhe do membro com 5 abas
- [x] Ativar/desativar membro
- [x] Deletar membro

## Visitor Management
- [x] Formulário de cadastro de visitantes
- [x] Listagem de visitantes em tabela
- [x] Deletar visitante

## Convert Management
- [x] Formulário de cadastro de convertidos
- [x] Listagem de convertidos em tabela
- [x] Deletar convertido

## Security & Performance
- [x] Helmet.js para headers HTTP
- [x] Rate Limiting (100 req/15min)
- [x] CORS configurado
- [x] Validação de inputs com Zod
- [x] Sanitização de inputs
- [x] Request timeout (30s)
- [x] Trust proxy configurado
- [x] HSTS habilitado
- [x] CSP configurado

## Navigation & UX
- [x] Botão "Sou Membro" redireciona para login
- [x] Botão "Painel Admin" visível para usuários autenticados
- [x] Remover redirecionamento automático para /admin
- [x] Botão "Voltar para Site" no painel admin
- [x] Adicionar logotipo IBEI ao navbar
- [x] Remover seção de Planos do site público
- [x] Reorganizar painel admin com duas páginas (Gestão e Publicações)
- [x] Adicionar botões para Galeria de Fotos e Mural Palavra no painel

## Backend & Database
- [x] Schema Drizzle com tabelas (members, visitors, converts)
- [x] tRPC procedures para CRUD de membros
- [x] tRPC procedures para CRUD de visitantes
- [x] tRPC procedures para CRUD de convertidos
- [x] Notificações automáticas para novos cadastros

## Testing
- [x] 12 testes vitest passando (auth + CRUD)

## Próximas Etapas (Opcional)
- [ ] Implementar backend para Galeria de Fotos (upload e listagem)
- [ ] Implementar backend para Mural Palavra (salvar links YouTube e PDFs)
- [ ] Integração com S3 para upload de mídias
- [ ] Implementar funcionalidade de eventos (criar/editar/deletar)
- [ ] Implementar funcionalidade de financeiro (doações/despesas)
- [ ] Relatórios e exportação de dados
- [ ] Deployment na GoDaddy cPanel
