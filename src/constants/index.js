import {
  MdDashboard,
  MdPeople,
  MdPerson,
  MdCategory,
  MdMenuBook,
  MdReceipt,
  MdInbox,
} from "react-icons/md";

export const publicNavLinks = [
  { to: "/", label: "Home" },
  { to: "/books", label: "Buku Terlaris" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export const adminMenu = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: MdDashboard,
  },
  {
    label: "Users",
    to: "/admin/users",
    icon: MdPeople,
  },
  {
    label: "Authors",
    to: "/admin/authors",
    icon: MdPerson,
  },
  {
    label: "Genres",
    to: "/admin/genres",
    icon: MdCategory,
  },
  {
    label: "Books",
    to: "/admin/books",
    icon: MdMenuBook,
  },
  {
    label: "Transactions",
    to: "/admin/transactions",
    icon: MdReceipt,
  },
  {
    label: "Inbox",
    to: "/admin/inbox",
    icon: MdInbox,
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Nadia Prameswari",
    location: "Jakarta",
    rating: 5,
    quote:
      "Filosofi Teras yang saya pesan datang dalam dua hari dan kondisinya mulus. Packing rapi, jadi sudut buku tetap aman meski dikirim jauh.",
  },
  {
    id: 2,
    name: "Rangga Aditya",
    location: "Bandung",
    rating: 5,
    quote:
      "Pilihan bukunya lengkap dan deskripsinya jelas. Saya bisa menemukan edisi yang sudah lama dicari tanpa harus keliling toko.",
  },
  {
    id: 3,
    name: "Sinta Maharani",
    location: "Surabaya",
    rating: 4,
    quote:
      "Proses checkout cepat dan status pesanan mudah dipantau. Pengirimannya sedikit lebih lama dari perkiraan, tapi bukunya sampai dengan baik.",
  },
  {
    id: 4,
    name: "Bagas Nugroho",
    location: "Yogyakarta",
    rating: 5,
    quote:
      "Suka banget sama rekomendasi bukunya. Banyak judul menarik yang belum saya kenal, dan semuanya tersedia dengan harga wajar.",
  },
  {
    id: 5,
    name: "Ayu Lestari",
    location: "Makassar",
    rating: 5,
    quote:
      "Baru pertama kali belanja di sini dan langsung puas. Buku original, direspons cepat, dan pengiriman ke luar Jawa tetap aman.",
  },
];
