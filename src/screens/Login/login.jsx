import React, { useState } from "react";
import InputEmail from "../../components/ui/InputEmail/InputEmail";
import InputPassword from "../../components/ui/InputPassword/InputPassword";
import styles from "./login.module.css";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await login(email, password);
    if (success) navigate("/");
    else setError("Email ou senha incorretos!");
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
              <Link to="/new-account">Criar Conta</Link>
              <a href="#">Esqueceu a senha?</a>
            </div>
          </div>
        </form>
        {error && <span style={{ color: "red" }}>{error}</span>}
      </div>
    </section>
  );
};

export default Login;
