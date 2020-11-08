const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDB = require('../../helpers/getDb.js');

export default async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	const { email, password, query } = req.body;

	const emailCheck=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
	if(!emailCheck.test(email)) return res.status(400).json({ message: 'Не корректный емеил' });
	if(password.length < 6) return res.status(400).json({ message: 'Короткий пароль' });

	try {
		const User = getDB('User');
		const candidate = await User.findOne({ email });

		if(query === 'signup') {
			if(candidate) return res.status(400).json({ message: 'Такой пользователь уже существует' });
			const hashedPassword = await bcrypt.hash(password, 12);
			const user = new User({ email, password: hashedPassword });
			const u = await user.save();
			const token = jwt.sign({ userId: u.id }, 'jwtSecret', { expiresIn: '24h' });
			res.setHeader('Set-Cookie', `ganttToken=${token}; max-age=36000000; Path=/`);
			res.status(201).json({ message: 'ok' });
		}
		else {
			if (!candidate) res.status(400).json({ message: 'Пользователь не найден' });
			const isMatch = await bcrypt.compare(password, candidate.password);
			if(!isMatch) return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
			const token = jwt.sign({ userId: candidate.id }, 'jwtSecret', { expiresIn: '24h' });
			res.setHeader('Set-Cookie', `ganttToken=${token}; max-age=36000000; Path=/`);
			res.json({ message: 'ok' });
		}
		
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Ошибка базы данных' });
	}
}
