import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import styles from "./editPost.module.css";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Observar mudanças no dark mode
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Buscar post para editar
  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Se não estiver logado
  if (!user) {
    return (
      <div className={`${styles.editpostMessage} ${isDark ? styles.dark : ''}`}>
        <p>Você precisa estar logado para editar posts.</p>
        <button onClick={() => navigate("/login")}>Ir para Login</button>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className={`${styles.editpostContainer} ${isDark ? styles.dark : ''}`}>
        <p className={styles.editpostLoading}>Carregando post...</p>
      </div>
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .put(`https://jsonplaceholder.typicode.com/posts/${id}`, post)
      .then(() => {
        alert("Post atualizado com sucesso!");
        navigate("/profile");
      })
      .catch(() => alert("Erro ao atualizar post"));
  }

  return (
    <div className={`${styles.editpostContainer} ${isDark ? styles.dark : ''}`}>
      <div className={styles.editpostCard}>
        <h1>Editar Post</h1>
        <form onSubmit={handleSubmit}>
          <label>Título</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />

          <label>Conteúdo</label>
          <textarea
            name="body"
            value={post.body}
            onChange={handleChange}
            required
          />

          <div className={styles.editpostButtons}>
            <button
              type="button"
              className={styles.cancel}
              onClick={() => navigate("/profile")}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.save}>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}