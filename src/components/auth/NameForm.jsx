import styles from "@/styles/auth.module.scss";
import FloatingLabel from "floating-label-react";

export default function NameForm({ name, setName, nameWarn }) {
  const getNameInputClass = () => {
    if (nameWarn) {
      if (name) {
        return styles.formInputFilledWarn;
      }
      return styles.formInputWarn;
    }
    if (name) {
      return styles.formInputFilled;
    }
    return styles.formInput;
  };

  const updateName = (e) => setName(e.target.value);
  return (
    <>
      <FloatingLabel
        id="name"
        name="name"
        placeholder="Your name"
        className={getNameInputClass()}
        value={name}
        onChange={updateName}
      />
      {nameWarn && <div className={styles.warningContainer}>{nameWarn}</div>}
    </>
  );
}
