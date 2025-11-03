import phoneNumbers from "@/config/config"
import Image from "next/image"

const Info = () => {
	return (
		<div className='sd:hidden xz:block border-b border-gray-100 pb-5'>
			<div className='container mx-auto'>
				<div className="pt-4">
					<div className='flex sd:flex-row xz:flex-col justify-between items-center'>
						<div className='sd:hidden xz:block'>
							<Image src='/logo/logo.webp' alt='Логотип' width={130} height={130} />
						</div>
						<div className='sd:mt-0.5 xz:mt-2.5 text-center'>
							<p className='xz:text-base sd:text-lg font-semibold'>
								8:00 - 19:00
							</p>
							<p className='text-green-600 xz:text-[9px] sd:text-[11px] font-extralight uppercase tracking-widest'>
								без выходных
							</p>
						</div>
						<div className='sd:mt-0 xz:mt-2'>
							<div className=''>
								<a
									href={`tel:${phoneNumbers.phone1Link}`}
									className='link link-hover text-3xl font-semibold'>
									{phoneNumbers.phone1}
								</a>
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Info