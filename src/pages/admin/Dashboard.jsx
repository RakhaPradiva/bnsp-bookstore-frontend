import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdCheckCircle,
  MdChevronRight,
  MdDashboard,
  MdInventory,
  MdLocalShipping,
  MdMenuBook,
  MdPayments,
  MdPeople,
  MdPerson,
  MdReceipt,
  MdRefresh,
  MdWarningAmber,
} from "react-icons/md";
import { IMAGE_STORAGE } from "../../api";
import { getBooks } from "../../services/books";
import { getUsers } from "../../services/users";
import { getTransactions } from "../../services/transactions";
import { formatDate, rupiah } from "../../utils";

const LOW_STOCK_THRESHOLD = 5;
const RECENT_TRANSACTION_LIMIT = 5;

const ORDER_STATUS_META = {
  pending: {
    label: "Pending",
    badge: "badge-warning",
    progress: "progress-warning",
  },
  shipped: { label: "Dikirim", badge: "badge-info", progress: "progress-info" },
  delivered: {
    label: "Selesai",
    badge: "badge-success",
    progress: "progress-success",
  },
  cancelled: {
    label: "Dibatalkan",
    badge: "badge-error",
    progress: "progress-error",
  },
};

const ORDER_STATUS_ORDER = ["pending", "shipped", "delivered", "cancelled"];

const timestamp = (value) => {
  const time = new Date(value ?? 0).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  hint,
  to,
  iconClass,
  iconWrapClass,
}) => (
  <Link
    to={to}
    className="card group bg-base-100 border border-base-300 transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
  >
    <div className="card-body gap-3 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-base-content/60">{label}</p>
          <p className="mt-1 wrap-break-word text-xl font-bold tracking-tight sm:text-2xl">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-box border ${iconWrapClass}`}
        >
          <Icon className={`text-2xl ${iconClass}`} aria-hidden="true" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-base-content/50">{hint}</p>
        <MdChevronRight
          className="text-base text-base-content/30 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </div>
  </Link>
);

const StatSkeleton = () => (
  <div className="card bg-base-100 border border-base-300">
    <div className="card-body gap-3 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-base-300" />
          <div className="h-7 w-16 animate-pulse rounded bg-base-300" />
        </div>
        <div className="h-11 w-11 animate-pulse rounded-box bg-base-300" />
      </div>
      <div className="h-3 w-32 animate-pulse rounded bg-base-300" />
    </div>
  </div>
);

const SectionSkeleton = ({ rows = 4 }) => (
  <div className="card bg-base-100 border border-base-300">
    <div className="card-body gap-4 p-4 sm:p-6">
      <div className="h-5 w-40 animate-pulse rounded bg-base-300" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-10 animate-pulse rounded-box bg-base-300"
          />
        ))}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [failedSources, setFailedSources] = useState([]);

  const applyResults = useCallback(
    ([booksResult, usersResult, transactionsResult]) => {
      const failed = [];

      if (booksResult.status === "fulfilled") {
        setBooks(booksResult.value ?? []);
      } else {
        failed.push("buku");
      }

      if (usersResult.status === "fulfilled") {
        setUsers(usersResult.value ?? []);
      } else {
        failed.push("user");
      }

      if (transactionsResult.status === "fulfilled") {
        setTransactions(transactionsResult.value?.data ?? []);
      } else {
        failed.push("transaksi");
      }

      setFailedSources(failed);
      setError(
        failed.length
          ? `Gagal memuat data ${failed.join(", ")}. Periksa koneksi lalu coba lagi.`
          : null,
      );
    },
    [],
  );

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      const results = await Promise.allSettled([
        getBooks(),
        getUsers(),
        getTransactions(),
      ]);
      if (!active) return;
      applyResults(results);
      setLoading(false);
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [applyResults]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const results = await Promise.allSettled([
        getBooks(),
        getUsers(),
        getTransactions(),
      ]);
      applyResults(results);
    } finally {
      setRefreshing(false);
    }
  };

  const booksFailed = failedSources.includes("buku");
  const usersFailed = failedSources.includes("user");
  const transactionsFailed = failedSources.includes("transaksi");

  const totalStock = books.reduce(
    (sum, book) => sum + (Number(book.stock) || 0),
    0,
  );
  const customers = users.filter(
    (user) => String(user.role ?? "").toLowerCase() !== "admin",
  );

  const pendingCount = transactions.filter(
    (transaction) => transaction.order_status === "pending",
  ).length;
  const paidTransactions = transactions.filter((transaction) =>
    (transaction.payments ?? []).some(
      (payment) => payment.payment_status === "paid",
    ),
  );
  const revenue = paidTransactions.reduce(
    (sum, transaction) => sum + (Number(transaction.total_amount) || 0),
    0,
  );

  const statusRows = ORDER_STATUS_ORDER.map((key) => ({
    key,
    ...ORDER_STATUS_META[key],
    count: transactions.filter(
      (transaction) => transaction.order_status === key,
    ).length,
  }));

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        timestamp(b.created_at) - timestamp(a.created_at) ||
        (b.id ?? 0) - (a.id ?? 0),
    )
    .slice(0, RECENT_TRANSACTION_LIMIT);

  const lowStockBooks = books
    .filter((book) => Number(book.stock) <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => Number(a.stock) - Number(b.stock))
    .slice(0, 6);

  const stats = [
    {
      key: "books",
      to: "/admin/books",
      label: "Total Buku",
      icon: MdMenuBook,
      value: booksFailed ? "—" : books.length.toLocaleString("id-ID"),
      hint: booksFailed
        ? "Data gagal dimuat"
        : `${totalStock.toLocaleString("id-ID")} total stok`,
      iconClass: "text-primary",
      iconWrapClass: "border-primary/20 bg-primary/10",
    },
    {
      key: "users",
      to: "/admin/users",
      label: "Total Users",
      icon: MdPeople,
      value: usersFailed ? "—" : customers.length.toLocaleString("id-ID"),
      hint: usersFailed ? "Data gagal dimuat" : "Tidak termasuk akun admin",
      iconClass: "text-secondary",
      iconWrapClass: "border-secondary/20 bg-secondary/10",
    },
    {
      key: "transactions",
      to: "/admin/transactions",
      label: "Total Transaksi",
      icon: MdReceipt,
      value: transactionsFailed
        ? "—"
        : transactions.length.toLocaleString("id-ID"),
      hint: transactionsFailed
        ? "Data gagal dimuat"
        : `${pendingCount.toLocaleString("id-ID")} pesanan menunggu`,
      iconClass: "text-accent",
      iconWrapClass: "border-accent/20 bg-accent/10",
    },
    {
      key: "revenue",
      to: "/admin/transactions",
      label: "Pendapatan",
      icon: MdPayments,
      value: transactionsFailed ? "—" : rupiah(revenue),
      hint: transactionsFailed
        ? "Data gagal dimuat"
        : paidTransactions.length
          ? `${paidTransactions.length.toLocaleString("id-ID")} pembayaran lunas`
          : "Belum ada pembayaran lunas",
      iconClass: "text-success",
      iconWrapClass: "border-success/20 bg-success/10",
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-box bg-base-100 border border-base-300">
            <MdDashboard className="text-2xl text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline w-full sm:w-auto"
          onClick={handleRefresh}
          disabled={loading || refreshing}
        >
          {refreshing ? (
            <span
              className="loading loading-spinner loading-sm"
              aria-hidden="true"
            />
          ) : (
            <MdRefresh className="text-lg" aria-hidden="true" />
          )}
          Muat ulang
        </button>
      </header>

      {error && (
        <div role="alert" className="alert alert-warning">
          <MdWarningAmber className="text-xl" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-medium">Sebagian data gagal dimuat</p>
            <p className="text-sm text-base-content/70">{error}</p>
          </div>
          <button
            type="button"
            className="btn btn-sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Coba lagi
          </button>
        </div>
      )}

      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        role="status"
        aria-live="polite"
        aria-busy={loading}
        aria-label={
          loading ? "Memuat statistik dashboard" : "Statistik dashboard"
        }
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <StatSkeleton key={index} />
            ))
          : stats.map((stat) => <StatCard key={stat.key} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {loading ? (
          <>
            <div className="lg:col-span-2">
              <SectionSkeleton rows={5} />
            </div>
            <SectionSkeleton rows={4} />
          </>
        ) : (
          <>
            <div className="card bg-base-100 border border-base-300 lg:col-span-2">
              <div className="card-body gap-4 p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <MdReceipt
                      className="text-xl text-base-content/60"
                      aria-hidden="true"
                    />
                    <h2 className="text-base font-semibold">
                      Transaksi Terbaru
                    </h2>
                  </div>
                  <Link
                    to="/admin/transactions"
                    className="link link-hover text-xs text-primary"
                  >
                    Lihat semua
                  </Link>
                </div>

                {recentTransactions.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <MdReceipt
                      className="text-4xl text-base-content/30"
                      aria-hidden="true"
                    />
                    <p className="font-medium">
                      {transactionsFailed
                        ? "Data transaksi gagal dimuat"
                        : "Belum ada transaksi"}
                    </p>
                    <p className="text-sm text-base-content/60">
                      {transactionsFailed
                        ? "Gunakan tombol Muat ulang untuk mencoba lagi."
                        : "Transaksi dari customer akan tampil di sini."}
                    </p>
                  </div>
                ) : (
                  <ul role="list" className="divide-y divide-base-300">
                    {recentTransactions.map((transaction) => {
                      const meta = ORDER_STATUS_META[
                        transaction.order_status
                      ] ?? {
                        label: transaction.order_status ?? "-",
                        badge: "badge-ghost",
                      };
                      return (
                        <li
                          key={transaction.id}
                          className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {transaction.order_number}
                            </p>
                            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-base-content/60">
                              <span className="inline-flex items-center gap-1">
                                <MdPerson
                                  className="shrink-0 text-sm"
                                  aria-hidden="true"
                                />
                                <span className="truncate">
                                  {transaction.user?.name ?? "-"}
                                </span>
                              </span>
                              <span aria-hidden="true">•</span>
                              <span>{formatDate(transaction.created_at)}</span>
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-3 sm:justify-end">
                            <span className={`badge badge-sm ${meta.badge}`}>
                              {meta.label}
                            </span>
                            <span className="whitespace-nowrap font-semibold">
                              {rupiah(transaction.total_amount)}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300">
              <div className="card-body gap-4 p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <MdLocalShipping
                      className="text-xl text-base-content/60"
                      aria-hidden="true"
                    />
                    <h2 className="text-base font-semibold">Status Pesanan</h2>
                  </div>
                  <Link
                    to="/admin/transactions"
                    className="link link-hover text-xs text-primary"
                  >
                    Kelola
                  </Link>
                </div>

                {transactionsFailed ? (
                  <p className="py-6 text-center text-sm text-base-content/60">
                    Data pesanan gagal dimuat.
                  </p>
                ) : transactions.length === 0 ? (
                  <p className="py-6 text-center text-sm text-base-content/60">
                    Belum ada pesanan.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-4">
                    {statusRows.map((row) => {
                      const percent = Math.round(
                        (row.count / transactions.length) * 100,
                      );
                      return (
                        <li key={row.key}>
                          <div className="flex items-center justify-between gap-2">
                            <span className={`badge badge-sm ${row.badge}`}>
                              {row.label}
                            </span>
                            <span className="text-sm font-semibold">
                              {row.count.toLocaleString("id-ID")}
                              <span className="ml-1 text-xs font-normal text-base-content/50">
                                ({percent}%)
                              </span>
                            </span>
                          </div>
                          <progress
                            className={`progress ${row.progress} mt-2 w-full`}
                            value={row.count}
                            max={transactions.length}
                            aria-label={`${row.label}: ${row.count} dari ${transactions.length} pesanan (${percent}%)`}
                          />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {!loading && (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MdInventory
                  className="text-xl text-base-content/60"
                  aria-hidden="true"
                />
                <h2 className="text-base font-semibold">Stok Menipis</h2>
              </div>
              <Link
                to="/admin/books"
                className="link link-hover text-xs text-primary"
              >
                Kelola buku
              </Link>
            </div>

            {booksFailed ? (
              <div className="flex items-center gap-3 rounded-box border border-dashed border-base-300 p-4 text-sm text-base-content/60">
                <MdWarningAmber
                  className="text-xl text-warning"
                  aria-hidden="true"
                />
                Data stok buku gagal dimuat.
              </div>
            ) : lowStockBooks.length === 0 ? (
              <div className="flex items-center gap-3 rounded-box border border-dashed border-base-300 p-4 text-sm text-base-content/60">
                <MdCheckCircle
                  className="text-xl text-success"
                  aria-hidden="true"
                />
                Semua stok buku aman (di atas {LOW_STOCK_THRESHOLD}).
              </div>
            ) : (
              <ul
                role="list"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
              >
                {lowStockBooks.map((book) => {
                  const stock = Number(book.stock) || 0;
                  return (
                    <li key={book.id}>
                      <Link
                        to={`/admin/books/edit/${book.id}`}
                        className="flex items-center gap-3 rounded-box border border-base-300 bg-base-200/40 p-3 transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <div className="h-14 w-10 shrink-0 overflow-hidden rounded-box bg-base-300">
                          {book.cover_photo ? (
                            <img
                              src={`${IMAGE_STORAGE}/books/${book.cover_photo}`}
                              alt={`Cover ${book.title}`}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <MdMenuBook
                                className="text-base text-base-content/40"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{book.title}</p>
                          <p className="mt-0.5 text-xs text-base-content/50">
                            {book.author?.name ?? "-"}
                          </p>
                        </div>
                        <span
                          className={`badge badge-sm shrink-0 ${stock === 0 ? "badge-error" : "badge-warning"}`}
                        >
                          Stok {stock}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
