import { useState, useEffect, useRef } from "react";
import { MdInbox, MdDelete, MdPerson, MdEmail } from "react-icons/md";
import {
  getContactMessage,
  deleteContactMessage,
} from "../../services/contacts";
import { formatDate } from "../../utils";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const detailModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactData = await getContactMessage();
        setMessages(contactData ?? []);
      } catch (error) {
        setError(
          error.response?.data?.message ?? "Gagal memuat daftar pesan masuk.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const keyword = search.trim().toLowerCase();
  const filteredMessages = keyword
    ? messages.filter(
        (message) =>
          message.subject?.toLowerCase().includes(keyword) ||
          message.message?.toLowerCase().includes(keyword) ||
          message.customer?.name?.toLowerCase().includes(keyword) ||
          message.customer?.email?.toLowerCase().includes(keyword) ||
          message.name?.toLowerCase().includes(keyword) ||
          message.email?.toLowerCase().includes(keyword),
      )
    : messages;

  const closeDetailModal = () => {
    detailModalRef.current?.close();
    setSelectedMessage(null);
  };

  const openDeleteModal = (message) => {
    setMessageToDelete(message);
    setDeleteError(null);
    deleteModalRef.current?.showModal();
  };

  const closeDeleteModal = () => {
    deleteModalRef.current?.close();
    setMessageToDelete(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteContactMessage(messageToDelete.id);
      setMessages(
        messages.filter((message) => message.id !== messageToDelete.id),
      );
      closeDeleteModal();
    } catch (error) {
      setDeleteError(error.response?.data?.message ?? "Gagal menghapus pesan.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-box bg-base-100 border border-base-300">
            <MdInbox className="text-2xl text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Inbox</h1>
            <p className="text-sm text-base-content/60">
              Daftar pesan masuk dari customer.
            </p>
          </div>
        </div>
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
                placeholder="Cari subjek atau pengirim..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Cari pesan"
              />
            </label>
            <span className="badge badge-ghost">
              {filteredMessages.length} pesan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra" aria-busy={loading}>
              <caption className="sr-only">
                {loading ? "Memuat daftar pesan" : "Daftar pesan masuk"}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-16">
                    #
                  </th>
                  <th scope="col">Pengirim</th>
                  <th scope="col">Subjek</th>
                  <th scope="col" className="hidden lg:table-cell">
                    Pesan
                  </th>
                  <th scope="col" className="whitespace-nowrap">
                    Tanggal
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
                        <div className="h-4 w-6 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="h-4 w-32 animate-pulse rounded bg-base-300" />
                        <div className="mt-2 h-3 w-44 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="h-4 w-40 animate-pulse rounded bg-base-300" />
                        <div className="mt-2 h-3 w-32 animate-pulse rounded bg-base-300 lg:hidden" />
                      </td>
                      <td className="hidden lg:table-cell">
                        <div className="h-4 w-full max-w-md animate-pulse rounded bg-base-300" />
                        <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="h-4 w-24 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="ml-auto h-8 w-8 animate-pulse rounded-box bg-base-300" />
                      </td>
                    </tr>
                  ))
                ) : filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <MdInbox
                          className="text-4xl text-base-content/30"
                          aria-hidden="true"
                        />
                        <p className="text-lg font-semibold">Belum ada pesan</p>
                        <p className="text-sm text-base-content/60">
                          {search
                            ? "Tidak ada pesan yang cocok dengan pencarian."
                            : "Pesan yang dikirim customer akan tampil di sini."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((message, index) => (
                    <tr key={message.id} className="align-top">
                      <td className="text-base-content/60">{index + 1}</td>
                      <td>
                        <p className="flex items-center gap-1.5 font-medium">
                          <MdPerson className="shrink-0 text-base text-base-content/50" />
                          <span className="truncate">
                            {message.customer?.name ?? message.name ?? "-"}
                          </span>
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-base-content/60">
                          <MdEmail className="shrink-0 text-sm" />
                          <span className="truncate">
                            {message.customer?.email ?? message.email ?? "-"}
                          </span>
                        </p>
                      </td>
                      <td>
                        <p className="max-w-xs font-semibold">
                          {message.subject}
                        </p>
                        <p className="mt-0.5 max-w-xs text-sm text-base-content/60 lg:hidden">
                          <span className="line-clamp-2">
                            {message.message}
                          </span>
                        </p>
                      </td>
                      <td className="hidden lg:table-cell">
                        <p className="max-w-md text-sm text-base-content/70">
                          <span className="line-clamp-2">
                            {message.message}
                          </span>
                        </p>
                      </td>
                      <td className="whitespace-nowrap text-base-content/70">
                        {formatDate(message.created_at)}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Hapus"
                          >
                            <button
                              type="button"
                              className="btn btn-square btn-sm btn-ghost text-error"
                              aria-label={`Hapus pesan ${message.subject}`}
                              onClick={() => openDeleteModal(message)}
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
        ref={detailModalRef}
        className="modal"
        onClose={() => setSelectedMessage(null)}
      >
        <div className="modal-box max-w-2xl">
          <h3 className="text-lg font-bold">{selectedMessage?.subject}</h3>
          <div className="mt-1 flex flex-col gap-1 text-sm text-base-content/60">
            <span className="flex items-center gap-1.5">
              <MdPerson className="text-base" />
              {selectedMessage?.customer?.name ?? selectedMessage?.name ?? "-"}
            </span>
            <span className="flex items-center gap-1.5">
              <MdEmail className="text-base" />
              {selectedMessage?.customer?.email ??
                selectedMessage?.email ??
                "-"}
            </span>
            <span>{formatDate(selectedMessage?.created_at)}</span>
          </div>
          <p className="mt-4 whitespace-pre-line border-t border-base-300 pt-4 text-base-content/80">
            {selectedMessage?.message}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost" onClick={closeDetailModal}>
                Tutup
              </button>
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
        onClose={() => setMessageToDelete(null)}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hapus Pesan</h3>
          <p className="py-4 text-base-content/70">
            Yakin ingin menghapus pesan{" "}
            <span className="font-semibold text-base-content">
              {messageToDelete?.subject}
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

export default Inbox;
