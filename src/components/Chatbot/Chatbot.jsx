import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import styles from "./Chatbot.module.css";

export default function Chatbot({ isDarkMode }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Olá! Sou o assistente do Blog Jardim. Como posso ajudá-lo hoje?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Verifica se o usuário está logado
  const isLoggedIn = user || localStorage.getItem("user");

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focar no input quando abrir o chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Buscar posts da API para enviar como contexto
  const fetchPostsForContext = async () => {
    try {
      const response = await axios.get("https://blogjardim.onrender.com/posts");
      return response.data.map((post) => ({
        id: post.id,
        titulo: post.titulo,
        conteudo: post.conteudo,
        url: `${window.location.origin}/post-details/${post.id}`,
      }));
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      return [];
    }
  };

  // Enviar mensagem para o n8n
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Adiciona mensagem do usuário
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // URL do webhook do n8n - pode ser configurada via variável de ambiente
    // Para usar variável de ambiente, crie um arquivo .env na raiz do projeto com:
    // VITE_N8N_WEBHOOK_URL=https://amandalisboa.app.n8n.cloud/webhook-test/4b849bb2-2ed8-474c-bf84-5007a028f7cd
    const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

    if (!N8N_WEBHOOK_URL) {
      console.error(
        "VITE_N8N_WEBHOOK_URL não está definido. Verifique seu arquivo .env."
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Configuração do assistente incompleta. Informe ao responsável que falta a variável VITE_N8N_WEBHOOK_URL.",
          error: true,
        },
      ]);
      return;
    }

    try {
      // Busca posts para contexto
      const posts = await fetchPostsForContext();

      // Monta o contexto dos posts
      const postsContext = posts
        .map(
          (post) =>
            `Título: ${post.titulo}\nConteúdo: ${post.conteudo.substring(
              0,
              500
            )}...`
        )
        .join("\n\n---\n\n");

      // Monta o prompt completo conforme especificação
      const systemPrompt = `Você é um assistente do Blog Jardim. Baseie a resposta somente nos posts passados no contexto.
Responda em até 200 palavras de forma direta, com instruções práticas quando aplicável.
Ao final, liste até 3 posts relevantes com título e link, em formato JSON:
{ "references": [ { "title": "...", "url": "..." } ] }
Se não houver posts relevantes, responda: "Não encontrei posts que respondam à sua dúvida."
Porém, se não encontrar algo específico nos posts, ainda assim traga alguma ideia básica para sanar a dúvida da pessoa.`;

      const fullPrompt = `${systemPrompt}\n\nContexto dos posts:\n\n${postsContext}\n\nPergunta do usuário: ${userMessage}`;

      // Payload a ser enviado
      const payload = {
        message: userMessage,
        prompt: fullPrompt,
        posts: posts,
      };

      console.log("=== Enviando mensagem para webhook ===");
      console.log("URL:", N8N_WEBHOOK_URL);
      console.log("Método: POST");
      console.log("Payload:", payload);

      // Envia para o n8n via POST
      const response = await axios.post(
        N8N_WEBHOOK_URL,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 segundos de timeout
        }
      );

      console.log("Resposta recebida:", response.data);

      // Processa a resposta
      let assistantMessage =
        response.data.response ||
        response.data.message ||
        response.data.answer ||
        response.data.reasoning ||
        response.data.fallback_answer ||
        "";

      if (
        response.data.fallback_answer &&
        (!response.data.found_match ||
          (response.data.reasoning &&
            assistantMessage?.trim() === response.data.reasoning.trim()))
      ) {
        assistantMessage = response.data.fallback_answer;
      }

      // Tenta extrair JSON de referências se existir
      let references = [];
      if (assistantMessage) {
        try {
          const jsonMatch = assistantMessage.match(
            /\{[\s\S]*"references"[\s\S]*\}/
          );
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0]);
            references = jsonData.references || [];
            // Remove o JSON da mensagem para exibir apenas o texto
            assistantMessage = assistantMessage
              .replace(/\{[\s\S]*"references"[\s\S]*\}/, "")
              .trim();
          }
        } catch {
          console.log("Não foi possível extrair referências JSON");
        }
      }

      // Fallback: quando o fluxo só retorna metadados do post
      if (!assistantMessage && response.data.found_match) {
        const bestPost = posts.find(
          (post) => String(post.id) === String(response.data.best_post_id)
        );

        if (bestPost) {
          assistantMessage = `Encontrei um conteúdo que pode ajudar: "${bestPost.titulo}". Aqui vai um resumo:\n\n${bestPost.conteudo.substring(
            0,
            500
          )}...`;

          references = [
            {
              title: bestPost.titulo,
              url: bestPost.url,
            },
          ];
        }
      }

      if (!assistantMessage) {
        assistantMessage = "Desculpe, não consegui processar sua mensagem.";
      }

      // Adiciona mensagem do assistente
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantMessage,
          references: references,
        },
      ]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      
      // Mensagem de erro mais específica baseada no tipo de erro
      let errorMessage = "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.";
      
      if (error.code === "ERR_NETWORK" || error.message.includes("ERR_CONNECTION_REFUSED") || error.code === "ECONNREFUSED") {
        errorMessage = `Não foi possível conectar ao servidor n8n. Verifique se o webhook está acessível em ${N8N_WEBHOOK_URL}`;
        console.error("=== ERRO DE CONEXÃO ===");
        console.error("URL tentada:", N8N_WEBHOOK_URL);
        console.error("Método: POST");
        console.error("Erro:", error.message);
        console.error("\n🔍 VERIFICAÇÕES NECESSÁRIAS:");
        console.error(`1. O n8n está rodando? Acesse ${new URL(N8N_WEBHOOK_URL).origin} no navegador`);
        console.error("2. O webhook está ativo no n8n?");
        console.error("3. A URL do webhook está correta?");
        console.error("4. Não há firewall ou bloqueio de rede?");
        console.error("DICA: Teste o webhook diretamente com:");
        console.error(`   curl -X POST ${N8N_WEBHOOK_URL} -H "Content-Type: application/json" -d '{"message":"teste"}'`);
        console.error("COMO ENCONTRAR A URL DO WEBHOOK:");
        console.error(`1. Acesse ${new URL(N8N_WEBHOOK_URL).origin}`);
        console.error("2. Abra o workflow que contém o webhook");
        console.error("3. Clique no nó do webhook");
        console.error("4. Copie a URL que aparece (geralmente /webhook/... ou /webhook-test/...)");
        console.error(`5. A URL completa será: ${new URL(N8N_WEBHOOK_URL).origin} + URL do webhook`);
      } else if (error.response) {
        // Erro de resposta do servidor
        errorMessage = `Erro do servidor (${error.response.status}): ${error.response.statusText}`;
        console.error("Resposta do servidor:", error.response.data);
      } else if (error.request) {
        // Requisição foi feita mas não houve resposta
        errorMessage = "O servidor não respondeu. Verifique sua conexão e tente novamente.";
        console.error("Nenhuma resposta recebida do servidor");
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Se não estiver logado, não renderiza
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.chatbotContainer}>
      {/* Botão para abrir/fechar o chat */}
      <button
        className={`${styles.chatbotToggle} ${isDarkMode ? styles.dark : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chatbot"
      >
        {isOpen ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span className={styles.chatbotToggleText}>
          {isOpen ? "Fechar Assistente" : "Assistente"}
        </span>
      </button>

      {/* Janela do chat */}
      {isOpen && (
        <div
          className={`${styles.chatbotWindow} ${isDarkMode ? styles.dark : ""}`}
        >
          <div className={styles.chatbotHeader}>
            <h3 className={styles.chatbotTitle}>Assistente do Blog Jardim</h3>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Fechar chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${styles[message.role]}`}
              >
                <div className={styles.messageContent}>{message.content}</div>

                {/* Exibe referências de posts se houver */}
                {message.references && message.references.length > 0 && (
                  <div className={styles.references}>
                    <strong>Posts relacionados:</strong>
                    <ul className={styles.referencesList}>
                      {message.references.map((ref, refIndex) => (
                        <li key={refIndex}>
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.referenceLink}
                          >
                            {ref.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageContent}>
                  <span className={styles.typingIndicator}>Digitando...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className={styles.chatbotInputForm} onSubmit={sendMessage}>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua pergunta..."
              className={styles.chatbotInput}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!inputMessage.trim() || isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
