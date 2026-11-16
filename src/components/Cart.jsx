import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCarts, deleteCart, updateCart } from "../services/carts";
import { rupiah } from "../utils";
import CartItem from "./CartItem";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const Cart = ({ token = null }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  const resolveBookId = (item) => item.book?.id ?? item.book_id ?? item.id;
  const resolveItemPrice = (item) => item.book?.price ?? item.price ?? 0;

  useEffect(() => {
    let active = true;
    const loadCarts = async () => {
      if (!token) {
        if (active) setItems([]);
        return;
      }
      setLoading(true);
      setError(null);
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

    loadCarts();
    window.addEventListener("cart-updated", loadCarts);
    return () => {
      active = false;
      window.removeEventListener("cart-updated", loadCarts);
    };
  }, [token]);

  const handleQuantityChange = async (item, quantity) => {
    const id = item.id;
    setPendingId(id);
    try {
      if (quantity <= 0) {
        await deleteCart(id);
      } else {
        await updateCart(id, { quantity });
      }
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setPendingId(null);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + resolveItemPrice(item) * (item.quantity ?? 0),
    0,
  );

  return (
    <div className="drawer-end w-fit">
      <input id="cart-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="indicator">
          {totalItems > 0 && (
            <span className="indicator-item badge badge-primary badge-sm">
              {totalItems}
            </span>
          )}
          <label
            htmlFor="cart-drawer"
            className="btn btn-ghost btn-circle drawer-button"
            aria-label="Buka keranjang"
          >
            <MdOutlineShoppingCart className="h-5 w-5" />
          </label>
        </div>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="cart-drawer"
          aria-label="Tutup keranjang"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full w-full max-w-sm flex-col bg-base-100">
          <div className="flex items-center justify-between border-b border-base-300 p-4">
            <h2 className="text-lg font-semibold">Keranjang</h2>
            <label
              htmlFor="cart-drawer"
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Tutup"
            >
              <IoMdClose className="h-7 w-7" />
            </label>
          </div>

          <div className="grow overflow-y-auto p-4">
            {!token ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-base-content/60">
                  Login untuk melihat buku yang telah ditambahkan.
                </p>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Login
                </Link>
              </div>
            ) : loading ? (
              <ul className="flex flex-col gap-2">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-start gap-3 py-3">
                    <div className="skeleton h-24 w-16 shrink-0" />
                    <div className="flex grow flex-col gap-2">
                      <div className="skeleton h-4 w-3/4" />
                      <div className="skeleton h-3 w-1/2" />
                      <div className="skeleton h-4 w-1/3" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : error ? (
              <div role="alert" className="alert alert-error">
                <span>{error}</span>
              </div>
            ) : items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <MdOutlineShoppingCart className="h-10 w-10" />
                <p className="text-sm text-base-content/60">
                  Belum ada buku di keranjang.
                </p>
                <label htmlFor="cart-drawer" className="btn btn-primary btn-sm">
                  Tutup
                </label>
                <Link to="/books" className="btn btn-ghost btn-sm">
                  Jelajahi Buku
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-base-300">
                {items.map((item) => (
                  <CartItem
                    key={item.id ?? resolveBookId(item)}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    pending={pendingId === item.id}
                  />
                ))}
              </ul>
            )}
          </div>

          {token && items.length > 0 && (
            <div className="border-t border-base-300 p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-base-content/60">
                  Total ({totalItems} buku)
                </span>
                <span className="text-base font-semibold">
                  {rupiah(totalPrice)}
                </span>
              </div>
              <Link to="/checkout" className="btn btn-primary btn-block">
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
