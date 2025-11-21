import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./post.module.css";

export default function PostDetails() {
  const { id } = useParams();
  const API_BASE = "https://blogjardim.onrender.com";

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [userName] = useState("Usuário Anônimo");
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

  // Buscar post e comentários
  useEffect(() => {
    axios
      .get(`${API_BASE}/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("Erro ao carregar post:", err));

    axios
      .get(`${API_BASE}/posts/${id}/comentarios`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error("Erro ao carregar comentários:", err));

    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    setIsLiked(likedPosts.includes(id));
  }, [id]);

  // Loading
  if (!post) {
    return (
      <div className={`${styles.page} ${isDark ? styles.dark : ''}`}>
        <p className={styles.loading}>Carregando...</p>
      </div>
    );
  }

  function toggleLike() {
    if (isLiked) return;

    axios
      .post(`${API_BASE}/posts/${id}/amei`)
      .then(() => {
        axios.get(`${API_BASE}/posts/${id}`).then((res) => setPost(res.data));
        setIsLiked(true);

        const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
        localStorage.setItem("likedPosts", JSON.stringify([...likedPosts, id]));
      })
      .catch((err) => console.error("Erro ao dar amei:", err));
  }

  function toggleCommentLike(commentId) {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, liked: !c.liked } : c))
    );
  }

  function handleNewComment(e) {
    e.preventDefault();

    const commentData = {
      autor: userName,
      conteudo: newComment,
      email: "email@usuario.com",
      data_comentario: new Date(),
    };

    axios
      .post(`${API_BASE}/posts/${id}/comentarios`, commentData)
      .then((res) => {
        setComments((prev) => [...prev, res.data]);
        setNewComment("");
      })
      .catch((err) => console.error("Erro ao comentar:", err));
  }

  return (
    <div className={`${styles.page} ${isDark ? styles.dark : ''}`}>
      <div className={styles.container}>
        <div className={styles.postSection}>
          <h2 className={styles.title}>Post</h2>

          <h3 className={styles.postTitleRepeated}>{post.titulo}</h3>

          <div className={styles.postBlockRepeated}>
            <p>{post.conteudo}</p>
          </div>

          <button onClick={toggleLike} className={styles.likeBtn}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isLiked ? "red" : "none"}
              stroke="red"
              strokeWidth="2"
              style={{ marginRight: "6px" }}
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                       6 4 4 6.5 4c1.74 0 3.41 1 4.22 2.44h.56C12.09 5 
                       13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 
                       11.54L12 21.35z"
              />
            </svg>
            {post.quantidadeAmeis}
          </button>
        </div>

        <hr className={styles.divider} />

        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Comentários</h2>
          <p className={styles.commentsCount}>{comments.length} comentários</p>

          <ul className={styles.commentList}>
            {comments.map((comment) => (
              <li key={comment.id} className={styles.commentItem}>
                <div className={styles.commentBody}>
                  <strong>{comment.autor}</strong>
                  {comment.conteudo}
                </div>

                <button
                  onClick={() => toggleCommentLike(comment.id)}
                  className={styles.commentLikeBtn}
                >
                  {comment.liked ? "♥" : "♡"}
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleNewComment} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário..."
              required
              className={styles.commentTextarea}
            />
            <button type="submit">Comentar</button>
          </form>
        </div>
      </div>
    </div>
  );
}