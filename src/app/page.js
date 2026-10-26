'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const goToSignupChercheur = () => {
    router.push('/signup-chercheur');
  };

  const goToSignupEntreprise = () => {
    router.push('/signup-entreprise');
  };

  return (
    <main className="bg-[#0b1526] text-white font-sans">
      {/* Header Section */}
      <section className="relative h-[50vh] w-full">
        <Image
          src="/IMG 9.jpg"
          alt="Background"
          fill
          className="object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Accélérez vos projets <br /> d’innovation scientifiques
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={goToSignupEntreprise}
              className="px-6 py-3 bg-[#3db6f7] text-white rounded-lg hover:bg-[#319ed6] transition"
            >
             Publier un besoin
            </button>
            <button
              onClick={goToSignupChercheur}
              className="px-6 py-3 bg-[#1f3c88] text-white rounded-lg hover:bg-[#162b6f] transition"
            >
              Trouver un projet
            </button>
            <button
              onClick={() => router.push('/login-chercheur')}
              className="px-6 py-3 bg-[#45B4D0] text-white rounded-lg hover:bg-[#3aa0b9] transition"
            >
              Se connecter
            </button>
          </div>
        </div>
      </section>

      {/* Platform Description */}
      <section className="py-12 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">
            La plateforme de mise en relation entre chercheurs et entreprises
          </h2>
          <p className="text-gray-10">
            Facilitez la collaboration en recherche & développement et innovation en connectant les entreprises avec les laboratoires de recherche et les chercheurs universitaires.
          </p>
        </div>
        <Image
          src="/img 1.webp"
          alt="Handshake"
          width={300}
          height={200}
          className="rounded-xl shadow-lg"
        />
      </section>

      {/* Stats */}
      <section className="py-12 border-t border-gray-700">
        <h3 className="text-center text-2xl font-semibold mb-10">Statistiques d’impact</h3>
        <div className="flex justify-center gap-12 text-center">
          <div>
            <p className="text-4xl font-bold text-[#3db6f7]">200+</p>
            <p className="text-gray-300">chercheurs inscrits</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-[#3db6f7]">150</p>
            <p className="text-gray-300">projets publié</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-[#3db6f7]">300</p>
            <p className="text-gray-300">mises en relation</p>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h3 className="text-center text-2xl font-semibold mb-10">Pourquoi rejoindre notre plateforme</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#0e1d34] p-6 rounded-xl text-center">
            <p className="text-lg font-medium">Large réseau de chercheurs et entreprise</p>
          </div>
          <div className="bg-[#0e1d34] p-6 rounded-xl text-center">
            <p className="text-lg font-medium">Appels à projets ciblés et personnalisée</p>
          </div>
          <div className="bg-[#0e1d34] p-6 rounded-xl text-center">
            <p className="text-lg font-medium">Outils de recherche et messagerie sécurisée</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b1526] border-t border-gray-800 py-8 px-6">
        <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto text-sm text-gray-400">
          <div>
            <p>© 2025 CollabScience. All rights reserved</p>
            <p>Powered by Next.js, Supabase, and Vercel. Designed with ❤️ using Figma.</p>
          </div>
          <div className="mt-6 md:mt-0">
            <p className="font-semibold text-white mb-2">Quick Links</p>
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div className="mt-6 md:mt-0">
            <p className="font-semibold text-white mb-2">Contact Us</p>
            <div className="flex gap-3">
              <Image src="/gmail.png" alt="gmail" width={20} height={20} />
              <Image src="/linkedin.png" alt="linkedin" width={20} height={20} />
              <Image src="/github.png" alt="github" width={20} height={20} />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
