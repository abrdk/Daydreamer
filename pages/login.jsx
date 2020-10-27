import Link from "next/link";
import { useState } from "react";
import { xhr } from "../helpers/xhr";
import Router from 'next/router';
import styles from '../styles/Home.module.css';

export default function Login() {

	const [warn, setWarn] = useState(null);

	const query = () => {
		xhr('/auth', {query: 'login',
			email: document.getElementById('email').value,
			password: document.getElementById('password').value
		}, 'POST').then(res => {
			if(res.message === 'ok') Router.push('/gantt/new');
			else setWarn(res.message);
		});
	}

	return (
		<div className={styles.container} onClick={() => setWarn(null)}>
			<div className={styles.form}>
				<div className={styles.formTitle}>Вход</div>
				<label>
					<span>Электронная почта</span>
					<input className="input" id="email" type="email"/>
				</label>
				<label>
					<span>Пароль</span>
					<input className="input" id="password" type="password"/>
				</label>
				{warn && <div>{warn}</div>}
				<button onClick={query}>
					Войти
				</button>
				<Link href="/recover">
					<a style={{textDecoration: 'none', color: '#8B8B8B'}}>Восстановить пароль</a>
				</Link>
				<Link href="/signup">
					<a>Регистрация</a>
				</Link>
			</div>
		</div>
	)
}
