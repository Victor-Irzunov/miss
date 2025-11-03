"use client"
import { useEffect, useState } from "react";
import phoneNumbers from "@/config/config";
import { sendOrderTelegram } from "@/http/telegramAPI";

const Phone2 = ({ buttom, phone, size='text-2xl', white, left }) => {
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

  const handlePhoneClick = async () => {
    const message = "Клик по номеру телефона Лайф";
    await sendOrderTelegram(message);
  };

  if (!isLoaded) return null;

  return (
    <>
      {!buttom ? (
        <div className='sd:hidden xz:block fixed bottom-0 left-0 right-0 w-full z-50 mx-auto'>
          <a
            href={`tel:${phoneNumbers.phone2Link}`}
            className={`w-full mx-auto`}
            onClick={handlePhoneClick}
          >
            <button className="w-full relative overflow-hidden bg-primary text-white font-bold py-1.5 rounded-none shadow-lg flex justify-center items-center gap-2">
              <svg className="w-6 h-6 animate-ringing" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.91 15.91 0 006.59 6.59l2.2-2.2a1 1 0 011.1-.23 11.36 11.36 0 003.55.57 1 1 0 011 1v3.55a1 1 0 01-1 1A19.94 19.94 0 012 4a1 1 0 011-1h3.55a1 1 0 011 1 11.36 11.36 0 00.57 3.55 1 1 0 01-.23 1.1z"></path>
              </svg>
              {phoneNumbers.phone2}
            </button>
          </a>
        </div>
      ) : (
        <div className={`flex ${left ? 'justify-start': 'justify-center'}`}>
          <a
            href={`tel:${phoneNumbers.phone2Link}`}
            className={`${size}`}
            onClick={handlePhoneClick}
          >
            <button className={`bg-transparent ${white ? 'text-white': ''} font-bold py-1.5 rounded-none flex justify-center items-center gap-2`}>
              {
                !phone ?
                  <svg className="w-5 h-5 animate-ringing" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79a15.91 15.91 0 006.59 6.59l2.2-2.2a1 1 0 011.1-.23 11.36 11.36 0 003.55.57 1 1 0 011 1v3.55a1 1 0 01-1 1A19.94 19.94 0 012 4a1 1 0 011-1h3.55a1 1 0 011 1 11.36 11.36 0 00.57 3.55 1 1 0 01-.23 1.1z"></path>
                  </svg>
                  :
                  null
              }

              {phoneNumbers.phone2}
            </button>
          </a>
        </div>
      )}
    </>
  );
};

export default Phone2;
