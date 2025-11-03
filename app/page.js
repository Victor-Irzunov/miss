import GirlsSection from "@/components/Girls/GirlsSection";
import RunningText from "@/components/RunningText/RunningText";
import Image from "next/image";



export default function Home() {
  return (
    <main
      className="min-h-[200vh]"
      style={{
        backgroundImage: [
          "radial-gradient(1200px 800px at 15% 85%, rgba(152, 104, 44, 0.88) 0%, rgba(152, 104, 44, 0.58) 40%, rgba(152, 104, 44, 0) 70%)",
          "radial-gradient(900px 700px at 92% 8%, rgba(34, 74, 52, 0.70) 0%, rgba(34, 74, 52, 0.28) 45%, rgba(34, 74, 52, 0) 72%)",
          "radial-gradient(130% 100% at 50% 0%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%)",
          "linear-gradient(180deg, #141826 5%, #1C1F2E 42%, #564733 100%)",
        ].join(", "),
        backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
        backgroundAttachment: "scroll, scroll, scroll, scroll",
        backgroundSize: "cover, cover, cover, cover",
        backgroundPosition: "center, center, center, center",
      }}
    >
      <section
        aria-label="Главный экран"
        className="relative"
      >
        <div
          className="
            xz:block sd:hidden
            relative
            w-full
            min-h-screen
          
            bg-no-repeat bg-center bg-cover
          "
          style={{
            backgroundImage: "url('/fon/fon-mobile-2.webp')",
          }}
        >

        </div>
        <div
          className="
            xz:hidden sd:block
            relative
            w-full
            min-h-screen
            bg-cover
          "
          style={{
            backgroundImage: "url('/fon/fon.webp')",
          }}
        >
          <RunningText />
          <div className='container mx-auto relative h-screen'>
            <div className='flex justify-between items-center h-screen'>
              <div className=''>
                <Image src='/fon/woman.webp' alt='Девушка' width={600} height={550} className="-ml-10" />
                <div className='mt-9 pl-4 uppercase text-white'>
                  <p className='text-2xl'>
                    Минск | Осень 2025
                  </p>
                  <p className='text-4xl mt-3'>
                    онлайн
                  </p>
                </div>
              </div>
              <div className=''>
                <Image src='/fon/lady.webp' alt='Девушка' width={250} height={500} className="absolute right-0 top-40" />
              </div>
            </div>
          </div>

          <div className='flex justify-center pb-9 -mt-20'>
            <div className='bg-black/45 rounded-lg py-5 px-4 flex items-center space-x-3'>
              <div className='bg-white/10 backdrop-blur-md p-2 rounded-s-sm'>
                <Image src='/svg/telegram-white.svg' alt='Телеграмм' width={50} height={50} />
              </div>
              <p className='text-white/80 text-xl'>
                За подробностями пишите в директ
              </p>
            </div>
          </div>
        </div>
      </section>

      <GirlsSection />
    </main >
  );
}
