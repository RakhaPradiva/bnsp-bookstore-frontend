import { Link } from "react-router-dom";
import { IMAGE_STORAGE } from "../api";
import { rupiah } from "../utils";

const BookCard = ({ book }) => {
  return (
    <div className="card bg-base-100 h-full w-full border border-base-300 shadow-sm transition-shadow hover:shadow-md">
      <figure className="aspect-3/4 overflow-hidden bg-base-300">
        <img
          src={`${IMAGE_STORAGE}/books/${book.cover_photo}`}
          alt={`cover ${book.title}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title line-clamp-2 text-base" title={book.title}>
          {book.title}
        </h2>
        <p className="line-clamp-2 text-sm text-base-content/60">
          {book.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <span className="badge badge-ghost badge-sm">{book.genre?.name}</span>
          <span className="text-base-content/70">{book.author?.name}</span>
        </div>
        <div className="card-actions my-auto justify-end pt-2">
          <p className="text-lg font-semibold m-auto">{rupiah(book.price)}</p>
          <Link
            to={`/books/${book.id}`}
            className="btn btn-sm lg:btn-md btn-primary"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
