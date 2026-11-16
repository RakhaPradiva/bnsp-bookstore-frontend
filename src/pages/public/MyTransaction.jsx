import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyTransactions } from "../../services/transactions";
import { IMAGE_STORAGE } from "../../api";
import { rupiah, formatDate } from "../../utils";
import {
  MdReceipt,
  MdChevronRight,
  MdPlace,
  MdMenuBook,
  MdPayment,
} from "react-icons/md";
import { useDecodeToken } from "../../services/auth";

const ORDER_STATUS_LABEL = {
  pending: "Pending",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Canceled",
};

const ORDER_STATUS_STYLE = {
  pending: "badge-warning",
  shipped: "badge-info",
  delivered: "badge-success",
  cancelled: "badge-error",
};

const PAYMENT_STATUS_LABEL = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

const PAYMENT_STATUS_STYLE = {
  pending: "badge-warning",
  paid: "badge-success",
  failed: "badge-error",
  refunded: "badge-neutral",
};

const PAYMENT_METHOD_LABEL = {
  credit_card: "Kartu Kredit",
  bank_transfer: "Transfer Bank",
  "e-wallet": "E-Wallet",
  cod: "Bayar di Tempat (COD)",
};

const MyTransaction = () => {
  const token = localStorage.getItem("access-token");
  const [userInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user-info") ?? "null");
    } catch {
      return null;
    }
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(token));
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();
  const decodedToken = useDecodeToken(token);

  useEffect(() => {
    if (
      token &&
      (userInfo?.role === "admin" || decodedToken?.data?.role === "admin")
    ) {
      navigate("/admin");
      return;
    }

    const fetchData = async () => {
      try {
        const transactionData = await getMyTransactions();
        setTransactions(transactionData?.data ?? []);
      } catch (error) {
        setError(
          error.response?.data?.message ?? "Gagal memuat riwayat transaksi.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userInfo, navigate, decodedToken]);

  if (!token) {
    setLoading(false);
    return;
  }

  const toggleExpanded = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <MdReceipt className="text-primary" />
          Riwayat Transaksi
        </h1>
        <p className="text-base-content/60">
          Lihat status dan detail dari setiap pesanan Anda.
        </p>
      </header>

      {error && (
        <div role="alert" className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table" aria-busy={loading}>
          <caption className="sr-only">
            {loading ? "Memuat riwayat transaksi" : "Riwayat transaksi"}
          </caption>
          <thead className="bg-base-200/60 text-xs uppercase tracking-wide text-base-content/60">
            <tr>
              <th scope="col" className="w-12">
                <span className="sr-only">Detail</span>
              </th>
              <th scope="col">Order</th>
              <th scope="col">Tanggal</th>
              <th scope="col">Status Pesanan</th>
              <th scope="col">Status Pembayaran</th>
              <th scope="col" className="whitespace-nowrap">
                Metode Pembayaran
              </th>
              <th scope="col" className="text-right">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} aria-hidden="true">
                  <td>
                    <div className="h-4 w-4 animate-pulse rounded bg-base-300" />
                  </td>
                  <td>
                    <div className="h-4 w-36 animate-pulse rounded bg-base-300" />
                  </td>
                  <td>
                    <div className="h-4 w-24 animate-pulse rounded bg-base-300" />
                  </td>
                  <td>
                    <div className="h-5 w-20 animate-pulse rounded-full bg-base-300" />
                  </td>
                  <td>
                    <div className="h-5 w-20 animate-pulse rounded-full bg-base-300" />
                  </td>
                  <td>
                    <div className="h-5 w-24 animate-pulse rounded-full bg-base-300" />
                  </td>
                  <td>
                    <div className="ml-auto h-4 w-24 animate-pulse rounded bg-base-300" />
                  </td>
                </tr>
              ))
            ) : !token ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <MdReceipt className="text-4xl text-base-content/30" />
                    <p className="text-lg font-semibold">
                      Login terlebih dahulu
                    </p>
                    <p className="text-sm text-base-content/60">
                      Anda perlu masuk untuk melihat riwayat transaksi.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-sm">
                      Login
                    </Link>
                  </div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <MdReceipt className="text-4xl text-base-content/30" />
                    <p className="text-lg font-semibold">Belum ada transaksi</p>
                    <p className="text-sm text-base-content/60">
                      Pesanan yang Anda buat akan tampil di sini.
                    </p>
                    <Link to="/books" className="btn btn-primary btn-sm">
                      Lihat Daftar Buku
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => {
                const payment = transaction.payments?.[0];
                const expanded = expandedId === transaction.id;
                const detailsId = `my-transaction-details-${transaction.id}`;
                const details = transaction.details ?? [];
                const totalItems = details.reduce(
                  (sum, detail) => sum + (detail.quantity ?? 0),
                  0,
                );
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
                        <button
                          type="button"
                          className="text-left font-semibold whitespace-nowrap hover:text-primary"
                          onClick={() => toggleExpanded(transaction.id)}
                        >
                          {transaction.order_number}
                        </button>
                        <p className="mt-0.5 text-xs text-base-content/60">
                          {details.length} buku &middot; {totalItems} item
                        </p>
                      </td>
                      <td className="whitespace-nowrap text-sm text-base-content/70">
                        {formatDate(transaction.created_at)}
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            ORDER_STATUS_STYLE[transaction.order_status] ??
                            "badge-ghost"
                          }`}
                        >
                          {ORDER_STATUS_LABEL[transaction.order_status] ??
                            transaction.order_status ??
                            "-"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            PAYMENT_STATUS_STYLE[payment?.payment_status] ??
                            "badge-ghost"
                          }`}
                        >
                          {payment
                            ? (PAYMENT_STATUS_LABEL[payment.payment_status] ??
                              payment.payment_status)
                            : "-"}
                        </span>
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
                                {details.map((detail) => (
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
                                ))}
                              </ul>
                              <div className="flex justify-between border-t border-base-300 pt-3 text-sm">
                                <span className="text-base-content/60">
                                  Subtotal
                                </span>
                                <span className="font-semibold">
                                  {rupiah(transaction.total_amount)}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-4">
                              <div>
                                <p className="text-sm font-semibold">Alamat</p>
                                <div className="mt-1 flex items-start gap-2 text-sm text-base-content/70">
                                  <MdPlace className="mt-0.5 shrink-0 text-base" />
                                  <span>
                                    {transaction.shipping_address ?? "-"}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="flex items-center gap-2 text-sm font-semibold">
                                  <MdPayment className="text-base text-base-content/60" />
                                  Pembayaran
                                </p>
                                <p className="mt-1 text-sm text-base-content/70">
                                  {payment
                                    ? `${
                                        PAYMENT_METHOD_LABEL[
                                          payment.payment_method
                                        ] ?? payment.payment_method
                                      } · ${
                                        PAYMENT_STATUS_LABEL[
                                          payment.payment_status
                                        ] ?? payment.payment_status
                                      }`
                                    : "Belum ada pembayaran"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold">Catatan</p>
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
    </section>
  );
};

export default MyTransaction;
