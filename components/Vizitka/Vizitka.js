import BtnComp from "../btn/BtnComp"


const Vizitka = () => {
	return (
		<section className='py-20 relative'>
			<div className='container mx-auto text-white'>

				<div className='flex sd:flex-row xz:flex-col bg-primary px-8 py-20 rounded-3xl'>

					<div className='sd:w-2/3 xz:w-full'>
						<p className='sd:text-5xl xz:text-3xl'>
							Хватит сомневаться - пора обучаться!
						</p>
						<p className='mt-4 sd:text-lg xz:text-base'>
							Новые возможности открываются с нажатия кнопки
						</p>
					</div>

					<div className='sd:w-1/3 xz:w-full flex sd:justify-center xz:justify-start items-center  sd:mt-0 xz:mt-10'>
						<BtnComp title='Начать обучение' index={1004} btnBig />
					</div>
				</div>
			</div>
		</section>
	)
}

export default Vizitka