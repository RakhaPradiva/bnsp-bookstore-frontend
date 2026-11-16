import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdPerson, MdCheckCircle } from "react-icons/md";
import { TbXboxX } from "react-icons/tb";
import { updateAuthor, showAuthor } from "../../../services/authors";
const EditAuthor = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    photo: null,
    bio: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const successModalRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setFormData({
        ...formData,
        photo: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorData = await showAuthor(id);
        setFormData({
          name: authorData.name,
          photo: authorData.photo,
          bio: authorData.bio,
        });
      } catch (error) {
        setError(error.response?.data?.message);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    try {
      const payload = new FormData();
      for (const key in formData) {
        if (key === "photo") {
          if (formData.photo instanceof File) {
            payload.append("photo", formData.photo);
          }
        } else {
          payload.append(key, formData[key]);
        }
      }
      await updateAuthor(id, payload);
      setSubmitted(true);
      setFormData({ name: "", photo: null, bio: "" });
      successModalRef.current?.showModal();
    } catch (error) {
      setError(error.response?.data?.message ?? null);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    successModalRef.current?.close();
    navigate("/admin/authors");
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
          <MdPerson className="text-2xl text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Edit Author</h1>
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
            <legend className="fieldset-legend">Nama Author</legend>
            <input
              type="text"
              name="name"
              className="input w-full"
              placeholder="Contoh: Andrea Hirata"
              value={formData.name}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Foto</legend>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="file-input w-full"
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Bio</legend>
            <textarea
              name="bio"
              className="textarea w-full"
              placeholder="Bio"
              rows={5}
              value={formData.bio}
              onChange={handleChange}
            />
          </fieldset>

          <div className="card-actions justify-end gap-2 pt-2">
            <Link to="/admin/authors" className="btn btn-ghost">
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
              {loading ? "Menyimpan..." : "Simpan Author"}
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
            <h3 className="text-lg font-bold">Author berhasil diperbaharui!</h3>
            <p className="text-sm text-base-content/60">
              Data author baru sudah tersimpan.
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

export default EditAuthor;
