'use client';

import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon } from 'lucide-react';

export default function TeamSection() {
  const team = [
    {
      name: 'Iftaker Ahamed',
      role: 'C221020',
      image: 'https://avatars.githubusercontent.com/u/95583680',
      bg: 'bg-pink-200 dark:bg-pink-800',
      text: 'text-pink-900 dark:text-pink-200',
    },
    {
      name: 'Mir Md Tarihmul Quader',
      role: 'C221017',
      image: 'https://avatars.githubusercontent.com/u/147413532',
      bg: 'bg-orange-200 dark:bg-orange-800',
      text: 'text-orange-900 dark:text-orange-200',
    },
    {
      name: 'Turja Dutta',
      role: 'C221026',
      image: 'https://avatars.githubusercontent.com/u/133532872',
      bg: 'bg-purple-200 dark:bg-purple-800',
      text: 'text-purple-900 dark:text-purple-200',
    },
  ];

  const iconClasses =
    'w-5 h-5 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors';

  return (
    <section className="max-w-7xl min-h-[90vh] mx-auto px-6 py-16 select-none">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 max-w-md"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight dark:text-white">
            Our Best Working <br /> Team
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-sm">
            Effective teams communicate openly, leverage strengths, and embrace diversity for success.
          </p>
          {/* <button
            type="button"
            className="mt-8 bg-blue-600 text-white rounded-full px-6 py-3 text-sm font-medium
            hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Join Our Team
          </button> */}
        </motion.div>

        {/* Team Cards */}
        <div className="flex flex-1 gap-8 md:gap-10">
          {team.map(({ name, role, image, bg, text }) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`${bg} rounded-2xl p-6 flex flex-col items-center min-w-[180px]`}
            >
              <div
                className=" rounded-xl mb-6 flex items-center justify-center text-5xl"
                aria-label={name}
              >
                <img src={image} alt={name} className='w-32 h-32 rounded-lg' />
              </div>
              <h3 className={`font-semibold ${text} text-center`}>{name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{role}</p>
              <div className="flex gap-4 text-gray-700 dark:text-gray-300">
                {/* Icons for social */}
                <LinkedinIcon className={iconClasses} />
                <GithubIcon className={iconClasses} />
                <svg
                  className={iconClasses}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M22.675 0h-21.35C.59 0 0 .593 0 1.326v21.348C0 23.407.59 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.466.099 2.797.143v3.24l-1.92.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.59l-.467 3.622h-3.123V24h6.116c.733 0 1.324-.593 1.324-1.326V1.326C24 .593 23.408 0 22.675 0z" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
