import React from 'react';
import './taskMenu.css';

export const TaskMenu = props => {
	return(
		<div className="secondMenu">
		<div className="topMenu">
			<div className="topMenuLeft">
				<img className="closeMenu up" src={require('./img/up.png')} alt="up"/>
				<img className="closeMenu bottom" src={require('./img/bottom.png')} alt="bottom"/>
			</div>
			<img className="closeMenu" src={require('./img/frame.png')} alt="frame"/>
			<div className="hintUp">Переместить выше<div></div></div>
			<div className="hintUp hintBottom">Переместить ниже<div></div></div>
		</div>
		<div className="titleMenu">
			<div className="title">Задача</div>
			<div className="titleText">
				<span>Сделать дизайн сайта</span>
				<img className="Vector" src={require('./img/vector.png')} alt="vector"/>
			</div>
			<div className="title">Дата</div>
			<div className="titleText">19 августа 2020 до 30 августа 2020</div>
		</div>
		<div className="colorText">
			<div className="colorTextMore">
				<div className="color"></div>
				<div>Цвет задачи</div>
			</div>
			<img className="Polygon" src={require('./img/polygon.png')} alt="polygon"/>
		</div>
		<div className="colorText">
			<div className="colorTextMore">
				<img className="del" src={require('./img/del.png')} alt="del"/>
				<div>Удалить задачу</div>
			</div>
		</div>
		<div className="titleMenu titleMenuInput">
			<div className="title">Описание</div>
			<div className="titleText titleTextInput">
				<span>Добавить описание</span>
			</div>
		</div>
		<div className="inputText">
			<input type="text" name="" placeholder="Это описание задачи" className="inputText"/>
		</div>
		<div className="savePlase">
			<div className="saveButton">Сохранить</div>
			<img className="closeMenu" src={require('./img/frame.png')} alt="frame"/>
		</div>
	</div>
	)
}