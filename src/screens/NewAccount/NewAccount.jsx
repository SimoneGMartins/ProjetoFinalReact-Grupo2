import { useState } from "react";
import styles from "./newAccount.module.css";
import InputEmail from "../../components/ui/InputEmail/InputEmail";
import InputPassword from "../../components/ui/InputPassword/InputPassword";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NewAccount = () => {
  const { newUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("")
    const success = await newUser(email, password);
    if (success) navigate("/login");
    else setError("Email ou senha existentes!");
  };
  return (
    <section className={styles["loginContainer"]}>
      <div className={styles["loginBox"]}>
        <h2>Criar conta</h2>
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
             Criar Conta
            </button>
            <div>
              <Link to="/login">Voltar para o Login</Link>
            </div>
          </div>
        </form>
        {error && <span style={{ color: "red" }}>{error}</span>}
      </div>
    </section>
  );
};

export default NewAccount;
