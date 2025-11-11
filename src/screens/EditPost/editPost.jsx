import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import styles from "./editPost.module.css"; 

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } =  useAuth();
  const [post, setPost] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (!user) {
    return (
      <div className="editpost-message">
        <p>Você precisa estar logado para editar posts.</p>
        <button onClick={() => navigate("/login")}>Ir para Login</button>
      </div>
    );
  }

  if (loading) return <p className="editpost-loading">Carregando post...</p>;

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
    <div className={styles["editpost-container"]}>
      <div className={styles["editpost-card"]}>
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

          <div className={styles["editpost-buttons"]}>
            <button
              type="button"
              className="cancel"
              onClick={() => navigate("/profile")}
            >
              Cancelar
            </button>
            <button type="submit" className="save">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
