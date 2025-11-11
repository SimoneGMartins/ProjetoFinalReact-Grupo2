import React from "react";
import styles from "./InputPassword.module.css"

const InputPassword = ({ value, onChange }) => {
  return (
    <div className={styles["inputPassword"]}>
      <label htmlFor="password">Senha</label>
      <input
        type="password"
        placeholder="escreva sua senha"
        value={value}
        onChange={(event) => onChange(event)}
        id="password"
      />
    </div>
  );
};

export default InputPassword;
