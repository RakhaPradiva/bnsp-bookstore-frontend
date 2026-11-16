import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, useDecodeToken } from "../../services/auth";
import { TbXboxX } from "react-icons/tb";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access-token");
  const decodedData = useDecodeToken(token);

  useEffect(() => {
    if (token && decodedData && decodedData && decodedData.success) {
      navigate("/admin");
    }
  }, [token, decodedData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});

    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data.message || ["Terjadi kesalahan."]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const errorEntries =
    error && typeof error === "object" ? Object.entries(error) : [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-base-content">Register</h1>
            <p className="text-base-content/60 mt-2">Buat akun baru anda</p>
          </div>

          {errorEntries.length > 0 && (
            <div role="alert" className="alert alert-error mb-6">
              <TbXboxX className="h-5 w-5" />

              <ul className="list-disc pl-5 text-sm">
                {errorEntries.flatMap(([field, messages]) =>
                  Array.isArray(messages)
                    ? messages.map((message, index) => (
                        <li key={`${field}-${index}`}>{message}</li>
                      ))
                    : [<li key={field}>{String(messages)}</li>],
                )}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <FaRegUserCircle className="h-5 w-5" />
              <input
                type="text"
                name="name"
                placeholder="Nama"
                className="grow"
                value={formData.name}
                onChange={handleChange}
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 w-full">
              <MdOutlineEmail className="h-5 w-5" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="grow"
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 w-full">
              <RiLockPasswordLine className="h-5 w-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="grow"
                value={formData.password}
                onChange={handleChange}
              />
            </label>

            <label className="label justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                required
              />
              <span className="label-text">
                Saya menyetujui{" "}
                <Link to="#" className="link link-primary">
                  Syarat &amp; Ketentuan
                </Link>{" "}
                yang berlaku
              </span>
            </label>

            <button
              type="submit"
              className="btn btn-primary btn-block w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Daftar"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60 mt-6">
            Sudah punya akun?{" "}
            <Link to="/login" className="link link-primary font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
