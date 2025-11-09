import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './home.module.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filterType, setFilterType] = useState('title');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Verificar se está logado
  const isLoggedIn = localStorage.getItem('user');

  // Buscar posts da API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        
        // Buscar dados dos usuários para ter os nomes dos autores
        const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
        const users = usersResponse.data;
        
        // Combinar posts com informações dos autores
        const postsWithAuthors = response.data.map(post => {
          const author = users.find(user => user.id === post.userId);
          return {
            ...post,
            authorName: author ? author.name : 'Autor Desconhecido'
          };
        });

        setPosts(postsWithAuthors);
        setFilteredPosts(postsWithAuthors);
        setDisplayedPosts(postsWithAuthors.slice(0, 5));
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filtrar posts
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts);
      setDisplayedPosts(posts.slice(0, visibleCount));
      return;
    }

    const filtered = posts.filter(post => {
      if (filterType === 'title') {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return post.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });

    setFilteredPosts(filtered);
    setDisplayedPosts(filtered.slice(0, visibleCount));
  }, [searchTerm, filterType, posts, visibleCount]);

  // Carregar mais posts
  const handleLoadMore = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setVisibleCount(prev => prev + 5);
    setDisplayedPosts(filteredPosts.slice(0, visibleCount + 5));
  };

  // Fechar modal
  const closeModal = () => {
    setShowLoginModal(false);
  };

  // Ir para login
  const goToLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header da página */}
      <div className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>Todos os posts</h1>
          <span className={styles.resultCount}>{filteredPosts.length} resultados</span>
        </div>
        
        {isLoggedIn && (
          <Link to="/create-post" className={styles.newPostButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Novo post
          </Link>
        )}
      </div>

      {/* Filtros */}
      <div className={styles.filterSection}>
        <div className={styles.filterControls}>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="title">Filtrar por Título</option>
            <option value="author">Filtrar por Autor</option>
          </select>

          <input
            type="text"
            placeholder={`Buscar por ${filterType === 'title' ? 'título' : 'autor'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.filterInput}
          />

          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className={styles.clearButton}
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Lista de posts */}
      <div className={styles.postsGrid}>
        {displayedPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>Nenhum post encontrado</h3>
            <p>Tente ajustar os filtros ou criar um novo post</p>
          </div>
        ) : (
          displayedPosts.map((post) => (
            <article key={post.id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <span className={styles.postBadge}>Publicado</span>
              </div>

              <h2 className={styles.postTitle}>{post.title}</h2>

              <div className={styles.postMeta}>
                <div className={styles.authorInfo}>
                  <div className={styles.authorAvatar}>
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <p className={styles.authorName}>{post.authorName}</p>
                    <p className={styles.postDate}>
                      {new Date().toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <p className={styles.postExcerpt}>
                {post.body.substring(0, 150)}...
              </p>

              <Link 
                to={`/post/${post.id}`}
                className={styles.readMoreButton}
              >
                Read More
              </Link>
            </article>
          ))
        )}
      </div>

      {/* Botão Ver Mais */}
      {displayedPosts.length < filteredPosts.length && (
        <div className={styles.loadMoreSection}>
          <button 
            onClick={handleLoadMore}
            className={styles.loadMoreButton}
          >
            Ver mais posts
          </button>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Login Necessário</h3>
              <button onClick={closeModal} className={styles.closeButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>Você precisa estar logado para ver mais posts.</p>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={goToLogin} className={styles.loginButton}>
                Fazer Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;