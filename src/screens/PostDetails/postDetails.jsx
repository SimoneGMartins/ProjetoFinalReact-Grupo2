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
  
  
  const API_URL = 'https://69112ffd7686c0e9c20cae72.mockapi.io/posts';

  useEffect(() => {
    axios.get('https://69112ffd7686c0e9c20cae72.mockapi.io/posts')
      .then(response => setPost(response.data))
      .catch(error => console.error('Error ao buscar post:', error));

    axios.get('https://69112ffd7686c0e9c20cae72.mockapi.io/posts')
      .then(response => {
        setComments(response.data);
      })
      .catch(error => console.error('Error ao buscar comments:', error));
  }, [id]);

  const handleNewComment = (e) => {
    e.preventDefault();
    const commentData = {
      body: newComment,
      postId: id,
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
    setIsLoggedIn(true); 
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
    <div className={styles.container}>
        <div className={styles.contentWrapper}> 
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.bodyText}>{post.body}</p> 
                                       
           <div> 
                <h2 className={styles.commentsTitle}>Lista Comentarios</h2>
                <h3 className={styles.commentsCount}>Comentarios ({comments.length})</h3>
            </div>
          
            <ul>
        {comments.map(comment => (
        <li key={comment.id} className={styles.commentItem}> 
            <div className={styles.commentBody}>
                {comment.body} - por **{comment.name}**
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
            {!isLoggedIn && <p>Você precisa estar logado para comentar.</p>}
            <button onClick={handleLogin} className={styles["btn-login-detalhes"]} >Login</button>
        </div>
    </div>
);
};

export default PostDetails;





