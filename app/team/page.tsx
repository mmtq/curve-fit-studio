'use client';

import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon } from 'lucide-react';
import Link from 'next/link';

export default function TeamSection() {
  const team = [
    {
      name: 'Iftaker Ahamed',
      role: 'C221020',
      image: 'https://avatars.githubusercontent.com/u/95583680',
      bg: 'bg-[#3b0a2a]',
      text: 'text-[#f9c2d3]',
      github: 'https://github.com/SayemAhamed',
      linkedin: 'https://www.linkedin.com/in/sayem-ahamed-47b890242/'
    },
    {
      name: 'Mir Md Tarhimul Quader',
      role: 'C221017',
      image: '/hehe.png',
      bg: 'bg-[#0d1b3e]',
      text: 'text-[#facc15]',
      github: 'https://github.com/mmtq',
      linkedin: 'https://www.linkedin.com/in/tarhimul/'
    },
    {
      name: 'Turja Dutta',
      role: 'C221026',
      image: 'https://avatars.githubusercontent.com/u/133532872',
      bg: 'bg-[#2a004f]',
      text: 'text-[#d8b4fe]',
      github: 'https://github.com/duttaturja',
      linkedin: 'https://www.linkedin.com/in/duttaturja/'
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
            Meet the Development <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Team
            </span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-sm">
            This project is the result of collaborative effort by dedicated Computer Science students, combining skills in design, development, and innovation.
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
        <div className="md:flex md:flex-1 gap-4 md:gap-10">
          {team.map(({ name, role, image, bg, text, github, linkedin }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`${bg} rounded-2xl p-6 flex flex-col items-center min-w-[180px] mt-4`}
            >
              <div
                className="rounded-full mb-6 flex items-center justify-center text-5xl bg-white"
                aria-label={name}
              >
                <img
                  src={image}
                  alt={name}
                  className={`w-32 h-32 rounded-full ${index % 2 === 0 ? 'p-1' : ''}`}
                />
              </div>
              <h3 className={`font-semibold ${text} text-center`}>{name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{role}</p>
              <div className="flex gap-4 text-gray-700 dark:text-gray-300">
                <Link href={linkedin}>
                  <LinkedinIcon className={iconClasses} />
                </Link>
                <Link href={github}>
                  <GithubIcon className={iconClasses} />
                </Link>
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
