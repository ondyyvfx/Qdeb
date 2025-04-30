import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTelegram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full h-[175px] px-5 flex flex-col justify-between items-center bg-background border-t border-white/10 text-gray-400 py-4 pb-7 mt-6">
      <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start px-2 gap-4 md:gap-0">
        <div className="flex items-center md:items-start">
          <Image
            src="/assets/logo.svg"
            alt="QDeb Logo"
            width={50}
            height={50}
            className="opacity-75 w-32"
          />
        </div>

        <div className="flex items-center md:items-start gap-2">
          <Link
            href="https://www.instagram.com/qdebkz?igsh=MWZpM2ltdGo5YXBtdg%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition"
          >
            <FaInstagram size={32} color="white" />
          </Link>
          <Link
            href="https://t.me/qdebkz"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition"
          >
            <FaTelegram size={32} color="white" />
          </Link>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row justify-between items-center px-2 mt-4 gap-2 md:gap-0 text-center md:text-left">
        <div className="flex justify-center md:justify-start w-full md:w-auto">
          <p className="text-sm">© 2025 QDeb. Все права защищены.</p>
        </div>

        <div className="flex justify-center w-full md:w-auto">
          <Link href="/privacy-policy" className="text-sm hover:underline">
            Политика конфиденциальности
          </Link>
        </div>

        <div className="flex justify-center md:justify-end w-full md:w-auto">
          <p className="text-sm">
            Свяжитесь с нами:{" "}
            <Link href="mailto:qdebkz@gmail.com" className="hover:underline">
              qdebkz@gmail.com
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
