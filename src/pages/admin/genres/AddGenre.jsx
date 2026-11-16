import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdCategory, MdCheckCircle } from "react-icons/md";
import { TbXboxX } from "react-icons/tb";
import { createGenre } from "../../../services/genres";

const AddGenre = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const successModalRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    try {
      const payload = new FormData();
      for (const key in formData) {
        payload.append(key, formData[key]);
      }
      await createGenre(payload);
      setSubmitted(true);
      setFormData({ name: "", description: "" });
      successModalRef.current?.showModal();
    } catch (error) {
      setError(error.response?.data?.message ?? null);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    successModalRef.current?.close();
    navigate("/admin/genres");
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
          <MdCategory className="text-2xl text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Tambah Genre</h1>
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
            <legend className="fieldset-legend">Nama Genre</legend>
            <input
              type="text"
              name="name"
              className="input w-full"
              placeholder="Contoh: Fiksi, Sejarah, Teknologi"
              value={formData.name}
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
            <Link to="/admin/genres" className="btn btn-ghost">
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
              {loading ? "Menyimpan..." : "Simpan Genre"}
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
            <h3 className="text-lg font-bold">Genre berhasil ditambahkan!</h3>
            <p className="text-sm text-base-content/60">
              Data genre baru sudah tersimpan.
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

export default AddGenre;
