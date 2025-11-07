import GirlsSection from "@/components/Girls/GirlsSection";
import PhoneBottom from "@/components/phoneBotton/PhoneBottom";
import RunningText from "@/components/RunningText/RunningText";
import AudienceOpportunities from "@/components/Sections/AudienceOpportunities";
import EventHero from "@/components/Sections/EventHero";
import EventsGridHero from "@/components/Sections/EventsGridHero";
import FinalEventHero from "@/components/Sections/FinalEventHero";
import FounderImageOnly from "@/components/Sections/FounderImageOnly";
import GoalsSupport from "@/components/Sections/GoalsSupport";
import OrganizerImageOnly from "@/components/Sections/OrganizerImageOnly";
import PartnersWall from "@/components/Sections/PartnersWall";
import PriceGeneralPartner from "@/components/Sections/PriceGeneralPartner";
import PricePartner from "@/components/Sections/PricePartner";
import PricePartnerPlus from "@/components/Sections/PricePartnerPlus";
import TrustInvite from "@/components/Sections/TrustInvite";
import WinnersShowcase from "@/components/Sections/WinnersShowcase";
import Social from "@/components/social/Social";
import phoneNumbers from "@/config/config";
import Image from "next/image";



export default function Home() {
  return (
    <main
      id="main"
      className="min-h-[200vh] relative overflow-x-hidden sd:pb-40 xz:pb-20"
    // style={{
    //   backgroundImage: [
    //     "radial-gradient(1200px 800px at 15% 85%, rgba(152, 104, 44, 0.88) 0%, rgba(152, 104, 44, 0.58) 40%, rgba(152, 104, 44, 0) 70%)",
    //     "radial-gradient(900px 700px at 92% 8%, rgba(34, 74, 52, 0.70) 0%, rgba(34, 74, 52, 0.28) 45%, rgba(34, 74, 52, 0) 72%)",
    //     "radial-gradient(130% 100% at 50% 0%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%)",
    //     "linear-gradient(180deg, #141826 5%, #1C1F2E 42%, #564733 100%)",
    //   ].join(", "),
    //   backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
    //   backgroundAttachment: "scroll, scroll, scroll, scroll",
    //   backgroundSize: "cover, cover, cover, cover",
    //   backgroundPosition: "center, center, center, center",
    // }}
    >
      <div className='sd:block xz:hidden w-full bg-cover fon bg-center' />
      <div className='sd:hidden xz:block w-full bg-cover fon-mobile bg-center' />
      <section
        aria-label="Главный экран"
        className="relative"
      >

        {/* <div className='w-full bg-cover fon-mobil sd:hidden xz:block bg-center' /> */}
        {/* <div
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

        </div> */}
        <div
          className="
            
            relative
            w-full
            min-h-screen
            bg-no-repeat bg-center bg-cover
          "
        // style={{
        //   backgroundImage: "url('/fon/fon.webp')",
        // }}
        >
          <RunningText />
          <div className='container mx-auto relative h-screen'>
            <div className='flex justify-between items-center h-screen'>
              <div className=''>
                <Image src='/fon/woman.webp' alt='Девушка' width={600} height={550} className="-ml-10 sd:w-[600px] xz:w-[400px]" />
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
                <Image src='/fon/lady.webp' alt='Девушка' width={250} height={500} className="absolute sd:right-0 xz:-right-6 sd:top-40 xz:top-56 sd:w-[250px] xz:w-[180px]" />
              </div>
            </div>
          </div>


          <div className='flex justify-center pb-9 sd:-mt-20 xz:mt-0'>
            <a href={`https://t.me/${phoneNumbers.phone1Link}`} target="_blank" className='my-1 lg:tooltip' data-tip="telegram">
              <div className='bg-black/45 rounded-lg py-5 px-4 flex items-center space-x-3'>
                <div className='bg-white/10 backdrop-blur-md p-2 rounded-s-sm'>
                  <Image src='/svg/telegram-white.svg' alt='Телеграмм' width={50} height={50} />
                </div>
                <p className='text-white/80 text-xl'>
                  За подробностями пишите в директ
                </p>
              </div>
            </a>
          </div>

        </div>
      </section>

      <WinnersShowcase />

      <EventHero />

      <GoalsSupport />

      <TrustInvite />

      <EventsGridHero />

      <FinalEventHero />

      <AudienceOpportunities />

      <PriceGeneralPartner />

      <PricePartner />

      <PricePartnerPlus />

      <PartnersWall />

      <GirlsSection />

      <FounderImageOnly />
      <OrganizerImageOnly />


      <Social />

      <PhoneBottom/>
    </main >
  );
}
