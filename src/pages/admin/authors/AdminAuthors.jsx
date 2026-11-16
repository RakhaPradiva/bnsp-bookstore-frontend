import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MdAdd, MdEdit, MdDelete, MdPerson } from "react-icons/md";
import { deleteAuthor, getAuthors } from "../../../services/authors";
import { IMAGE_STORAGE } from "../../../api";

const AdminAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorData = await getAuthors();
        setAuthors(authorData);
      } catch (error) {
        setError(
          error.response?.data?.message ?? "Gagal memuat daftar author.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAuthors = search.trim()
    ? authors.filter(
        (author) =>
          author.name?.toLowerCase().includes(search.trim().toLowerCase()) ||
          author.bio?.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : authors;

  const openDeleteModal = (author) => {
    setAuthorToDelete(author);
    setDeleteError(null);
    deleteModalRef.current?.showModal();
  };

  const closeDeleteModal = () => {
    deleteModalRef.current?.close();
    setAuthorToDelete(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!authorToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAuthor(authorToDelete.id);
      setAuthors(authors.filter((author) => author.id !== authorToDelete.id));
      closeDeleteModal();
    } catch (error) {
      setDeleteError(
        error.response?.data?.message ?? "Gagal menghapus author.",
      );
    } finally {
      setDeleting(false);
    }
  };
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-box bg-base-100 border border-base-300">
            <MdPerson className="text-2xl text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Authors</h1>
            <p className="text-sm text-base-content/60">
              Kelola daftar author buku.
            </p>
          </div>
        </div>
        <Link
          to="/admin/authors/add"
          className="btn btn-primary w-full sm:w-auto"
        >
          <MdAdd className="text-lg" />
          Tambah Author
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
                placeholder="Cari author..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Cari author"
              />
            </label>
            <span className="badge badge-ghost">
              {filteredAuthors.length} author
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra" aria-busy={loading}>
              <caption className="sr-only">
                {loading ? "Memuat daftar author" : "Daftar author"}
              </caption>
              <thead>
                <tr>
                  <th className="w-16">#</th>
                  <th>Author</th>
                  <th>Bio</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} aria-hidden="true">
                      <td>
                        <div className="h-4 w-6 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-base-300" />
                          <div className="h-4 w-40 animate-pulse rounded bg-base-300" />
                        </div>
                      </td>
                      <td className="max-w-md">
                        <div className="h-4 w-full max-w-md animate-pulse rounded bg-base-300" />
                        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <div className="h-8 w-8 animate-pulse rounded-box bg-base-300" />
                          <div className="h-8 w-8 animate-pulse rounded-box bg-base-300" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredAuthors.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <MdPerson
                          className="text-4xl text-base-content/30"
                          aria-hidden="true"
                        />
                        <p className="text-lg font-semibold">Belum ada author</p>
                        <p className="text-sm text-base-content/60">
                          {search
                            ? "Tidak ada author yang cocok dengan pencarian."
                            : "Tambahkan author pertama untuk mulai mendata penulis buku."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAuthors.map((author, index) => (
                    <tr key={author.id}>
                      <td className="text-base-content/60">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-16 rounded-full bg-base-300">
                              {author.photo ? (
                                <img
                                  src={`${IMAGE_STORAGE}/authors/${author.photo}`}
                                  alt={`Foto ${author.name}`}
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <MdPerson className="text-lg text-base-content/40" />
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="font-medium">{author.name}</p>
                        </div>
                      </td>
                      <td className="max-w-md">
                        <p className="line-clamp-2 text-base-content/70">
                          {author.bio}
                        </p>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <div className="tooltip tooltip-left" data-tip="Edit">
                            <Link
                              to={`/admin/authors/edit/${author.id}`}
                              className="btn btn-square btn-sm btn-ghost"
                              aria-label={`Edit author ${author.name}`}
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
                              aria-label={`Hapus author ${author.name}`}
                              onClick={() => openDeleteModal(author)}
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
        onClose={() => setAuthorToDelete(null)}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hapus Author</h3>
          <p className="py-4 text-base-content/70">
            Yakin ingin menghapus author{" "}
            <span className="font-semibold text-base-content">
              {authorToDelete?.name}
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

export default AdminAuthors;
