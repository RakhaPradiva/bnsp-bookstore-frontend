import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MdAdd, MdEdit, MdDelete, MdMenuBook } from "react-icons/md";
import { deleteBook, getBooks } from "../../../services/books";
import { IMAGE_STORAGE } from "../../../api";
import { rupiah } from "../../../utils";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookData = await getBooks();
        setBooks(bookData);
      } catch (error) {
        setError(error.response?.data?.message ?? "Gagal memuat daftar buku.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = search.trim()
    ? books.filter(
        (book) =>
          book.title?.toLowerCase().includes(search.trim().toLowerCase()) ||
          book.author?.name
            ?.toLowerCase()
            .includes(search.trim().toLowerCase()),
      )
    : books;

  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setDeleteError(null);
    deleteModalRef.current?.showModal();
  };

  const closeDeleteModal = () => {
    deleteModalRef.current?.close();
    setBookToDelete(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!bookToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteBook(bookToDelete.id);
      setBooks(books.filter((book) => book.id !== bookToDelete.id));
      closeDeleteModal();
    } catch (error) {
      setDeleteError(error.response?.data?.message ?? "Gagal menghapus buku.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-box bg-base-100 border border-base-300">
            <MdMenuBook className="text-2xl text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Books</h1>
            <p className="text-sm text-base-content/60">Kelola daftar buku.</p>
          </div>
        </div>
        <Link
          to="/admin/books/add"
          className="btn btn-primary w-full sm:w-auto"
        >
          <MdAdd className="text-lg" />
          Tambah Buku
        </Link>
      </header>

      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="input w-full sm:max-w-xs">
              <input
                type="search"
                className="grow"
                placeholder="Cari buku..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Cari buku"
              />
            </label>
            <span className="badge badge-ghost">
              {filteredBooks.length} buku
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra" aria-busy={loading}>
              <caption className="sr-only">
                {loading ? "Memuat daftar buku" : "Daftar buku"}
              </caption>
              <thead>
                <tr>
                  <th className="w-16">#</th>
                  <th>Judul</th>
                  <th>Genre</th>
                  <th>Author</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index} aria-hidden="true">
                      <td>
                        <div className="h-4 w-6 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-80 w-60 shrink-0 animate-pulse rounded-box bg-base-300" />
                          <div className="h-5 w-40 animate-pulse rounded bg-base-300" />
                        </div>
                      </td>
                      <td>
                        <div className="h-6 w-16 animate-pulse rounded-full bg-base-300" />
                      </td>
                      <td>
                        <div className="h-4 w-28 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="h-4 w-24 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="h-4 w-8 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <div className="h-8 w-8 animate-pulse rounded-box bg-base-300" />
                          <div className="h-8 w-8 animate-pulse rounded-box bg-base-300" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <MdMenuBook
                          className="text-4xl text-base-content/30"
                          aria-hidden="true"
                        />
                        <p className="text-lg font-semibold">Belum ada buku</p>
                        <p className="text-sm text-base-content/60">
                          {search
                            ? "Tidak ada buku yang cocok dengan pencarian."
                            : "Tambahkan buku pertama untuk mulai mengisi katalog."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book, index) => (
                    <tr key={book.id}>
                      <td className="text-base-content/60">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-80 w-60 shrink-0 overflow-hidden rounded-box bg-base-300">
                            {book.cover_photo ? (
                              <img
                                src={`${IMAGE_STORAGE}/books/${book.cover_photo}`}
                                alt={`Cover ${book.title}`}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <MdMenuBook className="text-lg text-base-content/40" />
                              </div>
                            )}
                          </div>
                          <p className="max-w-xs text-lg font-medium">
                            {book.title}
                          </p>
                        </div>
                      </td>
                      <td>
                        {book.genre?.name ? (
                          <span className="badge badge-ghost">
                            {book.genre.name}
                          </span>
                        ) : (
                          <span className="text-base-content/40">-</span>
                        )}
                      </td>
                      <td className="text-base-content/70">
                        {book.author?.name ?? "-"}
                      </td>
                      <td className="whitespace-nowrap font-medium">
                        {rupiah(book.price)}
                      </td>
                      <td className="whitespace-nowrap font-medium">
                        {book.stock}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <div className="tooltip tooltip-left" data-tip="Edit">
                            <Link
                              to={`/admin/books/edit/${book.id}`}
                              className="btn btn-square btn-sm btn-ghost"
                              aria-label={`Edit buku ${book.title}`}
                            >
                              <MdEdit className="text-lg" />
                            </Link>
                          </div>
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Hapus"
                          >
                            <button
                              type="button"
                              className="btn btn-square btn-sm btn-ghost text-error"
                              aria-label={`Hapus buku ${book.title}`}
                              onClick={() => openDeleteModal(book)}
                            >
                              <MdDelete className="text-lg" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <dialog
        ref={deleteModalRef}
        className="modal"
        onClose={() => setBookToDelete(null)}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hapus Buku</h3>
          <p className="py-4 text-base-content/70">
            Yakin ingin menghapus buku{" "}
            <span className="font-semibold text-base-content">
              {bookToDelete?.title}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
          {deleteError && (
            <div role="alert" className="alert alert-error mb-4">
              <span>{deleteError}</span>
            </div>
          )}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeDeleteModal}
              disabled={deleting}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && (
                <span className="loading loading-spinner loading-sm" />
              )}
              Hapus
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </section>
  );
};

export default AdminBooks;
