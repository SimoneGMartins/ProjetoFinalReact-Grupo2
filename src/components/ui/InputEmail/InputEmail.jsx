import React from "react";
import styles from "./inputEmail.module.css"

const InputEmail = ({ value, onChange }) => {
  return (
    <div className={styles["inputEmail"]}>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        placeholder="escreva seu email"
        value={value}
        onChange={(event) => onChange(event)}
        id="email"
      />
    </div>
  );
};

export default InputEmail;
