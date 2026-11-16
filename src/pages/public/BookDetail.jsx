import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { showBook } from "../../services/books";
import { createCart, getCarts } from "../../services/carts";
import { IMAGE_STORAGE } from "../../api";
import { rupiah } from "../../utils";
import { BsCartPlus } from "react-icons/bs";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [cartQty, setCartQty] = useState(0);

  const getAvailableStock = (stock, cartQuantity) => {
    if (stock === null || stock === undefined) return stock;
    return Math.max(0, stock - cartQuantity);
  };

  const availableStock = getAvailableStock(book?.stock, cartQty);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookData = await showBook(id);
        setBook(bookData);
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCartQty = async (bookId) => {
      const token = localStorage.getItem("access-token");
      if (!token) return;
      try {
        const data = await getCarts();
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        const found = items.find(
          (item) => (item.book?.id ?? item.book_id) === Number(bookId),
        );
        setCartQty(found?.quantity ?? 0);
      } catch {
        alert("Terjadi Kesalahan");
      }
    };

    fetchData();
    fetchCartQty(id);

    /* Perbarui cartQty setiap kali keranjang berubah */
    const onCartUpdated = () => fetchCartQty(id);
    window.addEventListener("cart-updated", onCartUpdated);
    return () => window.removeEventListener("cart-updated", onCartUpdated);
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access-token");
    if (!token) {
      return navigate("/login");
    }
    setAdding(true);
    try {
      await createCart({ book_id: book.id, quantity: 1 });
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  return loading ? (
    <section className="mx-auto flex w-full max-w-7xl justify-center px-4 py-16 sm:px-6 lg:px-8">
      <span
        className="loading loading-spinner loading-lg"
        aria-label="Loading"
      />
    </section>
  ) : error ? (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div role="alert" className="alert alert-error">
        <span>{error}</span>
      </div>
      <Link to="/books" className="btn btn-ghost mt-4">
        Kembali ke daftar buku
      </Link>
    </section>
  ) : book ? (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="breadcrumbs mb-6 text-sm">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/books">Buku</Link>
          </li>
          <li className="text-base-content/60">{book.title}</li>
        </ul>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="card overflow-hidden border border-base-300 bg-base-200 shadow-sm">
            <figure className="aspect-3/4 overflow-hidden bg-base-300">
              <img
                src={`${IMAGE_STORAGE}/books/${book.cover_photo}`}
                alt={`cover ${book.title}`}
                className="h-full w-full object-cover"
              />
            </figure>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {book.genre?.name ? (
                <span className="badge badge-ghost">{book.genre.name}</span>
              ) : null}
              {availableStock !== null && availableStock !== undefined ? (
                <span
                  className={
                    availableStock > 0
                      ? "badge badge-success badge-soft"
                      : "badge badge-error badge-soft"
                  }
                >
                  {availableStock > 0
                    ? `Stok: ${availableStock}`
                    : "Stok habis"}
                </span>
              ) : null}
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">{book.title}</h1>
            <p className="text-base-content/70">
              Penulis:{" "}
              <span className="font-medium text-base-content">
                {book.author?.name ?? "-"}
              </span>
            </p>
          </div>

          <div className="card bg-base-200">
            <div className="card-body p-4 sm:p-6">
              <span className="text-sm text-base-content/60">Harga</span>
              <span className=" text-xl lg:text-3xl font-bold text-primary">
                {rupiah(book.price)}
              </span>
            </div>
          </div>

          <div className="flex flex-col  gap-5 xl:gap-3 sm:flex-row">
            <button
              type="button"
              className="btn btn-primary btn-md"
              onClick={handleAddToCart}
              disabled={availableStock === 0 || adding}
            >
              <BsCartPlus className="h-5 w-5" />

              {adding ? (
                <span
                  className="loading loading-spinner loading-sm"
                  aria-label="Menambahkan"
                />
              ) : (
                "Tambah ke Keranjang"
              )}
            </button>
          </div>

          <div className="divider"></div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Deskripsi</h2>
            <p className="whitespace-pre-line leading-relaxed text-base-content/80">
              {book.description || "Belum ada deskripsi."}
            </p>
          </div>
        </div>
      </div>
    </section>
  ) : null;
};

export default BookDetail;
