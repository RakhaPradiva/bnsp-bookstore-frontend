import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdMenuBook, MdCheckCircle } from "react-icons/md";
import { TbXboxX } from "react-icons/tb";
import { showBook, updateBook } from "../../../services/books";
import { getGenres } from "../../../services/genres";
import { getAuthors } from "../../../services/authors";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    stock: 0,
    genre_id: 0,
    author_id: 0,
    cover_photo: null,
    description: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const successModalRef = useRef(null);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [genreData, authorData, bookData] = await Promise.all([
          getGenres(),
          getAuthors(),
          showBook(id),
        ]);
        setGenres(genreData);
        setAuthors(authorData);
        setFormData({
          title: bookData.title,
          price: bookData.price,
          stock: bookData.stock,
          genre_id: bookData.genre_id,
          author_id: bookData.author_id,
          cover_photo: bookData.cover_photo,
          description: bookData.description,
        });
      } catch (error) {
        setError(error.response?.data?.message ?? null);
      }
    };

    fetchOptions();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "cover_photo") {
      setFormData({
        ...formData,
        cover_photo: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    try {
      const payload = new FormData();
      for (const key in formData) {
        if (key === "cover_photo") {
          if (formData.cover_photo instanceof File) {
            payload.append("cover_photo", formData.cover_photo);
          }
        } else {
          payload.append(key, formData[key]);
        }
      }

      await updateBook(id, payload);
      setSubmitted(true);
      setFormData({
        title: "",
        price: 0,
        stock: 0,
        genre_id: 0,
        author_id: 0,
        cover_photo: null,
        description: "",
      });
      successModalRef.current?.showModal();
    } catch (error) {
      setError(error.response?.data?.message ?? null);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    successModalRef.current?.close();
    navigate("/admin/books");
  };

  const errorEntries =
    error instanceof Error || typeof error === "string"
      ? [["_", [error.message ?? error]]]
      : error && typeof error === "object"
        ? Object.entries(error)
        : [];

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-box bg-base-100 border border-base-300">
          <MdMenuBook className="text-2xl text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Edit Buku</h1>
        </div>
      </header>

      {errorEntries.length > 0 && (
        <div role="alert" className="alert alert-error">
          <TbXboxX className="h-5 w-5" />
          <ul className="list-disc pl-5 text-sm">
            {errorEntries.map(([field, messages]) =>
              Array.isArray(messages)
                ? messages.map((message, index) => (
                    <li key={`${field}-${index}`}>{message}</li>
                  ))
                : [<li key={field}>{String(messages)}</li>],
            )}
          </ul>
        </div>
      )}

      <div className="card bg-base-100 border border-base-300">
        <form onSubmit={handleSubmit} className="card-body gap-4 p-4 sm:p-6">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Judul Buku</legend>
            <input
              type="text"
              name="title"
              className="input w-full"
              placeholder="Contoh: Laskar Pelangi"
              value={formData.title}
              onChange={handleChange}
            />
          </fieldset>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Genre</legend>
              <select
                name="genre_id"
                className="select w-full"
                value={formData.genre_id}
                onChange={handleChange}
              >
                <option value={0} disabled>
                  Pilih genre
                </option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Author</legend>
              <select
                name="author_id"
                className="select w-full"
                value={formData.author_id}
                onChange={handleChange}
              >
                <option value={0} disabled>
                  Pilih author
                </option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Harga</legend>
              <input
                type="number"
                name="price"
                min={1}
                className="input w-full"
                placeholder="0"
                value={formData.price}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Stok</legend>
              <input
                type="number"
                name="stock"
                min={0}
                className="input w-full"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
              />
            </fieldset>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Cover</legend>
            <input
              type="file"
              name="cover_photo"
              accept="image/*"
              className="file-input w-full"
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Deskripsi</legend>
            <textarea
              name="description"
              className="textarea w-full"
              placeholder="Deskripsi"
              rows={5}
              value={formData.description}
              onChange={handleChange}
            />
          </fieldset>

          <div className="card-actions justify-end gap-2 pt-2">
            <Link to="/admin/books" className="btn btn-ghost">
              Batal
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              {loading ? "Menyimpan..." : "Simpan Buku"}
            </button>
          </div>
        </form>
      </div>

      <dialog
        ref={successModalRef}
        className="modal"
        onClose={submitted ? closeModal : undefined}
      >
        <div className="modal-box">
          <div className="flex flex-col items-center gap-3 text-center">
            <MdCheckCircle className="text-5xl text-success" />
            <h3 className="text-lg font-bold">Buku berhasil diperbaharui!</h3>
            <p className="text-sm text-base-content/60">
              Data buku baru sudah tersimpan.
            </p>
          </div>
          <div className="modal-action justify-center">
            <form method="dialog">
              <button className="btn btn-primary">Tutup</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Tutup</button>
        </form>
      </dialog>
    </section>
  );
};

export default EditBook;
