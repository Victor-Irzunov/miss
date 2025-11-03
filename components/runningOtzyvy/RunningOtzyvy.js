import React from 'react';
import Image from "next/image";
import Marquee from "react-fast-marquee";

const reviewsData = [
	{
		id: 1,
		name: 'Александр',
		imageSrc: '/otzyvy/2.webp',
		content: ''
	},
	
];


const RunningOtzyvy = () => {
	return (
		<section className='w-full sd:mt-0 xz:mt-16'>
			<Marquee speed={30}>
				{reviewsData.map(review => (
					<div key={review.id} className='mx-4  p-5 sd:max-w-[400px] xz:max-w-96 sd:h-64 xz:h-72'>
						<div className='flex items-center'>
							<Image
								src={review.imageSrc} alt={`Отзыв клиента ${review.name}`}
								className="rounded-full"
								width={65} height={65} priority={true} />
							<div className=''>
								<p className='text-3xl ml-3'>
									{review.name}
								</p>
								<div className='ml-4 mt-1'>
									<div className="rating rating-xs">
										<input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
										<input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
										<input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
										<input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
										<input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" checked />
									</div>
								</div>
							</div>
						</div>
						<div className='mt-4'>
							<p className='sd:text-sm xz:text-sm xz:font-light xl:font-normal'>
								{review.content}
							</p>
						</div>
					</div>
				))}
			</Marquee>
		</section>

	);
};

export default RunningOtzyvy;
