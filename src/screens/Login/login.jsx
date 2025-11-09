import React, { useState } from "react";
import InputEmail from "../../components/ui/InputEmail/InputEmail";
import InputPassword from "../../components/ui/InputPassword/InputPassword";
import styles from "./login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ email, password });
  };
  return (
    <section className={styles["loginContainer"]}>
      <h1>Blog Jardim Digital</h1>
      <div className={styles["loginBox"]}>
        <h2>Bem vindo</h2>
        <form onSubmit={handleSubmit} className={styles["loginForm"]}>
          <InputEmail
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <InputPassword
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className={styles["containerLinks"]}>
            <button type="submit" className={styles["buttonSubmit"]}>
              Sign In
            </button>
            <div>
            <a href="#">Criar Conta</a>
            <a href="#">Esqueceu a senha?</a>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
