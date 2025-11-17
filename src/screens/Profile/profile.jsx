import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from  "./profile.module.css"; // importa o CSS

export default function Profile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios
        .get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
        .then((res) => setPosts(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div className={styles["profile-message"]}>
        <p>Você precisa estar logado para acessar seu perfil.</p>
        <button onClick={() => navigate("/login")}>Ir para Login</button>
      </div>
    );
  }

  if (loading) return <p className={styles["profile-loading"]}>Carregando posts...</p>;

  function handleDelete(id) {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      axios
        .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then(() => {
          setPosts(posts.filter((p) => p.id !== id));
          alert("Post excluído com sucesso!");
        })
        .catch(() => alert("Erro ao excluir post"));
    }
  }

  return (
    <div className={styles["profile-container"]}>
      <div className={styles["profile-card"]}>
        <h1>Meu Perfil: {user.email || "exemplo@email.com"}</h1>
        <p className={styles["profile-email"]}>
        </p>

        <h1>Seus Posts</h1>

        {posts.length === 0 ? (
          <p className={styles["profile-empty"]}>Nenhum post encontrado.</p>
        ) : (
          <div className={styles["profile-posts"]}>
            {posts.map((post) => (
              <div key={post.id} className={styles["profile-post"]}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <div lassName={styles["profile-post-actions"]}>
                  <div className={styles["profile-post-actions"]}>
 <div className={styles["profile-post-actions"]}>
  <button
    className={styles["edit"]}
    onClick={() => navigate(`/edit-post/${post.id}`)}
  >
    Editar
  </button>
  <button
    className={styles["delete"]}
    onClick={() => handleDelete(post.id)}
  >
    Excluir
  </button>
</div>
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}