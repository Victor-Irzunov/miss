"use client"
import Image from 'next/image';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const data = [
	{
		id: 1,
		images: ['/otzyvy/1.webp', '/otzyvy/2.webp', '/otzyvy/3.webp', '/otzyvy/4.webp', '/otzyvy/5.webp', '/otzyvy/6.webp'],
		alt: 'Отзыв клиента - заказывал снос здания'
	},

];

const CarouselComp = ({ id = 1 }) => {
	const selectedData = data.find(item => item.id === id) || data[0];

	const responsive = {
		superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 2 },
		desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
		tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
		mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
	};

	const ButtonGroup = ({ next, previous }) => (
		<div className="carousel-button-group gap-4 flex justify-center items-center w-full absolute -bottom-24">
			<button className='block p-3 bg-white/5 rounded-md' onClick={previous}>
				<Image src='/svg/arrow-left.svg' alt='Стрелка влево' width={40} height={40} />
			</button>
			<button onClick={next}>
				<span className='block p-3 bg-white/5 rounded-md'>
					<Image src='/svg/arrow-right.svg' alt='Стрелка вправо' width={40} height={40} />
				</span>
			</button>
		</div>
	);

	return (
		<div className='mx-auto relative'>
			<Carousel
				responsive={responsive}
				arrows={false}
				showDots={true}
				autoPlaySpeed={4000}
				renderButtonGroupOutside={true}
				autoPlay
				infinite
				customButtonGroup={<ButtonGroup />}
			>
				{selectedData.images.map((imgSrc, index) => (
					<div key={index} className='rounded-md'>
						<Image src={imgSrc} className='rounded-2xl' alt={selectedData.alt} width={660} height={480} />
					</div>
				))}
			</Carousel>
		</div>
	);
}

export default CarouselComp;