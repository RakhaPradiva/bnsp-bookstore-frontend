import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, useDecodeToken } from "../../services/auth";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbXboxX } from "react-icons/tb";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access-token");
  const decodedData = useDecodeToken(token);

  useEffect(() => {
    if (token && decodedData && decodedData && decodedData.success) {
      navigate("/admin");
    }
  }, [token, decodedData, navigate]);

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
      const res = await login(formData);
      localStorage.setItem("access-token", res.token);
      localStorage.setItem("user-info", JSON.stringify(res.user));
      if (res.user.role === "admin") {
        return navigate("/admin/");
      } else {
        return navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Terjadi kesalahan saat login. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-base-content">Login</h1>
            <p className="text-base-content/60 mt-2">Masuk dengan akun anda</p>
          </div>

          {error && (
            <div className="alert alert-error mb-6" role="alert">
              <TbXboxX className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <MdOutlineEmail className="h-5 w-5" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="grow bg-transparent border-none outline-none"
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
                className="grow bg-transparent border-none outline-none"
                value={formData.password}
                onChange={handleChange}
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary btn-block w-full py-3"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60 mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="link link-primary font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
