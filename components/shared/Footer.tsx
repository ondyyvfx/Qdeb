import Image from "next/image"
import Link from "next/link"
import inst from "../../public/assets/inst.svg"
import telegram from "../../public/assets/telegram.svg"

const Footer = () => {
  // return (
  //   <footer classNameName="w-full h-[175px] px-5 py-7 flex flex-col justify-between items-center bg-background border-t border-white/10 text-gray-400  pb-7 mt-6">
  //     <div classNameName="w-full flex flex-col md:flex-row justify-between items-center md:items-start px-2 gap-4 md:gap-0">
  //       <div classNameName="flex items-center md:items-start">
  //         <Image
  //           src="/assets/logo.svg"
  //           alt="QDeb Logo"
  //           width={50}
  //           height={50}
  //           classNameName="opacity-75 w-32"
  //         />
  //       </div>

  //       <div classNameName="flex items-center md:items-start gap-2">
  //         <Link
  //           href="https://www.instagram.com/qdebkz?igsh=MWZpM2ltdGo5YXBtdg%3D%3D&utm_source=qr"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           classNameName="bg-white/75 hover:bg-white/60 w-[45px] h-[45px] rounded-full flex items-center justify-center transition"
  //         >
  //           <Image
  //             src={inst}
  //             alt="Instagram"
  //             width={22}
  //             height={22}
  //             classNameName=""
  //           />
  //         </Link>
  //         <Link
  //           href="https://t.me/qdebkz"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           classNameName="bg-white/75 hover:bg-white/60 w-[45px] h-[45px] rounded-full flex items-center justify-center transition"
  //         >
  //           <Image
  //             src={telegram}
  //             alt="Telegram"
  //             width={22}
  //             height={22}
  //             classNameName=""
  //           />
  //         </Link>
  //       </div>
  //     </div>

  //     <div classNameName="w-full flex flex-col md:flex-row justify-between items-center px-2 mt-4 gap-2 md:gap-0 text-center md:text-left">
  //       <div classNameName="flex justify-center md:justify-start w-full md:w-auto">
  //         <p classNameName="text-sm">© 2025 QDeb. Все права защищены.</p>
  //       </div>

  //       <div classNameName="flex justify-center w-full md:w-auto">
  //         <Link href="/privacy-policy" classNameName="text-sm hover:underline">
  //           Политика конфиденциальности
  //         </Link>
  //       </div>

  //       <div classNameName="flex justify-center md:justify-end w-full md:w-auto">
  //         <p classNameName="text-sm">
  //           Свяжитесь с нами:{" "}
  //           <Link href="mailto:qdebkz@gmail.com" classNameName="hover:underline">
  //             qdebkz@gmail.com
  //           </Link>
  //         </p>
  //       </div>
  //     </div>
  //   </footer>
  // )
  return (
    <footer className=" bg-background text-gray-400 px-3 md:px-10 xl:px-19">
      <div className="mx-auto w-full p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center md:items-start">
              <Image
                src="/assets/logo.svg"
                alt="QDeb Logo"
                width={50}
                height={50}
                className="opacity-75 w-32"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase ">
                Ресурсы
              </h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <Link
                    href="/privacy-policy"
                    className="text-sm hover:underline"
                  >
                    Политика конфиденциальности
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase ">
                Подписывайтесь
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a
                    href="https://www.instagram.com/qdebkz/"
                    className="hover:underline "
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://t.me/qdebkz" className="hover:underline">
                    ТГК
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025 QDeb. Все права защищены.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <a
              href="https://t.me/qdebkz"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9.97 15.46 9.8 18.3c.39 0 .56-.17.76-.38l1.83-1.73 3.8 2.77c.7.39 1.19.18 1.37-.64l2.48-11.63.01-.01c.22-1.01-.36-1.41-1.04-1.17L3.64 9.86c-.98.38-.97.93-.17 1.18l3.57 1.11 8.26-5.21c.39-.24.75-.11.46.15" />
              </svg>
              <span className="sr-only">Telegram</span>
            </a>
            <a
              href="https://www.instagram.com/qdebkz?igsh=MWZpM2ltdGo5YXBtdg%3D%3D&utm_source=qr"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 1.5A4.26 4.26 0 0 0 3.5 7.75v8.5A4.26 4.26 0 0 0 7.75 20.5h8.5a4.26 4.26 0 0 0 4.25-4.25v-8.5A4.26 4.26 0 0 0 16.25 3.5h-8.5Zm4.25 3.25A5.26 5.26 0 1 1 6.75 12a5.26 5.26 0 0 1 5.25-5.25Zm0 1.5A3.75 3.75 0 1 0 15.75 12a3.75 3.75 0 0 0-3.75-3.75ZM17.5 6a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
              </svg>
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
