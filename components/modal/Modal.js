import FormSupport from "../Form/FormSupport";
const Modal = ({ selectedProduct, closeModal, isFormSubmitted, setIsFormSubmitted, index, consult, exit }) => {

	return (
		<dialog id={`my_modal_${index}`} className="modal text-black">
			{!isFormSubmitted ? (
				<div className="modal-box">
					<p className="font-semibold text-lg">{selectedProduct ? `${selectedProduct}` : 'Заказать звонок'}</p>
					{
						consult ?
							<div className='pt-4'>
								<p className='uppercase text-green-600'>
									БЕСПЛАТНО
								</p>
								<ul className='mt-2 uppercase text-xs font-light'>
									<li className='mb-2'>
										• Проконсультируем
									</li>
									<li className='mb-2'>
										• подберем оптимальный вариант
									</li>
									<li className='mb-2'>
										• сделаем расчет стоимости
									</li>
								</ul>
							</div>
							:
							<p className="py-1 mt-3 text-sm">
								Пожалуйста, заполните форму, и наш специалист свяжется с вами.
							</p>
					}
					<form method="dialog">
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black dark:text-red-500">✕</button>
					</form>
					<FormSupport
						selectedProduct={selectedProduct}
						closeModal={closeModal}
						setIsFormSubmitted={setIsFormSubmitted}
						btn='Отправить'
						exit
					/>
				</div>
			)
				:
				(
					<div className="modal-box">
						<p className="text-primary">Ваш запрос успешно отправлен!</p>
					</div>
				)
			}
		</dialog>
	)
}

export default Modal;