import { Link } from "react-router-dom";
import { MdArrowForward, MdCheckCircle } from "react-icons/md";

const benefits = [
  "Koleksi buku original pilihan",
  "Pesanan diproses cepat",
  "Riwayat transaksi tersimpan rapi",
];

const CTA = () => {
  return (
    <section
      aria-labelledby="cta-title"
      className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="card rounded-box bg-primary text-primary-content">
          <div className="card-body items-center gap-6 px-6 py-10 text-center sm:px-10 sm:py-14 lg:px-16">
            <span className="badge badge-outline badge-sm border-primary-content/40">
              Gabung Sekarang
            </span>

            <div className="max-w-2xl">
              <h2
                id="cta-title"
                className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
              >
                Mulai perjalanan membaca Anda bersama Bookstore
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-primary-content/80 sm:text-base">
                Buat akun gratis untuk menyimpan buku favorit, memantau pesanan,
                dan mendapat rekomendasi bacaan yang sesuai dengan minat Anda.
              </p>
            </div>

            <ul
              role="list"
              className="flex flex-col items-center gap-2 text-sm text-primary-content/90 sm:flex-row sm:gap-6"
            >
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-1.5">
                  <MdCheckCircle className="h-4 w-4" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/register"
                className="btn btn-secondary w-full sm:w-auto"
              >
                Daftar Gratis
                <MdArrowForward className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                to="/books"
                className="btn btn-outline w-full border-primary-content/50 text-primary-content hover:border-primary-content hover:bg-primary-content hover:text-primary sm:w-auto"
              >
                Lihat Koleksi Buku
              </Link>
            </div>

            <p className="text-xs text-primary-content/70">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="link link-hover font-semibold text-primary-content"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
