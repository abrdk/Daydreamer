import Link from "next/link";
import styles from '../styles/Home.module.css';

export default function Home() {
	return (
		<div className={styles.container}>
			<Link href="/login">
				<a className={styles.mainLink}>Вход</a>
			</Link>
			<Link href="/signup">
				<a className={styles.mainLink}>Регистрация</a>
			</Link>
		</div>
	)
}
