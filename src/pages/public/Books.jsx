import { useEffect, useMemo, useState } from "react";
import { getBooks } from "../../services/books";
import { BookCard } from "../../components/";
import { IoMdSearch } from "react-icons/io";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookData = await getBooks();
        setBooks(bookData ?? []);
      } catch (error) {
        console.log(error);
        setError("Gagal memuat daftar buku.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return books;

    return books.filter(
      (book) =>
        book.title?.toLowerCase().includes(keyword) ||
        book.author?.name?.toLowerCase().includes(keyword) ||
        book.genre?.name?.toLowerCase().includes(keyword),
    );
  }, [books, search]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Daftar Buku</h1>
        <p className="text-base-content/60">
          {loading
            ? "Memuat buku..."
            : `${filteredBooks.length} buku ditemukan`}
        </p>
      </header>

      <div className="card mb-8 bg-base-200">
        <div className="card-body gap-4 p-4 sm:p-6">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Cari buku</legend>
            <label className="input w-full">
              <IoMdSearch className="h-5 w-5" />

              <input
                type="search"
                className="grow"
                placeholder="Cari judul, penulis, atau genre..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Cari buku berdasarkan judul, penulis, atau genre"
              />
            </label>
          </fieldset>
        </div>
      </div>

      {error && (
        <div role="alert" className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <span
            className="loading loading-spinner loading-lg"
            aria-label="Memuat"
          />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-lg font-semibold">Buku tidak ditemukan</p>
          <p className="text-base-content/60">Coba kata kunci lain.</p>
          {search && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setSearch("")}
            >
              Reset pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Books;
