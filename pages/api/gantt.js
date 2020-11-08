import * as cookie from 'cookie';
const jwt = require('jsonwebtoken');
const getDB = require('../../helpers/getDb.js');

export default async (req, res) => {
	res.setHeader('Content-Type', 'application/json');

	const { query, chart, id, name } = req.body;

	let user;

	try {
		const token = cookie.parse(req.headers.cookie).ganttToken;
		const decoded = jwt.verify(token, 'jwtSecret');
		user = decoded.userId;
	} catch(e) {
		return res.status(500).json({ message: 'Ошибка  авторизации' });
	}

	try {
		const Gantt = getDB('Gantt');

		if(query === 'create') {
			const one = new Gantt({
				date: new Date(),
				user, name, chart
			})
			await one.save();
		}

		if(query === 'update') await Gantt.findOneAndUpdate({_id: id}, {chart});

		if(query === 'delete') await Gantt.findOneAndRemove({_id: id});

		if(user) return res.status(201).json({ message: 'ok', charts: await Gantt.find({user}) });
		else return res.status(400).json({ message: 'unauthorized',  });


	} catch (e) {
		res.status(500).json({ message: 'Ошибка базы данных' });
	}
}