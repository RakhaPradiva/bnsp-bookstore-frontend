import { Fragment, useState, useEffect, useRef } from "react";
import {
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../../../services/transactions";
import { showPayment, updatePayment } from "../../../services/payment";
import {
  MdReceipt,
  MdDelete,
  MdImage,
  MdChevronRight,
  MdPlace,
  MdPerson,
  MdMenuBook,
} from "react-icons/md";
import { IMAGE_STORAGE } from "../../../api";
import { rupiah, formatDate } from "../../../utils";

const PAYMENT_STATUS = [
  {
    label: "Pending",
    name: "pending",
  },
  {
    label: "Paid",
    name: "paid",
  },
  {
    label: "Failed",
    name: "failed",
  },
  {
    label: "Refunded",
    name: "refunded",
  },
];

const PAYMENT_METHOD_LABEL = {
  credit_card: "Kartu Kredit",
  bank_transfer: "Transfer Bank",
  "e-wallet": "E-Wallet",
  cod: "Bayar ditempat (COD)",
};

const ORDER_STATUS = [
  {
    label: "Pending",
    name: "pending",
  },

  {
    label: "Shipped",
    name: "shipped",
  },
  {
    label: "Delivered",
    name: "delivered",
  },
  {
    label: "Canceled",
    name: "cancelled",
  },
];

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const deleteModalRef = useRef(null);
  const proofModalRef = useRef(null);
  const [proof, setProof] = useState(null);
  const [proofLoading, setProofLoading] = useState(false);
  const [proofError, setProofError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTransactions();
        setTransactions(response?.data ?? []);
      } catch (error) {
        setError(
          error.response?.data?.message ?? "Gagal memuat daftar transaksi.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const keyword = search.trim().toLowerCase();
  const filteredTransactions = keyword
    ? transactions.filter(
        (transaction) =>
          transaction.order_number?.toLowerCase().includes(keyword) ||
          transaction.user?.name?.toLowerCase().includes(keyword),
      )
    : transactions;

  const toggleExpanded = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleUpdate = async (transaction, changes) => {
    setUpdatingId(transaction.id);
    setActionError(null);
    try {
      const payment = transaction.payments?.[0];
      if (changes.order_status) {
        await updateTransaction(transaction.id, {
          order_status: changes.order_status,
        });
      }
      if (changes.payment_status && payment) {
        await updatePayment(payment.id, {
          payment_status: changes.payment_status,
        });
      }
      setTransactions((current) =>
        current.map((item) =>
          item.id === transaction.id
            ? {
                ...item,
                order_status: changes.order_status ?? item.order_status,
                payments:
                  changes.payment_status && payment
                    ? [
                        { ...payment, payment_status: changes.payment_status },
                        ...item.payments.slice(1),
                      ]
                    : item.payments,
              }
            : item,
        ),
      );
    } catch (error) {
      setActionError(
        error.response?.data?.message ?? "Gagal memperbarui status transaksi.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const openProofModal = async (transaction) => {
    const payment = transaction.payments?.[0];
    setProof(null);
    setProofError(null);
    if (!payment?.payment_proof) {
      setProofError("Bukti pembayaran belum diunggah.");
      proofModalRef.current?.showModal();
      return;
    }
    proofModalRef.current?.showModal();
    setProofLoading(true);
    try {
      const paymentData = await showPayment(payment.id);
      setProof(paymentData?.payment_proof ?? payment.payment_proof);
    } catch (error) {
      setProof(payment.payment_proof);
      setProofError(
        error.response?.data?.message ?? "Gagal memuat bukti pembayaran.",
      );
    } finally {
      setProofLoading(false);
    }
  };

  const closeProofModal = () => {
    proofModalRef.current?.close();
    setProof(null);
    setProofError(null);
  };

  const openDeleteModal = (transaction) => {
    setTransactionToDelete(transaction);
    setDeleteError(null);
    deleteModalRef.current?.showModal();
  };

  const closeDeleteModal = () => {
    deleteModalRef.current?.close();
    setTransactionToDelete(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTransaction(transactionToDelete.id);
      setTransactions(
        transactions.filter((item) => item.id !== transactionToDelete.id),
      );
      closeDeleteModal();
    } catch (error) {
      setDeleteError(
        error.response?.data?.message ?? "Gagal menghapus transaksi.",
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
            <MdReceipt className="text-2xl text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-sm text-base-content/60">
              Kelola daftar transaksi.
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {actionError && (
        <div role="alert" className="alert alert-error">
          <span>{actionError}</span>
        </div>
      )}

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="input w-full sm:max-w-xs">
              <input
                type="search"
                className="grow"
                placeholder="Cari order atau customer..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Cari transaksi"
              />
            </label>
            <span className="badge badge-ghost">
              {filteredTransactions.length} transaksi
            </span>
          </div>

          <div className="overflow-x-auto rounded-box border border-base-300">
            <table className="table" aria-busy={loading}>
              <caption className="sr-only">
                {loading ? "Memuat daftar transaksi" : "Daftar transaksi"}
              </caption>
              <thead className="bg-base-200/60 text-xs uppercase tracking-wide text-base-content/60">
                <tr>
                  <th scope="col" className="w-12">
                    <span className="sr-only">Detail</span>
                  </th>
                  <th scope="col">Order</th>
                  <th scope="col">Status Pesanan</th>
                  <th scope="col">Status Pembayaran</th>
                  <th scope="col" className="whitespace-nowrap">
                    Metode Pembayaran
                  </th>
                  <th scope="col" className="text-right">
                    Total
                  </th>
                  <th scope="col" className="text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} aria-hidden="true">
                      <td>
                        <div className="h-4 w-4 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="h-4 w-40 animate-pulse rounded bg-base-300" />
                        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="h-5 w-20 animate-pulse rounded-full bg-base-300" />
                        <div className="mt-2 h-7 w-32 animate-pulse rounded-box bg-base-300" />
                      </td>
                      <td>
                        <div className="h-5 w-20 animate-pulse rounded-full bg-base-300" />
                        <div className="mt-2 h-7 w-32 animate-pulse rounded-box bg-base-300" />
                      </td>
                      <td>
                        <div className="h-5 w-24 animate-pulse rounded-full bg-base-300" />
                      </td>
                      <td>
                        <div className="ml-auto h-4 w-24 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="ml-auto h-8 w-16 animate-pulse rounded-box bg-base-300" />
                      </td>
                    </tr>
                  ))
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <MdReceipt className="text-4xl text-base-content/30" />
                        <p className="text-lg font-semibold">
                          Belum ada transaksi
                        </p>
                        <p className="text-sm text-base-content/60">
                          {search
                            ? "Tidak ada transaksi yang cocok dengan pencarian."
                            : "Transaksi dari customer akan tampil di sini."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => {
                    const payment = transaction.payments?.[0];
                    const expanded = expandedId === transaction.id;
                    const updating = updatingId === transaction.id;
                    const detailsId = `transaction-details-${transaction.id}`;
                    return (
                      <Fragment key={transaction.id}>
                        <tr
                          className={
                            expanded ? "bg-base-200/60 align-top" : "align-top"
                          }
                        >
                          <td>
                            <button
                              type="button"
                              className="btn btn-square btn-sm btn-ghost"
                              aria-label={`${expanded ? "Tutup" : "Buka"} detail transaksi ${transaction.order_number}`}
                              aria-expanded={expanded}
                              aria-controls={detailsId}
                              onClick={() => toggleExpanded(transaction.id)}
                            >
                              <MdChevronRight
                                className={`text-xl transition-transform ${
                                  expanded ? "rotate-90" : ""
                                }`}
                              />
                            </button>
                          </td>
                          <td>
                            <p className="font-semibold whitespace-nowrap">
                              {transaction.order_number}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-base-content/60">
                              <MdPerson className="shrink-0 text-sm" />
                              <span className="truncate">
                                {transaction.user?.name ?? "-"}
                              </span>
                            </p>
                            <p className="mt-0.5 text-xs text-base-content/40">
                              {formatDate(transaction.created_at)}
                            </p>
                          </td>
                          <td>
                            <div className="flex flex-col items-start gap-1.5">
                              <select
                                className="select select-sm w-32"
                                aria-label={`Update status pesanan ${transaction.order_number}`}
                                value={transaction.order_status ?? ""}
                                disabled={updating}
                                onChange={(event) =>
                                  handleUpdate(transaction, {
                                    order_status: event.target.value,
                                  })
                                }
                              >
                                {ORDER_STATUS.map((option) => (
                                  <option key={option.name} value={option.name}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-col items-start gap-1.5">
                              <select
                                className="select select-sm w-32"
                                aria-label={`Update status pembayaran ${transaction.order_number}`}
                                value={payment?.payment_status ?? ""}
                                disabled={updating || !payment}
                                onChange={(event) =>
                                  handleUpdate(transaction, {
                                    payment_status: event.target.value,
                                  })
                                }
                              >
                                {PAYMENT_STATUS.map((option) => (
                                  <option key={option.name} value={option.name}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td>
                            {payment?.payment_method ? (
                              <span className="badge badge-ghost badge-sm whitespace-nowrap">
                                {PAYMENT_METHOD_LABEL[payment.payment_method] ??
                                  payment.payment_method}
                              </span>
                            ) : (
                              <span className="text-base-content/40">-</span>
                            )}
                          </td>
                          <td className="text-right">
                            <p className="font-semibold whitespace-nowrap">
                              {rupiah(transaction.total_amount)}
                            </p>
                            <p className="mt-0.5 text-xs text-base-content/60">
                              {transaction.details?.length ?? 0} item
                            </p>
                          </td>
                          <td>
                            <div className="flex items-center justify-end gap-1">
                              {updating && (
                                <span
                                  className="loading loading-spinner loading-sm mr-1"
                                  aria-label="Menyimpan"
                                />
                              )}
                              <div
                                className="tooltip tooltip-left"
                                data-tip="Bukti"
                              >
                                <button
                                  type="button"
                                  className="btn btn-square btn-sm btn-ghost"
                                  aria-label={`Lihat bukti pembayaran ${transaction.order_number}`}
                                  onClick={() => openProofModal(transaction)}
                                >
                                  <MdImage className="text-lg" />
                                </button>
                              </div>
                              <div
                                className="tooltip tooltip-left"
                                data-tip="Hapus"
                              >
                                <button
                                  type="button"
                                  className="btn btn-square btn-sm btn-ghost text-error"
                                  aria-label={`Hapus transaksi ${transaction.order_number}`}
                                  onClick={() => openDeleteModal(transaction)}
                                >
                                  <MdDelete className="text-lg" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>

                        {expanded && (
                          <tr id={detailsId} className="bg-base-200/30">
                            <td colSpan={7} className="p-0">
                              <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-3">
                                <div className="lg:col-span-2">
                                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                                    <MdMenuBook className="text-base text-base-content/60" />
                                    Daftar Pesanan
                                  </p>
                                  <ul className="flex flex-col divide-y divide-base-300">
                                    {(transaction.details ?? []).map(
                                      (detail) => (
                                        <li
                                          key={detail.id}
                                          className="flex items-start gap-3 py-3"
                                        >
                                          <div className="h-16 w-12 shrink-0 overflow-hidden rounded-box bg-base-300">
                                            {detail.book?.cover_photo ? (
                                              <img
                                                src={`${IMAGE_STORAGE}/books/${detail.book.cover_photo}`}
                                                alt={`Cover ${detail.book.title}`}
                                                loading="lazy"
                                                className="h-full w-full object-cover"
                                              />
                                            ) : null}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className="font-medium">
                                              {detail.book?.title ?? "-"}
                                            </p>
                                            <p className="text-sm text-base-content/60">
                                              {detail.quantity} x{" "}
                                              {rupiah(detail.price)}
                                            </p>
                                          </div>
                                          <p className="whitespace-nowrap text-sm font-semibold">
                                            {rupiah(detail.subtotal)}
                                          </p>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                  <div className="flex justify-between border-t border-base-300 pt-3 text-sm">
                                    <span className="text-base-content/60">
                                      Total
                                    </span>
                                    <span className="font-semibold">
                                      {rupiah(transaction.total_amount)}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                  <div>
                                    <p className="text-sm font-semibold">
                                      Alamat
                                    </p>
                                    <div className="mt-1 flex items-start gap-2 text-sm text-base-content/70">
                                      <MdPlace className="mt-0.5 shrink-0 text-base" />
                                      <span>
                                        {transaction.shipping_address ?? "-"}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold">
                                      Catatan
                                    </p>
                                    <p className="text-sm text-base-content/70">
                                      {transaction.notes || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <dialog ref={proofModalRef} className="modal" onClose={closeProofModal}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Bukti Pembayaran</h3>
          <div className="py-4">
            {proofLoading ? (
              <div className="flex justify-center py-8">
                <span
                  className="loading loading-spinner loading-lg"
                  aria-label="Memuat bukti"
                />
              </div>
            ) : proof ? (
              <img
                src={`${IMAGE_STORAGE}/payment_proofs/${proof}`}
                alt="Bukti pembayaran"
                className="w-full rounded-box border border-base-300 bg-base-200 object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-base-content/60">
                <MdImage className="text-4xl text-base-content/30" />
                <p className="text-sm">
                  {proofError ?? "Bukti tidak tersedia."}
                </p>
              </div>
            )}
            {proofError && proof && (
              <p className="mt-2 text-sm text-warning">{proofError}</p>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Tutup</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog
        ref={deleteModalRef}
        className="modal"
        onClose={() => setTransactionToDelete(null)}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hapus Transaksi</h3>
          <p className="py-4 text-base-content/70">
            Yakin ingin menghapus transaksi{" "}
            <span className="font-semibold text-base-content">
              {transactionToDelete?.order_number}
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

export default AdminTransactions;
