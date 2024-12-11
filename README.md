## WhatsApp API

Este projeto utiliza a biblioteca [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) para interagir com o WhatsApp Web e criar uma API que possibilita o envio e recebimento de mensagens, bem como o gerenciamento de mídias enviadas e recebidas.

## Funcionalidades

- Conexão ao WhatsApp Web com autenticação local.
- Envio e recebimento de mensagens de texto.
- Download e armazenamento de mídias (imagens, documentos e áudios).
- API para envio de mensagens via requisição HTTP.
- Logs de erros e tratamento de exceções.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [npm](https://www.npmjs.com/)
- [PM2](https://pm2.keymetrics.io/)

## Configuração do Ambiente

1. Clone este repositório:

```bash
git clone https://github.com/felixmoreira/projeto-whatsapp-api.git
cd projeto-whatsapp-api
```

2. Instale as dependências:

```bash
npm install
```

3. Crie os diretórios necessários para armazenar dados, mídias e erros:

Os diretórios `dados`, `arquivos` e `erros` serão criados automaticamente ao executar o projeto pela primeira vez.

## Scripts do Projeto

- **`install.bat`**: Instala as dependências do projeto.
- **`start.bat`**: Inicia a aplicação usando o gerenciador de processos PM2.
- **`stop.bat`**: Para a aplicação usando o PM2.
- **`logs.bat`**: Exibe os logs da aplicação no PM2.

### Executar os Scripts no Windows

Basta clicar duas vezes nos arquivos `.bat` ou executá-los via terminal:

```bash
./install.bat
./start.bat
./logs.bat
```

## Uso da API

### Envio de Mensagens

Endpoint: `POST /send-message`

#### Parâmetros:

- `phoneNumber`: Número de telefone no formato internacional (sem símbolos ou espaços).
- `message`: Texto da mensagem.

#### Exemplo de Requisição:

```bash
curl -X POST http://localhost:3000/send-message \
-H "Content-Type: application/json" \
-d '{
  "phoneNumber": "5511999999999",
  "message": "Olá, esta é uma mensagem de teste!"
}'
```

#### Resposta:

```json
{
  "success": true,
  "message": "Message sent successfully",
  "response": { ... }
}
```

### Redirecionamento para GitHub

Acesse o endpoint raiz (`GET /`) para ser redirecionado para o repositório no GitHub.

## Estrutura do Projeto

- **`app.js`**: Arquivo principal que contém a lógica da API e integração com o WhatsApp.
- **`public/`**: Pasta para arquivos estáticos (caso necessário).
- **`dados/`**: Armazena mensagens de texto em arquivos JSON.
- **`arquivos/`**: Armazena mídias baixadas.
- **`erros/`**: Armazena logs de erros.

## Tratamento de Erros

Todos os erros não tratados são registrados no arquivo `erros/erros.log` com informações detalhadas sobre o erro e timestamp.

## Execução em Produção

Use o PM2 para gerenciar a aplicação:

- Iniciar a aplicação:

```bash
pm2 start app.js
```

- Parar a aplicação:

```bash
pm2 stop app.js
```

- Verificar logs:

```bash
pm2 logs
```

### Dúvidas?

Para mais informações, acesse o repositório no [GitHub](https://github.com/felixmoreira/projeto-whatsapp-api) ou entre em contato pelo [LinkedIn](https://www.linkedin.com/in/felixms).

