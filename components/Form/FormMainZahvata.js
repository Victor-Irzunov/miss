"use client";
import { sendOrderTelegram } from '@/http/telegramAPI';
import Link from 'next/link';
import React, { useState } from 'react';
import PhoneInput from './MaskPhone/PhoneInput';

const FormMainZahvata = ({ setIsOpen, setActiveSendForm }) => {
	const [tel, setTel] = useState('+375 ');
	const [alertActive, setAlertActive] = useState(false);
	const [alertText, setAlertText] = useState('');
	const [agree, setAgree] = useState(false);
	const [block, setBlock] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();

		const telDigitsOnly = tel.replace(/\D/g, '');
		if (telDigitsOnly.length !== 12) {
			setAlertText('Введите весь номер телефона в правильном формате: +375 XX XXX-XX-XX');
			setAlertActive(true);
			setTimeout(() => setAlertActive(false), 4000);
			return;
		}

		const messageForm = `
		<b>Заказ с сайта slomdom:</b>\n
		<b>Заявка с главного экрана</b>\n
		<b>Телефон:</b> <a href='tel:${tel}'>${tel}</a>\n
		`;

		sendOrderTelegram(messageForm).then((data) => {
			if (data.ok) {
				window.location.href = '/thank-you';
				// setTimeout(() => setActiveSendForm(false), 4000);
				// setIsOpen(false);
			}
		});
	};

	const clickBtn = () => {
		setBlock(true);
		setAlertText('Вы согласны на обработку персональных данных?');
		setAlertActive(true);
		setTimeout(() => setAlertActive(false), 4000);
		setTimeout(() => setBlock(false), 4000);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div className="flex sd:flex-row xz:flex-col items-end sd:space-x-2 xz:space-x-0 xz:space-y-4 sd:space-y-0">
					<div className="form-control relative w-full">
						<PhoneInput
							bg
							value={tel}
							onChange={setTel}
							setAlertText={setAlertText}
							setAlertActive={setAlertActive}
						/>
						{alertActive && (
							<div className="text-red-600 text-[8px] absolute sd:-bottom-3 xz:-bottom-4">{alertText}</div>
						)}
					</div>

					<div className="form-control w-full" onClick={!agree ? clickBtn : undefined}>
						<button
							className={`btn whitespace-nowrap font-bold tracking-wider ${!agree ? 'btn-secondary' : 'btn-accent text-white'} uppercase w-full px-7`}
							type="submit"
							disabled={!agree}
						>
							Оставить заявку
						</button>
					</div>
				</div>

				<div className="form-control mt-4">
					<label className="cursor-pointer label flex justify-start items-center">
						<input
							type="checkbox"
							className="checkbox checkbox-sm"
							checked={agree}
							onChange={(e) => setAgree(e.target.checked)}
						/>
						<span className="label-text ml-2 sd:text-[11px] xz:text-[9px] xy:text-[10px]">
							Я согласен(на) на{' '}
							<Link href="/politika" target="_blank" className="underline">
								обработку персональных данных
							</Link>
						</span>
					</label>
				</div>
			</form>
		</div>
	);
};

export default FormMainZahvata;