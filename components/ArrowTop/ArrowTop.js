"use client"
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Link as LinkScroll } from 'react-scroll';

const ArrowTop = () => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const handleLoad = () => setIsLoaded(true);

		if (document.readyState === "complete") {
			setIsLoaded(true);
		} else {
			window.addEventListener("load", handleLoad);
			return () => window.removeEventListener("load", handleLoad);
		}
	}, []);

	if (!isLoaded) return null;
	return (
		<div className="">
			<LinkScroll
				to="main"
				smooth={true}
				offset={-100}
				duration={800}
				className="cursor-pointer absolute sd:right-0 xz:-right-5 sd:bottom-40 xz:bottom-96"
				rel="nofollow"
				href='#/'
			>
				<div className="flex items-center -rotate-90 cursor-pointer text-secondary hover:scale-110">
					<p className="font-extralight mr-1.5 pb-1">на верх</p>
					<Image src="/svg/arrow-white.svg" alt="Стрелка на верх" className="rotate-45" width={40} height={40} />
				</div>
			</LinkScroll>
		</div>
	)
}

export default ArrowTop