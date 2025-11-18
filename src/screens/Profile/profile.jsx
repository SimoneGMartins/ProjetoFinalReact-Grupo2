/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./profile.module.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const API = "https://6910d54c7686c0e9c20bd4c8.mockapi.io/users";

  const [form, setForm] = useState({
    name: "",
    email: "",
    birthDate: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`${API}/${user.id}`)
      .then((res) => {
        setForm({
          name: res.data.name,
          email: res.data.email,
          birthDate: res.data.birthDate,
          phone: res.data.phone,
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();

    axios
      .put(`${API}/${user.id}`, form)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          alert("Perfil atualizado com sucesso!");

          localStorage.setItem("user", JSON.stringify(res.data));
          setUser(res.data);
          setForm(res.data);
        }
      })
      .catch(() => {});
  }

  if (!user) return <p>Você precisa estar logado.</p>;

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSave}>
        <h2>Editar perfil</h2>

        <label>Nome</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Data de nascimento</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Telefone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.save}>
            💾 Salvar alterações
          </button>

          <button
            type="button"
            className={styles.cancel}
            onClick={() => navigate("/")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}