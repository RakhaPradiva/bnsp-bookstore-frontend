import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCarts, deleteCart } from "../../services/carts";
import { createTransaction } from "../../services/transactions";
import { createPayment } from "../../services/payment";
import { IMAGE_STORAGE } from "../../api";
import { rupiah } from "../../utils";
import { AiFillCheckCircle } from "react-icons/ai";

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Transfer Bank", requiresProof: true },
  { value: "e-wallet", label: "E-Wallet", requiresProof: true },
  { value: "credit_card", label: "Kartu Kredit", requiresProof: true },
  { value: "cod", label: "Bayar di Tempat (COD)", requiresProof: false },
];

const getMethod = (value) =>
  PAYMENT_METHODS.find((method) => method.value === value) ??
  PAYMENT_METHODS[0];

const Checkout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access-token");
  const [userInfo] = useState(() =>
    JSON.parse(localStorage.getItem("user-info") ?? "null"),
  );

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: "",
    notes: "",
    payment_method: "bank_transfer",
    payment_proof: null,
  });

  const selectedMethod = getMethod(formData.payment_method);
  const requiresProof = selectedMethod.requiresProof;

  useEffect(() => {
    let active = true;

    if (!token || !userInfo) {
      return navigate("/");
    } else if (userInfo.role === "admin") {
      navigate("/admin");
    }

    const fetchData = async () => {
      try {
        const data = await getCarts();
        if (active) setItems(Array.isArray(data) ? data : (data?.data ?? []));
      } catch (error) {
        console.log(error);
        if (active) setError("Gagal memuat keranjang.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [token, navigate, userInfo]);

  const getBook = (item) => item.book ?? {};
  const getPrice = (item) => getBook(item).price ?? item.price ?? 0;
  const totalItems = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + getPrice(item) * (item.quantity ?? 0),
    0,
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "payment_proof") {
      setFormData({
        ...formData,
        payment_proof: files[0],
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
    setError(null);

    if (!token) {
      return navigate("/login");
    }
    if (items.length === 0 && !success) {
      return setError("Keranjang kosong. Tambahkan buku terlebih dahulu.");
    }
    if (!formData.shipping_address.trim()) {
      return setError("Alamat pengiriman wajib diisi.");
    }
    if (requiresProof && !formData.payment_proof) {
      return setError("Bukti pembayaran wajib diunggah untuk metode ini.");
    }

    setSubmitting(true);
    try {
      const transactionData = {
        shipping_address: formData.shipping_address,
        notes: formData.notes,
        items: items.map((item) => ({
          book_id: getBook(item).id ?? item.book_id,
          quantity: item.quantity,
        })),
      };

      const transactionResult = await createTransaction(transactionData);
      const transactionId = transactionResult?.data?.id;

      if (!transactionId) {
        throw new Error("Gagal mendapatkan ID transaksi.");
      }

      await createPayment({
        transaction_id: transactionId,
        payment_method: formData.payment_method,
        payment_proof: formData.payment_proof,
      });

      await Promise.all(items.map((item) => deleteCart(item.id)));

      window.dispatchEvent(new Event("cart-updated"));

      setSuccess(true);
    } catch (error) {
      const data = error.response?.data;
      const fieldErrors = data?.data ? Object.values(data.data).flat() : [];
      setError(
        fieldErrors[0] ??
          data?.message ??
          error.message ??
          "Gagal membuat pesanan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccess(false);
    navigate("/");
  };

  if (loading) {
    return (
      <section className="mx-auto flex w-full max-w-7xl justify-center px-4 py-16 sm:px-6 lg:px-8">
        <span
          className="loading loading-spinner loading-lg"
          aria-label="Loading"
        />
      </section>
    );
  }

  if (!token) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-lg font-semibold">Login terlebih dahulu</p>
          <p className="text-base-content/60">
            Anda perlu masuk untuk melanjutkan checkout.
          </p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-lg font-semibold">Keranjang kosong</p>
          <p className="text-base-content/60">
            Tambahkan buku ke keranjang sebelum checkout.
          </p>
          <Link to="/books" className="btn btn-primary">
            Lihat Daftar Buku
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
        <p className="text-base-content/60">
          Lengkapi data pengiriman dan pilih metode pembayaran.
        </p>
      </header>

      {error && (
        <div role="alert" className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="card bg-base-200">
            <div className="card-body gap-4 p-4 sm:p-6">
              <h2 className="card-title text-lg">Data Pengiriman</h2>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Nama Penerima</legend>
                <input
                  type="text"
                  className="input w-full"
                  value={userInfo?.name ?? ""}
                  readOnly
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Alamat Pengiriman</legend>
                <textarea
                  name="shipping_address"
                  className="textarea w-full"
                  rows={3}
                  placeholder="Nama jalan, nomor rumah, kota, kode pos"
                  value={formData.shipping_address}
                  onChange={handleChange}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Catatan (opsional)</legend>
                <textarea
                  name="notes"
                  className="textarea w-full"
                  rows={2}
                  placeholder="Catatan untuk pesanan"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </fieldset>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body gap-4 p-4 sm:p-6">
              <h2 className="card-title text-lg">Metode Pembayaran</h2>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Pilih metode</legend>
                <select
                  name="payment_method"
                  className="select w-full"
                  value={formData.payment_method}
                  onChange={handleChange}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </fieldset>

              {requiresProof ? (
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Bukti Pembayaran</legend>
                  <input
                    type="file"
                    name="payment_proof"
                    accept="image/*"
                    className="file-input w-full"
                    onChange={handleChange}
                    required
                  />
                  <p className="label">
                    Unggah gambar bukti transfer (JPG/PNG).
                  </p>
                </fieldset>
              ) : (
                <div className="alert alert-info alert-soft">
                  <span>
                    Pembayaran dilakukan saat buku diterima. Tidak perlu
                    mengunggah bukti pembayaran.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="card sticky top-6 bg-base-200">
            <div className="card-body gap-4 p-4 sm:p-6">
              <h2 className="card-title text-lg">Ringkasan Pesanan</h2>
              <ul className="flex max-h-72 flex-col divide-y divide-base-300 overflow-y-auto">
                {items.map((item) => {
                  const book = getBook(item);
                  const title =
                    book.title ?? item.book_title ?? item.title ?? "-";
                  return (
                    <li
                      key={item.id ?? book.id}
                      className="flex items-start gap-3 py-3"
                    >
                      <img
                        src={`${IMAGE_STORAGE}/books/${book.cover_photo}`}
                        alt={`cover ${title}`}
                        className="h-20 w-14 shrink-0 rounded-box bg-base-300 object-cover"
                        loading="lazy"
                      />
                      <div className="flex min-w-0 grow flex-col gap-1">
                        <p
                          className="line-clamp-2 text-sm font-medium"
                          title={title}
                        >
                          {title}
                        </p>
                        <p className="text-xs text-base-content/60">
                          Jumlah: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold">
                          {rupiah(getPrice(item) * (item.quantity ?? 0))}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="divider my-0"></div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-base-content/60">Jumlah buku</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-base-content/60">Metode pembayaran</span>
                <span>{selectedMethod.label}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-primary">{rupiah(totalPrice)}</span>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting ? (
                  <span
                    className="loading loading-spinner loading-sm"
                    aria-label="Memproses"
                  />
                ) : (
                  "Buat Pesanan"
                )}
              </button>
            </div>
          </div>
        </aside>
      </form>

      <dialog
        className={`modal ${success ? "modal-open" : ""}`}
        onClose={handleSuccessClose}
      >
        <div className="modal-box">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-success/20 text-success">
              <AiFillCheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold">Pesanan Sedang Diproses</h2>
            <p className="text-base-content/60">
              Terima kasih! Pesanan Anda sudah kami terima dan saat ini sedang
              diproses. Anda dapat memantau statusnya di halaman transaksi.
            </p>
          </div>
          <div className="modal-action">
            <Link to="/transaction-history" className="btn btn-secondary">
              Lihat Transaksi
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSuccessClose}
            >
              Mengerti
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Tutup</button>
        </form>
      </dialog>
    </section>
  );
};

export default Checkout;
