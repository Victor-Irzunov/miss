"use client"
// components/btn/BtnComp.js
import { useState } from "react";
import Modal from "../modal/Modal";
import Image from "next/image";

const BtnComp = ({ title, index, center, name, consult, color, w, bg, small, img }) => {
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

	const handleOrderClick = (product) => {
		setSelectedProduct(product);
		document.getElementById(`my_modal_${index}`).showModal();
	};

	const closeModal = () => {
		document.getElementById(`my_modal_${index}`).close();
	};

	return (
		<div className={`flex items-center z-0 ${center ? 'justify-center' : ''} cursor-pointer`}>
			<button
				className={`
					${w ? 'w-full' : 'w-auto'}
					 btn border z-0 rounded-full
					 ${color ? `${color} border-none` : `border-none hover:bg-white/85 hover:shadow-lg hover:text-black hover:border-primary`} 
						cursor-pointer ${bg ? 'bg-secondary text-white' : 'bg-white text-primary'}
						${small ? 'sd:btn-md xz:btn-xs' : 'btn-lg'}`}
				onClick={() => handleOrderClick(name || title)}
			>
				{title}
				<div className={`${img ? 'block': 'hidden'} ${bg ? 'bg-secondary text-white': 'bg-primary text-primary'} sd:p-1.5 xz:p-1 rounded-xl sd:ml-2 xz:ml-0`}>
					<Image src='/svg/arrow-white.svg' alt='Стрелка' width={25} height={25} className={`animate-ringing sd:w-6 xz:w-4`} />
				</div>
			</button>


			<Modal
				selectedProduct={selectedProduct}
				closeModal={closeModal}
				isFormSubmitted={isFormSubmitted}
				setIsFormSubmitted={setIsFormSubmitted}
				index={index}
				consult={consult}
				exit
			/>
		</div>
	)
}


export default BtnComp;
