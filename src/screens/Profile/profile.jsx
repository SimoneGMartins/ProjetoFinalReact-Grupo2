/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./profile.module.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const API_USERS = "https://6910d54c7686c0e9c20bd4c8.mockapi.io/users";
  const API_POSTS = "https://blogjardim.onrender.com/posts";

  const [form, setForm] = useState({
    name: "",
    email: "",
    birthDate: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  // Observar mudanças no dark mode
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Buscar dados do usuário
  useEffect(() => {
    if (!user) return;

    axios
      .get(`${API_USERS}/${user.id}`)
      .then((res) => {
        setForm({
          name: res.data.name,
          email: res.data.email,
          birthDate: res.data.birthDate,
          phone: res.data.phone,
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Buscar posts do usuário
  useEffect(() => {
    if (!user) return;

    axios
      .get(API_POSTS)
      .then((res) => {
        // Filtrar apenas os posts do usuário logado
        const userPosts = res.data.filter(
          (post) => post.email === user.email || post.autor === user.nome
        );
        setPosts(userPosts);
      })
      .catch((err) => console.error("Erro ao buscar posts:", err))
      .finally(() => setLoadingPosts(false));
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();

    axios
      .put(`${API_USERS}/${user.id}`, form)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          alert("Perfil atualizado com sucesso!");
          localStorage.setItem("user", JSON.stringify(res.data));
          setUser(res.data);
          setForm(res.data);
        }
      })
      .catch(() => {
        alert("Erro ao atualizar perfil.");
      });
  }

  function handleDelete(postId) {
    if (!window.confirm("Tem certeza que deseja excluir este post?")) return;

    axios
      .delete(`${API_POSTS}/${postId}`)
      .then(() => {
        setPosts(posts.filter((post) => post.id !== postId));
        alert("Post excluído com sucesso!");
      })
      .catch((err) => {
        console.error("Erro ao excluir post:", err);
        alert("Erro ao excluir post.");
      });
  }

  // Se não estiver logado
  if (!user) {
    return (
      <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
        <div className={styles.notLogged}>
          <p>Você precisa estar logado.</p>
          <button onClick={() => navigate("/login")}>Ir para Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      <div className={styles.content}>
        {/* Formulário de edição de perfil */}
        <form className={styles.card} onSubmit={handleSave}>
          <h2>Editar perfil</h2>

          <div className={styles.formGroup}>
            <label>Nome</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Data de nascimento</label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label>Telefone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.save}>
              💾 Salvar alterações
            </button>

            <button
              type="button"
              className={styles.cancel}
              onClick={() => navigate("/")}
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* Seção de posts do usuário */}
        <div className={styles.postsSection}>
          <h2 className={styles.postsTitle}>Seus Posts</h2>

          {loadingPosts ? (
            <p className={styles.loading}>Carregando posts...</p>
          ) : posts.length === 0 ? (
            <p className={styles.empty}>Você ainda não criou nenhum post.</p>
          ) : (
            <div className={styles.postsList}>
              {posts.map((post) => (
                <div key={post.id} className={styles.postItem}>
                  <div className={styles.postContent}>
                    <h3 className={styles.postTitle}>{post.titulo}</h3>
                    <p className={styles.postBody}>
                      {post.conteudo?.substring(0, 150)}...
                    </p>
                    <span className={styles.postDate}>
                      {new Date(post.dataPublicacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className={styles.postActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => navigate(`/edit-post/${post.id}`)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(post.id)}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}