import { useRef, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { TbXboxX } from "react-icons/tb";
import { createContactMessage } from "../../services/contacts";

const Contact = () => {
  const userInfo = JSON.parse(localStorage.getItem("user-info")) ?? null;

  const [formData, setFormData] = useState({
    name: userInfo?.name ?? "",
    email: userInfo?.email ?? "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const successModalRef = useRef(null);

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
    setError(null);
    try {
      await createContactMessage(formData);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      successModalRef.current?.showModal();
    } catch (error) {
      setError(
        error.response?.data?.data ?? error.response?.data?.message ?? null,
      );
    } finally {
      setLoading(false);
    }
  };

  const errorEntries =
    error instanceof Error || typeof error === "string"
      ? [["_", [error.message ?? error]]]
      : error && typeof error === "object"
        ? Object.entries(error)
        : [];

  return (
    <section className="flex justify-center items-center flex-col w-full px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col text-center gap-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Hubungi Kami</h1>
      </header>

      {errorEntries.length > 0 && (
        <div role="alert" className="alert alert-error mb-6">
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

      <div className="card max-w-2xl bg-base-100 border border-base-300">
        <form onSubmit={handleSubmit} className="card-body gap-4 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Nama</legend>
              <input
                type="text"
                name="name"
                className="input w-full"
                placeholder="Nama lengkap"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                name="email"
                className="input w-full"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </fieldset>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Subjek</legend>
            <input
              type="text"
              name="subject"
              className="input w-full"
              placeholder="Contoh: Pertanyaan tentang pengiriman"
              value={formData.subject}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Pesan</legend>
            <textarea
              name="message"
              className="textarea w-full"
              placeholder="Tulis pesan Anda di sini..."
              rows={6}
              value={formData.message}
              onChange={handleChange}
            />
          </fieldset>

          <div className="card-actions justify-end pt-2">
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
              disabled={loading}
            >
              {loading && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              {loading ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </div>
        </form>
      </div>

      <dialog ref={successModalRef} className="modal">
        <div className="modal-box">
          <div className="flex flex-col items-center gap-3 text-center">
            <MdCheckCircle className="text-5xl text-success" />
            <h3 className="text-lg font-bold">Pesan berhasil dikirim!</h3>
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

export default Contact;
