"use client"
import { useState } from 'react';
import { sendOrderTelegram } from '@/http/telegramAPI';


const PhoneInput = ({ value, onChange, setAlertText, setAlertActive }) => {
	const formatPhoneNumber = (input) => {
		const digits = input.replace(/\D/g, '');
		if (!digits.startsWith('375')) {
			return '+375 ';
		}
		let formatted = `+375`;
		if (digits.length > 3) formatted += ` ${digits.slice(3, 5)}`;
		if (digits.length > 5) formatted += ` ${digits.slice(5, 8)}`;
		if (digits.length > 8) formatted += `-${digits.slice(8, 10)}`;
		if (digits.length > 10) formatted += `-${digits.slice(10, 12)}`;
		return formatted;
	};

	const handleChange = (e) => {
		let formatted = formatPhoneNumber(e.target.value);
		const digits = formatted.replace(/\D/g, '');
		const operatorCode = digits.slice(3, 5);
		const validOperators = ["29", "33", "44", "25"];

		if (digits.length >= 5 && !validOperators.includes(operatorCode)) {
			setAlertText('Введите код оператора 29, 44, 33, 25');
			setAlertActive(true);
			setTimeout(() => setAlertActive(false), 3000);
			formatted = '+375 ';
		}

		onChange(formatted);
	};

	return (
		<input
			type="text"
			value={value}
			onChange={handleChange}
			placeholder="+375 xx xxx-xx-xx"
			className="input input-bordered input-md"
		/>
	);
};

const FormOrder = ({ selectedProduct, closeModal, setIsFormSubmitted, title, btn, setIsOpen, setActiveSendForm }) => {
	const [formData, setFormData] = useState({ issueType: '' });
	const [tel, setTel] = useState('+375 ');
	const [alertActive, setAlertActive] = useState(false);
	const [alertText, setAlertText] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		const telDigitsOnly = tel.replace(/\D/g, '');
		if (telDigitsOnly.length !== 12 || !formData.issueType) {
			setAlertText('Введите весь номер телефона в правильном формате: +375 XX XXX-XX-XX');
			setAlertActive(true);
			setTimeout(() => setAlertActive(false), 4000);
			return;
		}
		let messageForm = `<b>Заказ с сайта грузовичок.бел:</b>\n<b>${selectedProduct}</b>\n<b>Телефон:</b> <a href='tel:${tel}'>${tel}</a>\n<b>Интересует:</b> ${formData.issueType}`;
		sendOrderTelegram(messageForm).then(data => {
			if (data.ok) {
				window.location.href = '/thank-you';
				setActiveSendForm(true);
				setTimeout(() => setActiveSendForm(false), 4000);
				setIsOpen(false);
				closeModal()
			}
		});
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="text-black">
				<div className="form-control" custom={2} variants={yCustomAnimation2}>
					<label className="label">
						<span className="label-text">Что вас интересует?</span>
						<span className="label-text-alt">Обязательное поле</span>
					</label>
					<select
						name="issueType"
						value={formData.issueType}
						onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
						className="select select-bordered"
						required
					>
						<option value="" disabled></option>
						
					</select>
				</div>

				<div className="form-control mt-4" custom={6} variants={yCustomAnimation2}>
					<label className="label">
						<span className="label-text">Телефон (+375 xx xxx-xx-xx)</span>
						<span className="label-text-alt">Обязательное поле</span>
					</label>
					<PhoneInput value={tel} onChange={setTel} setAlertText={setAlertText} setAlertActive={setAlertActive} />
					{alertActive && <div className="text-red-800">{alertText}</div>}
				</div>

				<div className="form-control mt-6" custom={8} variants={yCustomAnimation2}>
					<button className="btn btn-primary font-bold text-white uppercase" type="submit">
						{btn}
					</button>
				</div>
			</form>
		</div>
	);
};

export default FormOrder;
