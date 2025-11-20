# Guia de Configuração do Webhook n8n

## Problema: ERR_CONNECTION_REFUSED

Este erro indica que o aplicativo não consegue se conectar ao n8n em `http://localhost:5678`.

## Verificações Necessárias

### 1. Verificar se o n8n está rodando

Abra seu navegador e acesse:
```
http://localhost:5678
```

Se você ver a interface do n8n, está rodando. Se não, você precisa iniciar o n8n.

### 2. Iniciar o n8n (se não estiver rodando)

Se você instalou o n8n via npm:
```bash
npx n8n
```

Ou se instalou globalmente:
```bash
n8n start
```

### 3. Verificar se o webhook está ativo

1. Acesse o n8n em `http://localhost:5678`
2. Abra o workflow que contém o webhook
3. Verifique se o nó do webhook está ativo (não em modo "Test")
4. Certifique-se de que o workflow está ativo

### 4. Testar o webhook diretamente

Você pode testar o webhook usando curl ou Postman:

**Com curl (PowerShell):**
```powershell
curl -X POST http://localhost:5678/webhook-test/4b849bb2-2ed8-474c-bf84-5007a028f7cd `
  -H "Content-Type: application/json" `
  -d '{\"message\":\"teste\"}'
```

**Com Postman:**
- Método: POST
- URL: `http://localhost:5678/webhook-test/4b849bb2-2ed8-474c-bf84-5007a028f7cd`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "message": "teste",
  "prompt": "teste",
  "posts": []
}
```

### 5. Verificar a URL do webhook

A URL do webhook no código está configurada como:
```
http://localhost:5678/webhook-test/4b849bb2-2ed8-474c-bf84-5007a028f7cd
```

Certifique-se de que:
- A porta está correta (5678 é a padrão do n8n)
- O caminho do webhook está correto (`/webhook-test/...`)
- O ID do webhook está correto

### 6. Verificar CORS (se necessário)

Se você ainda tiver problemas, pode ser necessário configurar CORS no n8n. Adicione estas variáveis de ambiente ao iniciar o n8n:

```bash
N8N_CORS_ORIGIN=*
```

Ou mais específico:
```bash
N8N_CORS_ORIGIN=http://localhost:5173
```

(5173 é a porta padrão do Vite, ajuste se necessário)

## Estrutura do Payload Enviado

O chatbot envia o seguinte payload para o webhook:

```json
{
  "message": "mensagem do usuário",
  "prompt": "prompt completo com contexto",
  "posts": [
    {
      "id": 1,
      "titulo": "Título do post",
      "conteúdo": "Conteúdo do post...",
      "url": "http://localhost:5173/post-details/1"
    }
  ]
}
```

## Resposta Esperada

O webhook deve retornar um JSON com uma das seguintes estruturas:

```json
{
  "response": "Resposta do assistente...",
  "references": [
    {
      "title": "Título do post",
      "url": "http://localhost:5173/post-details/1"
    }
  ]
}
```

Ou:

```json
{
  "message": "Resposta do assistente..."
}
```

## Logs no Console

Quando você enviar uma mensagem, verifique o console do navegador (F12) para ver:
- A URL sendo chamada
- O payload sendo enviado
- A resposta recebida
- Erros detalhados (se houver)

## Solução de Problemas

### Erro: "ERR_CONNECTION_REFUSED"
- ✅ n8n não está rodando → Inicie o n8n
- ✅ Porta incorreta → Verifique se o n8n está na porta 5678
- ✅ Firewall bloqueando → Configure o firewall para permitir a porta 5678

### Erro: "CORS"
- ✅ Configure CORS no n8n (veja item 6 acima)

### Erro: "404 Not Found"
- ✅ URL do webhook incorreta → Verifique a URL no n8n
- ✅ Webhook não está ativo → Ative o workflow no n8n

### Erro: "Timeout"
- ✅ O workflow do n8n está demorando muito → Otimize o workflow
- ✅ Aumente o timeout no código (atualmente 30 segundos)

