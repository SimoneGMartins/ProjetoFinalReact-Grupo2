import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useEffect } from "react";
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

  
  const userLogged = localStorage.getItem("user");

  useEffect(() => {
    if (!userLogged) {
      toast.error("Você precisa estar logado para criar um post!");
      navigate("/login");
    }
  }, [userLogged, navigate]);

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
        "https://jsonplaceholder.typicode.com/posts",
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
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>Criar Novo Post</h1>

      <form style={styles.form} onSubmit={handleSubmit(onSubmit)}>
        
        
        <div style={styles.field}>
          <label style={styles.label}>Título *</label>
          <input
            type="text"
            placeholder="Digite o título"
            {...register("title")}
            style={styles.input}
          />
          {errors.title && (
            <span style={styles.error}>{errors.title.message}</span>
          )}
        </div>

      
        <div style={styles.field}>
          <label style={styles.label}>Conteúdo *</label>
          <textarea
            placeholder="Digite o conteúdo do post"
            rows="6"
            {...register("body")}
            style={styles.textarea}
          ></textarea>
          {errors.body && (
            <span style={styles.error}>{errors.body.message}</span>
          )}
        </div>

       
        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Criar Post"}
        </button>
      </form>
    </div>
  );
}
