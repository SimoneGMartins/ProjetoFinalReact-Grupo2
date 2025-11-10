import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.module.css"; // importa o CSS

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
      <div className="profile-message">
        <p>Você precisa estar logado para acessar seu perfil.</p>
        <button onClick={() => navigate("/login")}>Ir para Login</button>
      </div>
    );
  }

  if (loading) return <p className="profile-loading">Carregando posts...</p>;

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
    <div className="profile-container">
      <div className="profile-card">
        <h1>Perfil de {user.name || "Usuário"}</h1>
        <p className="profile-email">
          Email: {user.email || "exemplo@email.com"}
        </p>

        <h2>Seus Posts</h2>

        {posts.length === 0 ? (
          <p className="profile-empty">Nenhum post encontrado.</p>
        ) : (
          <div className="profile-posts">
            {posts.map((post) => (
              <div key={post.id} className="profile-post">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <div className="profile-post-actions">
                  <button
                    className="edit"
                    onClick={() => navigate(`/edit/${post.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(post.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
