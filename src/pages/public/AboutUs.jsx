import { Link } from "react-router-dom";
import {
  MdMenuBook,
  MdVerified,
  MdLocalShipping,
  MdLock,
  MdAutoStories,
  MdArrowForward,
} from "react-icons/md";

const values = [
  {
    icon: MdVerified,
    title: "100% buku original",
    description: "Setiap judul diperiksa kondisinya sebelum dikirim.",
  },
  {
    icon: MdAutoStories,
    title: "Koleksi terkurasi",
    description: "Judul pilihan dari berbagai genre untuk semua pembaca.",
  },
  {
    icon: MdLocalShipping,
    title: "Packing aman",
    description: "Dikemas rapi agar buku tiba tanpa lecet atau cacat.",
  },
  {
    icon: MdLock,
    title: "Pembayaran aman",
    description: "Transaksi diproses melalui kanal pembayaran terpercaya.",
  },
];

const AboutUs = () => {
  return (
    <main>
      <section
        aria-labelledby="about-title"
        className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <header className="max-w-2xl">
            <span className="badge badge-outline badge-sm">Tentang Kami</span>
            <h1
              id="about-title"
              className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Bookstore, tempat buku pilihan bertemu pembacanya
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-base-content/70 sm:text-base">
              Kami percaya setiap pembaca berhak menemukan buku yang tepat tanpa
              harus menghabiskan waktu mencari.
            </p>
          </header>

          <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:mt-12 lg:grid-cols-2 lg:gap-12">
            <div className="card bg-base-200 border border-base-300">
              <div className="card-body items-center gap-5 px-6 py-12 text-center sm:py-16">
                <div className="flex h-28 w-28 items-center justify-center rounded-box bg-primary text-primary-content shadow-md">
                  <MdMenuBook className="h-16 w-16" aria-hidden="true" />
                </div>

                <div>
                  <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Bookstore
                  </p>
                  <p className="mt-2 text-sm text-base-content/70">
                    Toko buku online untuk pembaca Indonesia
                  </p>
                </div>

                <ul role="list" className="flex flex-wrap justify-center gap-2">
                  {["Original", "Kurasi Pilihan", "Kirim Cepat"].map((tag) => (
                    <li key={tag}>
                      <span className="badge badge-outline badge-sm">
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Dibangun untuk pembaca yang menghargai kualitas
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-base-content/70 sm:text-base">
                Bookstore berawal dari kebiasaan sederhana: membaca dan berbagi
                rekomendasi buku. Dari situ kami membangun toko yang
                mengutamakan kualitas koleksi, kejelasan informasi, dan
                kemudahan setiap proses pesanan.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-base-content/70 sm:text-base">
                Tim kami memilih buku dari penerbit terpercaya, memeriksa
                kondisi setiap eksemplar, dan memastikan pengiriman sampai
                dengan aman. Fokus kami bukan sekadar menjual buku, tetapi
                membantu Anda menemukan bacaan yang layak untuk waktu Anda.
              </p>

              <ul
                role="list"
                className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {values.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex items-start gap-3">
                    <Icon
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-base-content/70">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/books" className="btn btn-primary w-full sm:w-auto">
                  Jelajahi Koleksi Buku
                  <MdArrowForward className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="btn btn-outline w-full sm:w-auto"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
