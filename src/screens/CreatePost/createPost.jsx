import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./createPost.module.css";

const schema = yup.object({
  titulo: yup
    .string()
    .required("O título é obrigatório.")
    .min(3, "O título deve ter pelo menos 3 caracteres."),
  conteudo: yup
    .string()
    .required("O conteúdo é obrigatório.")
    .min(10, "O conteúdo deve ter pelo menos 10 caracteres."),
});

export default function CreatePost() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { titulo: "", conteudo: "" },
  });

  const onSubmit = async (data) => {
    // cons para recupera o usuário logado
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("Você precisa estar logado para criar um post!");
      navigate("/login");
      return;
    }

    try {
      await axios.post("https://blogjardim.onrender.com/posts", {
        titulo: data.titulo,
        conteudo: data.conteudo,
        autor: user.nome || "Usuário Anônimo",
        email: user.email,
        dataPublicacao: new Date().toISOString().split("T")[0],
        quantidadeAmeis: 0
      });

      toast.success("Post criado com sucesso!");
      reset();
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar o post.");
    }
  };

  return (
    <div className={styles.createPostWrapper}>
      <div className={styles.createPostCard}>
        <h1 className={styles.createPostTitle}>Criar Novo Post</h1>

        <form className={styles.createPostForm} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Título *</label>
            <input
              type="text"
              placeholder="Digite o título"
              {...register("titulo")}
              className={styles.formInput}
            />
            {errors.titulo && (
              <span className={styles.errorMessage}>{errors.titulo.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Conteúdo *</label>
            <textarea
              placeholder="Digite o conteúdo do post"
              rows="6"
              {...register("conteudo")}
              className={styles.formTextarea}
            ></textarea>
            {errors.conteudo && (
              <span className={styles.errorMessage}>{errors.conteudo.message}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.createPostButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Criar Post"}
          </button>
        </form>
      </div>
    </div>
  );
}