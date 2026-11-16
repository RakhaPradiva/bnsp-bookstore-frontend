import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MdAdd, MdEdit, MdDelete, MdCategory } from "react-icons/md";
import { deleteGenre, getGenres } from "../../../services/genres";

const AdminGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreData = await getGenres();
        setGenres(genreData);
      } catch (error) {
        setError(error.response?.data?.message ?? "Gagal memuat daftar genre.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredGenres = search.trim()
    ? genres.filter(
        (genre) =>
          genre.name?.toLowerCase().includes(search.trim().toLowerCase()) ||
          genre.description
            ?.toLowerCase()
            .includes(search.trim().toLowerCase()),
      )
    : genres;

  const openDeleteModal = (genre) => {
    setGenreToDelete(genre);
    setDeleteError(null);
    deleteModalRef.current?.showModal();
  };

  const closeDeleteModal = () => {
    deleteModalRef.current?.close();
    setGenreToDelete(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!genreToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteGenre(genreToDelete.id);
      setGenres(genres.filter((genre) => genre.id !== genreToDelete.id));
      closeDeleteModal();
    } catch (error) {
      setDeleteError(error.response?.data?.message ?? "Gagal menghapus genre.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-box bg-base-100 border border-base-300">
            <MdCategory className="text-2xl text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Genres</h1>
            <p className="text-sm text-base-content/60">
              Kelola daftar genre buku.
            </p>
          </div>
        </div>
        <Link
          to="/admin/genres/add"
          className="btn btn-primary w-full sm:w-auto"
        >
          <MdAdd className="text-lg" />
          Tambah Genre
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
                placeholder="Cari genre..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Cari genre"
              />
            </label>
            <span className="badge badge-ghost">
              {filteredGenres.length} genre
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra" aria-busy={loading}>
              <caption className="sr-only">
                {loading ? "Memuat daftar genre" : "Daftar genre"}
              </caption>
              <thead>
                <tr>
                  <th className="w-16">#</th>
                  <th>Nama Genre</th>
                  <th>Deskripsi</th>
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
                        <div className="h-4 w-32 animate-pulse rounded bg-base-300" />
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
                ) : filteredGenres.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <MdCategory
                          className="text-4xl text-base-content/30"
                          aria-hidden="true"
                        />
                        <p className="text-lg font-semibold">Belum ada genre</p>
                        <p className="text-sm text-base-content/60">
                          {search
                            ? "Tidak ada genre yang cocok dengan pencarian."
                            : "Tambahkan genre pertama untuk mulai mengelompokkan buku."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredGenres.map((genre, index) => (
                    <tr key={genre.id}>
                      <td className="text-base-content/60">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <p className="font-medium">{genre.name}</p>
                        </div>
                      </td>
                      <td className="max-w-md">
                        <p className="line-clamp-2 text-base-content/70">
                          {genre.description}
                        </p>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <div className="tooltip tooltip-left" data-tip="Edit">
                            <Link
                              to={`/admin/genres/edit/${genre.id}`}
                              className="btn btn-square btn-sm btn-ghost"
                              aria-label={`Edit genre ${genre.name}`}
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
                              aria-label={`Hapus genre ${genre.name}`}
                              onClick={() => openDeleteModal(genre)}
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
        onClose={() => setGenreToDelete(null)}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hapus Genre</h3>
          <p className="py-4 text-base-content/70">
            Yakin ingin menghapus genre{" "}
            <span className="font-semibold text-base-content">
              {genreToDelete?.name}
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

export default AdminGenres;
