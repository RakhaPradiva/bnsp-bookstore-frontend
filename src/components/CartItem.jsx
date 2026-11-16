import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { IMAGE_STORAGE } from "../api";
import { rupiah } from "../utils";
import { FaTrashAlt } from "react-icons/fa";

const CartItem = ({ item, onQuantityChange, pending = false }) => {
  const book = item?.book ?? {};
  const cover = book.cover_photo;
  const title = book.title ?? item?.book_title ?? item?.title ?? "-";
  const price = book.price ?? item?.price ?? 0;
  const quantity = item?.quantity ?? 0;
  const stock = book.stock ?? Infinity;

  return (
    <li className="flex items-start gap-3 py-3">
      {cover ? (
        <img
          src={`${IMAGE_STORAGE}/books/${book.cover_photo}`}
          alt={`cover ${title}`}
          className="h-24 w-16 shrink-0 rounded-box bg-base-300 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-box bg-base-300 text-xs text-base-content/40">
          Tanpa cover
        </div>
      )}
      <div className="flex min-w-0 grow flex-col gap-1">
        <p className="line-clamp-2 text-sm font-medium" title={title}>
          {title}
        </p>
        <p className="text-sm font-semibold">{rupiah(price)}</p>
        <div className="mt-1 flex items-center gap-1">
          <button
            type="button"
            className="btn btn-xs btn-square btn-ghost"
            aria-label="Kurangi jumlah"
            disabled={pending || quantity <= 1}
            onClick={() => onQuantityChange(item, quantity - 1)}
          >
            <FiMinusCircle className="h-5 w-5" />
          </button>
          <span className="w-8 text-center text-sm tabular-nums">
            {pending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              quantity
            )}
          </span>
          <button
            type="button"
            className="btn btn-xs btn-square btn-ghost"
            aria-label="Tambah jumlah"
            disabled={pending || quantity >= stock}
            onClick={() => onQuantityChange(item, quantity + 1)}
          >
            <FiPlusCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-xs btn-square btn-ghost text-error"
        aria-label={`Hapus ${title} dari keranjang`}
        disabled={pending}
        onClick={() => onQuantityChange(item, 0)}
      >
        <FaTrashAlt className="h-5 w-5" />
      </button>
    </li>
  );
};

export default CartItem;
