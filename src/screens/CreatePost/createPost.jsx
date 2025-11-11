import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
//import { useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./createPost.module.css"


const schema = yup.object({
  title: yup
    .string()
    .required("O título é obrigatório.")
    .min(3, "O título deve ter pelo menos 3 caracteres."),
  body: yup
    .string()
    .required("O conteúdo é obrigatório.")
    .min(10, "O conteúdo deve ter pelo menos 10 caracteres."),
});

export default function CreatePost() {
  const navigate = useNavigate();

  
//  const userLogged = localStorage.getItem("user");

 // useEffect(() => {
  //  if (!userLogged) {
   //   toast.error("Você precisa estar logado para criar um post!");
   //   navigate("/login");
   // }
  //}, [userLogged, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", body: "" },
  });

  const onSubmit = async (data) => {
    try {
       await axios.post(
        "https://69112ffd7686c0e9c20cae72.mockapi.io/posts",
        {
          title: data.title,
          body: data.body,
          userId: 1,
        }
      );

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
            {...register("title")}
            className={styles.formInput}
          />
          {errors.title && (
            <span className={styles.errorMessage}>{errors.title.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Conteúdo *</label>
          <textarea
            placeholder="Digite o conteúdo do post"
            rows="6"
            {...register("body")}
            className={styles.formTextarea}
          ></textarea>
          {errors.body && (
            <span className={styles.errorMessage}>{errors.body.message}</span>
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
};