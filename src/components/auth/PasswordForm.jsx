import styles from "@/styles/auth.module.scss";
import FloatingLabel from "floating-label-react";
import { useState } from "react";

import EyeSvg from "@/src/components/svg/EyeSvg";

export default function PasswordForm({ password, setPassword, passwordWarn }) {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const getPasswordInputClass = () => {
    if (passwordWarn) {
      if (password) {
        return styles.formInputFilledWarn;
      }
      return styles.formInputWarn;
    }
    if (password) {
      return styles.formInputFilled;
    }
    return styles.formInput;
  };

  const updatePassword = (e) => setPassword(e.target.value);

  const togglePasswordVisibility = () =>
    setPasswordVisibility((isPasswordVisible) => !isPasswordVisible);

  return (
    <>
      <div className={styles.passwordContainer}>
        <div className={styles.passwordEye} onClick={togglePasswordVisibility}>
          <EyeSvg />
        </div>
        <FloatingLabel
          id="password"
          name="password"
          placeholder="Your password"
          className={getPasswordInputClass()}
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onChange={updatePassword}
        />
      </div>
      {passwordWarn && (
        <div className={styles.warningContainer}>{passwordWarn}</div>
      )}
    </>
  );
}
