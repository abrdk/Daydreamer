import React, { useState } from 'react';
import './taskMenu.css';
import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import ru from 'date-fns/locale/ru';
import "react-datepicker/dist/react-datepicker.css";
registerLocale('ru', ru);

export const TaskMenu = ({menu, setMenu, currentTask, onTaskChange, delTask, moveChild}) => {

	const [inp, setInp] = useState(false);
	const [desc, setDesc] = useState(false);
	
	return(
		<div className={menu ? 'secondMenu' : 'secondMenu secondMenuClose'} style={{width: menu ? '330px' : 0, overflow: menu ? '' : 'hidden'}}>
			<div className="topMenu">
				{!currentTask.children || !currentTask.children[0] ? <div className="topMenuLeft">
					<img className="closeMenu up" src={require('./img/up.png')} alt="up" 
						onClick={moveChild.bind(null, currentTask, -1)}
					/>
					<img className="closeMenu bottom" src={require('./img/bottom.png')} alt="bottom"
						onClick={moveChild.bind(null, currentTask, 1)}
					/>
				</div> : <div />}
				<img className="closeMenu" src={require('./img/frame.png')} alt="frame"
					onClick={setMenu.bind(null, {}, false)}
				/>
				{/* <div className="hintUp">Переместить выше<div></div></div>
				<div className="hintUp hintBottom">Переместить ниже<div></div></div> */}
			</div>
			<div className="titleMenu">
				<div className="title">Задача</div>
				<div className="titleText">
					{inp ? 
						<>
							<input style={{height: '35px', width: '260px'}} 
								value={currentTask.name}
								onChange={e => {
									onTaskChange({
										...currentTask,
										name: e.target.value
									})
								}}
							/>
							<img className="Vector" src={require('./img/vector.png')} alt="vector"
								onClick={() => setInp(false)}
							/>
						</>
					: 	<>
							<span>{currentTask.name}</span>
							<img className="Vector" src={require('./img/vector.png')} alt="vector"
								onClick={() => setInp(true)}
							/>
						</>
					}
				</div>
				<div className="title">Дата</div>
				<div className="menu-date">
					<DatePicker
						selected={currentTask.start}
						onChange={start => {
							onTaskChange({
								...currentTask,
								start
							})
						}}
						selectsStart
						startDate={currentTask.start}
						endDate={currentTask.end}
						dateFormat="d MMMM yyyy"
						locale="ru"
					/>
					<DatePicker
						selected={currentTask.end}
						onChange={end => {
							onTaskChange({
								...currentTask,
								end
							})
						}}
						selectsEnd
						startDate={currentTask.start}
						endDate={currentTask.end}
						minDate={currentTask.start}
						dateFormat="d MMMM yyyy"
						locale="ru"
					/>
				</div>
			</div>
			<div className="colorText">
				<div className="colorTextMore">
					{currentTask.styles && <ColorPicker className="color" 
						animation="slide-up"
						color={currentTask.styles ? currentTask.styles.backgroundColor : '#fff'}
						onChange={color => {
							onTaskChange({
								...currentTask,
								styles: {
									...currentTask.styles,
									backgroundColor: color.color,
									backgroundSelectedColor: color.color
								}
							})
						}}
					/>}
					<div>Цвет задачи</div>
				</div>
				<img className="Polygon" src={require('./img/polygon.png')} alt="polygon"/>
			</div>
			<div className="colorText">
				{(!currentTask.children || !currentTask.children[0]) && <div className="colorTextMore"
					onClick={() => {
						delTask(currentTask.id);
						setMenu({}, false);
					}}
				>
					<img className="del" src={require('./img/del.png')} alt="del"/>
					<div>Удалить задачу</div>
				</div>}
			</div>
			{!desc && <div className="titleMenu titleMenuInput">
				<div className="title">{currentTask.desc}</div>
				<div className="titleText titleTextInput" onClick={() => setDesc(true)}>
					<span>Добавить описание</span>
				</div>
			</div>}
			{desc && <>
				<div className="inputText">
					<textarea type="text" 
						value={currentTask.desc || ''}
						onChange={e => {
							onTaskChange({
								...currentTask,
								desc: e.target.value
							})
						}}
					/>
				</div>
				<div className="savePlase">
					<div className="saveButton"
						onClick={() => setDesc(false)}
					>Сохранить</div>
					<img className="closeMenu" src={require('./img/frame.png')} alt="frame"
						onClick={() => setDesc(false)}
					/>
				</div>
			</>}
		</div>
	)
}