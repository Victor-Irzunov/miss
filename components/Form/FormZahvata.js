"use client"
import { sendOrderTelegram } from '@/http/telegramAPI';
import Link from 'next/link';
import React, { useState } from 'react';
import PhoneInput from './MaskPhone/PhoneInput';

const FormZahvata = ({ setIsOpen, setActiveSendForm, selectedProduct }) => {
	const [tel, setTel] = useState('+375 ');
	const [message, setMessage] = useState('');
	const [alertActive, setAlertActive] = useState(false);
	const [alertText, setAlertText] = useState('');
	const [agree, setAgree] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		const telDigitsOnly = tel.replace(/\D/g, '');
		if (telDigitsOnly.length !== 12) {
			setAlertText('Введите весь номер телефона в правильном формате: +375 XX XXX-XX-XX');
			setAlertActive(true);
			setTimeout(() => setAlertActive(false), 4000);
			return;
		}
		let messageForm = `
		<b>Заказ с сайта ремонт стиралок Витебск:</b>\n
		<b>C синего фона</b>\n
		<b>Телефон:</b> <a href='tel:${tel}'>${tel}</a>\n
		<b>Сообщение:</b> ${message || 'Нет дополнительных сообщений'}
		`;
		sendOrderTelegram(messageForm).then(data => {
			if (data.ok) {
				// setActiveSendForm(true);
				window.location.href = '/thank-you';
				setTimeout(() => setActiveSendForm(false), 4000);
				setIsOpen(false);
			}
		});
	};

	return (
		<div className="w-full">
			<form className="text-black" onSubmit={handleSubmit}>

				<div className=''>

					<div className="form-control mt-4">
						<label className="label flex justify-between">
							<span className="label-text text-white">Имя</span>
							<span className="label-text-alt text-[10px] text-white/50">Необязательное поле</span>
						</label>
						<input
							className="input input-bordered bg-white/10 w-full"
							placeholder=""
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							aria-label="Ввод имени"
						/>
					</div>

					<div className="form-control mt-4">
						<label className="label flex justify-between">
							<span className="label-text text-white">Телефон (xx xxx-xx-xx)</span>
							<span className="label-text-alt text-[10px] text-white/50">Обязательное поле</span>
						</label>
						<PhoneInput bg value={tel} onChange={setTel} setAlertText={setAlertText} setAlertActive={setAlertActive} />
						{alertActive && <div className="text-red-600 text-xs mt-1">{alertText}</div>}
					</div>


				</div>

				<div className="form-control mt-3">
					<label className="cursor-pointer label flex justify-start items-center">
						<input
							type="checkbox"
							className="checkbox checkbox-sm bg-white"
							checked={agree}
							onChange={(e) => setAgree(e.target.checked)}
						/>
						<span className="label-text ml-2 sd:text-[11px] xz:text-[9px] xy:text-[10px] text-white">
							Я согласен(на) на <Link href='/politika' target='_blank' className='underline text-white/50'>
								обработку персональных данных</Link>
						</span>
					</label>
				</div>
				<div className="form-control mt-6">
					<button className="btn btn-secondary font-bold text-white uppercase" type="submit" disabled={!agree}>
						Отправить
					</button>
				</div>
			</form>
		</div>
	);
};

export default FormZahvata;