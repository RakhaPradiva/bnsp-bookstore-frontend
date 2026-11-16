import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete, MdPeople } from "react-icons/md";
import { deleteUser, getUsers } from "../../../services/users";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUsers();
        setUsers(userData);
      } catch (error) {
        setError(error.response?.data?.message ?? "Gagal memuat daftar user.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const visibleUsers = users.filter(
    (user) => String(user.role ?? "").toLowerCase() !== "admin",
  );

  const filteredUsers = search.trim()
    ? visibleUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(search.trim().toLowerCase()) ||
          user.email?.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : visibleUsers;

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteError(null);
    deleteModalRef.current?.showModal();
  };

  const closeDeleteModal = () => {
    deleteModalRef.current?.close();
    setUserToDelete(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteUser(userToDelete.id);
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      closeDeleteModal();
    } catch (error) {
      setDeleteError(error.response?.data?.message ?? "Gagal menghapus user.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-box bg-base-100 border border-base-300">
            <MdPeople className="text-2xl text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-sm text-base-content/60">Kelola daftar user.</p>
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
                placeholder="Cari user..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Cari user"
              />
            </label>
            <span className="badge badge-ghost">
              {filteredUsers.length} user
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra" aria-busy={loading}>
              <caption className="sr-only">
                {loading ? "Memuat daftar user" : "Daftar user"}
              </caption>
              <thead>
                <tr>
                  <th className="w-16">#</th>
                  <th>Nama</th>
                  <th>Email</th>
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
                        <div className="h-4 w-40 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="h-4 w-52 animate-pulse rounded bg-base-300" />
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <div className="h-8 w-8 animate-pulse rounded-box bg-base-300" />
                          <div className="h-8 w-8 animate-pulse rounded-box bg-base-300" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <MdPeople
                          className="text-4xl text-base-content/30"
                          aria-hidden="true"
                        />
                        <p className="text-lg font-semibold">Belum ada user</p>
                        <p className="text-sm text-base-content/60">
                          {search
                            ? "Tidak ada user yang cocok dengan pencarian."
                            : "Daftar user akan tampil di sini."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td className="text-base-content/60">{index + 1}</td>
                      <td>
                        <p className="font-medium">{user.name}</p>
                      </td>
                      <td className="text-base-content/70">{user.email}</td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <div className="tooltip tooltip-left" data-tip="Edit">
                            <Link
                              to={`/admin/users/edit/${user.id}`}
                              className="btn btn-square btn-sm btn-ghost"
                              aria-label={`Edit user ${user.name}`}
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
                              aria-label={`Hapus user ${user.name}`}
                              onClick={() => openDeleteModal(user)}
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
        onClose={() => setUserToDelete(null)}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hapus User</h3>
          <p className="py-4 text-base-content/70">
            Yakin ingin menghapus user{" "}
            <span className="font-semibold text-base-content">
              {userToDelete?.name}
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

export default AdminUsers;
