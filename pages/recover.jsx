import Link from "next/link";
import styles from '../styles/Home.module.css';

export default function Recover() {
	return (
		<div className={styles.container}>
			<div style={{height: '284px'}} className={styles.form}>
				<div className={styles.formTitle}>Восстановить пароль</div>
				<label>
					<span>Электронная почта</span>
					<input className="input" type="password"/>
				</label>
				<button>
					Восстановить
				</button>
				<Link href="/">
					<a>На главную</a>
				</Link>
			</div>
		</div>
	)
}
