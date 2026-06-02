"use client"

import Image from "next/image"
import Link from "next/link"
import inst from "../../public/assets/inst.svg"
import telegram from "../../public/assets/telegram.svg"
import { useLanguage } from "@/contexts/LanguageContext"

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="w-full px-5 md:px-10 xl:px-19 py-10 md:py-12 flex flex-col justify-between items-center bg-background border-t border-white/10 text-gray-300 mt-12 md:mt-16">
      <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start px-2 gap-6 md:gap-0 mb-8 md:mb-6">
        <div className="flex items-center md:items-start">
          <Image
            src="/assets/logo.svg"
            alt="QDeb Logo"
            width={120}
            height={35}
            className="opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>

        <div className="flex items-center md:items-start gap-3">
          <Link
            href="https://www.instagram.com/qdebkz?igsh=MWZpM2ltdGo5YXBtdg%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/75 hover:bg-white/90 hover:scale-110 w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Image src={inst} alt="Instagram" width={26} height={26} />
          </Link>
          <Link
            href="https://t.me/qdebkz"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/75 hover:bg-white/90 hover:scale-110 w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Image src={telegram} alt="Telegram" width={26} height={26} />
          </Link>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row justify-between items-center px-2 gap-4 md:gap-0 text-center md:text-left">
        <div className="flex justify-center md:justify-start w-full md:w-auto">
          <p className="text-base md:text-lg font-medium">{t.footer.rights}</p>
        </div>

        <div className="flex justify-center w-full md:w-auto">
          <Link
            href="/privacy-policy"
            className="text-base md:text-lg font-medium hover:text-accent transition-colors px-2 py-1 rounded hover:bg-white/5"
          >
            {t.footer.privacy}
          </Link>
        </div>

        <div className="flex justify-center md:justify-end w-full md:w-auto">
          <p className="text-base md:text-lg font-medium">
            {t.footer.contact}{" "}
            <Link
              href="mailto:qdebkz@gmail.com"
              className="hover:text-accent transition-colors font-semibold"
            >
              qdebkz@gmail.com
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
