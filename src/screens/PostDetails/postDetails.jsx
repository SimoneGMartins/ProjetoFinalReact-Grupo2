import React from 'react'
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './post.module.css'

const PostDetails = () => {
const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, seUserName]= useState ('Usuario Anonimo');

   const API_URL_COMMENTS = 'https://69112ffd7686c0e9c20cae72.mockapi.io/comments';
   const API_URL = 'https://69112ffd7686c0e9c20cae72.mockapi.io/posts';

useEffect(() => { 
  axios.get(`${API_URL}/${id}`)
    .then(response => setPost(response.data))
    .catch(error => console.error('Erro ao buscar post:', error));

  axios.get('https://69112ffd7686c0e9c20cae72.mockapi.io/posts')
    .then(response => {
      setComments(response.data);
    })
    .catch(error => console.error('Erro ao buscar comentários:', error));
    axios.get(`https://69112ffd7686c0e9c20cae72.mockapi.io/posts/${id}/comments`)

}, [id]); 

  const handleNewComment = (e) => {
    e.preventDefault();
    console.log('Botão Comentar Clicado .Enviando dados...')
    const commentData = {
      body: newComment,
      postId: id,
      authorName:userName,
    };
    axios.post('https://69112ffd7686c0e9c20cae72.mockapi.io/posts', commentData)
      .then(response => {
        setComments([...comments, response.data]);
        setNewComment('');
      })
      //.catch(error => console.alert("Error ao enviar comentário:")); 
  };

  // eslint-disable-next-line no-unused-vars
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

const handleLogin = () => {
    console.log('Login Clicado')
    setIsLoggedIn(true); 
    setUserName  ('Nome do Usuário Logado');
};
  if (!post) return <div>Loading Post ......</div>

const toggleCommentLike = (commentId) => {
    const updatedComments = comments.map(comment => {    
        if (comment.id === commentId) {return {
                ...comment,
                isCommentLiked: !comment.isCommentLiked,
            };
        } return comment;
    }); setComments(updatedComments); 
};
  

return (
  <div className={styles["btn-login"]}>
  <div className={styles.container}>
        <div className={styles.contentWrapper}> 
                                       
           <div> 
                <h2 className={styles.commentsTitle}>Ler e Comentar</h2>
                <h3 className={styles.commentsCount}>Comentarios ({comments.length})</h3>
            </div>
            <hr style={{ margin: '30px 0', border: '1px solid #eee' }} />
                           <div className={styles.postTitleRepeated}> 
                         <strong>Título:</strong> 
                         <p>{post.title}</p>
                          </div>

                      <div className={styles.postBlockRepeated}>
                        <strong>Conteúdo:</strong>
                        <p>{post.body}</p> 

                        <button 
                           onClick={toggleLike} 
                           className={styles['post-like-button']} // Classe para estilizar
                           style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '30px', marginTop: '10px' }}>
                          <span role="img" aria-label="coração">
                           {isLiked ? '❤️' : '🤍'} 
                          </span>
                           </button>

              </div>
              <ul>
        {comments.map(comment => (
          <li key={comment.id} className={styles.commentItem}> 
                    
                    <hr style={{ margin: '15px 0', border: '1px dotted #ccc' }} /> 

                      <div className={styles.commentBody}>
                      <strong></strong>

                {comment.body} -{comment.authorName}
            </div>
            <button onClick={() => toggleCommentLike(comment.id)}
                className={styles['comment-like-button']}style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '30px' }}>
                <span role="img" aria-label="coração" className={comment.isCommentLiked ? styles['comment-heart-icon'] : ''} >
                    {comment.isCommentLiked ? '❤' : '🤍'} 
                </span>
                </button>
               </li>
                 ))}
                </ul>
            
            {isLoggedIn && (
              <form onSubmit={handleNewComment} className={styles.commentForm}>
                    <textarea 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        placeholder="Adicionar um comentario...." 
                        required 
                        className={styles.commentTextarea}
                        />
                    <button type="submit">Comentar</button> 
                </form>
            )}           
            {!isLoggedIn && <p>Você precisa aperta + para comentar.</p>}
            <button onClick={handleLogin} className={styles["btn-login-detalhes"]} >  ✏️  </button>
        </div>
    </div>
</div>
);
};

export default PostDetails;





