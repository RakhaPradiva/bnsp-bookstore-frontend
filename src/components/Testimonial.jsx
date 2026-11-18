import { testimonials } from "../constants";

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const StarRating = ({ value }) => {
  return (
    <div className="rating rating-sm" aria-label={`Rating ${value} dari 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`mask mask-star ${
            index < value ? "bg-warning" : "bg-base-content/20"
          }`}
          aria-label={`${index + 1} bintang`}
          aria-current={index + 1 === value ? "true" : undefined}
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial, featured = false }) => {
  const { name, location, rating, quote } = testimonial;

  return (
    <article
      className={`card bg-base-100 border border-base-300 ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <div className="card-body gap-4 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <StarRating value={rating} />
          <span className="text-xs font-medium text-base-content/60">
            {rating.toFixed(1)}
          </span>
        </div>

        <blockquote
          className={`leading-relaxed text-base-content/80 ${
            featured ? "text-base sm:text-lg" : "text-sm"
          }`}
        >
          &ldquo;{quote}&rdquo;
        </blockquote>

        <div className="mt-auto flex items-center gap-3 border-t border-base-300 pt-4">
          <div className="avatar avatar-placeholder">
            <div className="w-10 rounded-full bg-base-300 text-base-content/70">
              <span className="text-sm font-semibold">{getInitials(name)}</span>
            </div>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-base-content/60">{location}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

const Testimonial = () => {
  const [featured, ...rest] = testimonials;

  return (
    <section
      aria-labelledby="testimonials-title"
      className="bg-base-200 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2
            id="testimonials-title"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Apa kata pembaca
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-base-content/70 sm:text-base">
            Catatan pembeli dari Jakarta sampai Makassar.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TestimonialCard testimonial={featured} featured />
          {rest.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
