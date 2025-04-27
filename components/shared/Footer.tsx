import Image from "next/image";
import { FaInstagram, FaTelegram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0B0D12] text-gray-400 py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-4">
        {/* Логотип и копирайт */}
        <div className="flex flex-col items-start">
          <a href="/" className="text-2xl font-bold text-white mb-2">
            QDeb
          </a>
          <p className="text-sm">© 2025 QDeb. Все права защищены.</p>
        </div>

        {/* Политика конфиденциальности */}
        <div>
          <a href="/privacy-policy" className="text-sm hover:underline">
            Политика конфиденциальности
          </a>
        </div>

        {/* Контакты и соцсети */}
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm">
            Свяжитесь с нами:{" "}
            <a href="mailto:qdeb.info@gmail.com" className="hover:underline">
              qdeb.info@gmail.com
            </a>
          </p>
          <div className="flex gap-3 mt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition"
            >
              <FaInstagram size={18} color="white" />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition"
            >
              <FaTelegram size={18} color="white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
