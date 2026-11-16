import { Link } from "react-router-dom";
import {
  MdArrowForward,
  MdLocalShipping,
  MdVerified,
  MdLock,
} from "react-icons/md";
import heroImg from "../assets/hero-image.jpg";

const perks = [
  { icon: MdVerified, label: "100% buku original" },
  { icon: MdLocalShipping, label: "Packing aman & rapi" },
  { icon: MdLock, label: "Pembayaran terpercaya" },
];

const Hero = () => {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero bg-base-200 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="hero-content w-full max-w-6xl flex-col gap-10 p-0 lg:flex-row lg:justify-between lg:gap-16">
        <div className="w-full max-w-xl text-center lg:text-left">
          <span className="badge badge-outline badge-sm sm:badge-md">
            Rekomendasi Bulan Ini
          </span>
          <h1
            id="hero-title"
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Filosofi Teras
          </h1>
          <p className="mt-2 text-sm font-medium text-base-content/70 sm:text-base">
            oleh Henry Manampiring
          </p>
          <p className="mt-4 text-sm leading-relaxed text-base-content/70 sm:text-base">
            Filsafat Stoa untuk hidup yang lebih tenang dan bahagia. Temukan
            edisi ini beserta koleksi buku pilihan lainnya di Bookstore.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link to="/books" className="btn btn-primary w-full sm:w-auto">
              Jelajahi Buku
              <MdArrowForward className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link to="/about" className="btn btn-outline w-full sm:w-auto">
              Tentang Kami
            </Link>
          </div>

          <ul
            role="list"
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-base-content/60 sm:text-sm lg:justify-start"
          >
            {perks.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <figure className="w-44 shrink-0 sm:w-56 lg:w-80">
          <img
            src={heroImg}
            alt="Sampul buku Filosofi Teras karya Henry Manampiring"
            className="w-full rounded-box border border-base-300 object-cover shadow-md"
          />
        </figure>
      </div>
    </section>
  );
};

export default Hero;
