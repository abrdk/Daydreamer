import { nanoid } from "nanoid";
import Link from "next/link";
import { useState, useContext } from "react";
import styles from "../styles/auth.module.scss";
import { xhr } from "../helpers/xhr";
import Router from "next/router";
import { When } from "react-if";

import FloatingLabel from "floating-label-react";

import { UsersContext } from "../ganttChart/context/users/UsersContext";
import { ProjectsContext } from "../ganttChart/context/projects/ProjectsContext";
import { TasksContext } from "../ganttChart/context/tasks/TasksContext";

export default function Signup() {
  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const { isUserLoaded, setUser, _id } = useContext(UsersContext);
  const { createProject } = useContext(ProjectsContext);
  const { createInitialTasks } = useContext(TasksContext);

  const query = async () => {
    const res = await xhr(
      "/auth/signup",
      {
        _id: nanoid(),
        name,
        password,
      },
      "POST"
    );
    if (res.message === "ok") {
      setUser(res.user);
      const projectId = nanoid();
      await Promise.all([
        createProject({
          _id: projectId,
          name: `Project name #1`,
        }),
        createInitialTasks({ project: projectId }),
      ]);

      Router.push("/gantt/new");
    } else {
      if (res.errorType === "name") {
        setNameWarn(res.message);
      } else if (res.errorType === "password") {
        setPasswordWarn(res.message);
      }
    }
  };

  return (
    <When condition={isUserLoaded && !_id}>
      <div
        className={styles.container}
        onClick={() => {
          setNameWarn(null);
          setPasswordWarn(null);
        }}
      >
        <div className={styles.form}>
          <div className={styles.title}>Registration</div>
          <div className={styles.description}>
            Enter your information to register and to be
            <br /> able to use the service
          </div>
          <FloatingLabel
            id="name"
            name="name"
            placeholder="Your name"
            className={
              nameWarn
                ? name
                  ? styles.formInputFilledWarn
                  : styles.formInputWarn
                : name
                ? styles.formInputFilled
                : styles.formInput
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameWarn && <div className={styles.warn}>{nameWarn}</div>}
          <div className={styles.passwordContainer}>
            <FloatingLabel
              id="password"
              name="password"
              placeholder="Your password"
              className={
                passwordWarn
                  ? password
                    ? styles.formInputFilledWarn
                    : styles.formInputWarn
                  : password
                  ? styles.formInputFilled
                  : styles.formInput
              }
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src="/img/eye.svg"
              alt=" "
              className={styles.passwordEye}
              onClick={() => setPasswordVisibility(!isPasswordVisible)}
            />
          </div>
          {passwordWarn && <div className={styles.warn}>{passwordWarn}</div>}
          <div className={styles.primaryButton} onClick={query}>
            Registration
          </div>
          <div className={styles.line}></div>
          <div className={styles.linkDescription}>Already have an account?</div>
          <Link href="/login">
            <a className={styles.link}>Sign in</a>
          </Link>
        </div>
      </div>
    </When>
  );
}

// export async function getServerSideProps(ctx) {
//   let user;

//   try {
//     const token = cookie.parse(ctx.req.headers.cookie).ganttToken;
//     user = jwt.verify(token, "jwtSecret");
//   } catch (e) {
//     ctx.res.setHeader(
//       "Set-Cookie",
//       cookie.serialize("ganttToken", "", {
//         maxAge: 0,
//         path: "/",
//         sameSite: true,
//         secure: true,
//       })
//     );
//   }

//   if (user) {
//     return {
//       redirect: {
//         destination: "/gantt/new",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// }
