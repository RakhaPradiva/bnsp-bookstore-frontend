import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Register } from "./pages/auth";
import { AdminLayout, PublicLayout } from "./layouts";
import {
  AboutUs,
  BookDetail,
  Books,
  Contact,
  Checkout,
  Home,
  MyTransaction,
} from "./pages/public";
import {
  Dashboard,
  AdminAuthors,
  AdminBooks,
  AdminGenres,
  AdminTransactions,
  AdminUsers,
  AddGenre,
  EditGenre,
  AddAuthor,
  EditAuthor,
  AddBook,
  EditBook,
  EditUser,
  Inbox,
} from "./pages/admin/";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="books" element={<Books />} />
            <Route path="books/:id" element={<BookDetail />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="transaction-history" element={<MyTransaction />} />
          </Route>

          {/* auth */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* admin */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="books">
              <Route index element={<AdminBooks />} />
              <Route path="add" element={<AddBook />} />
              <Route path="edit/:id" element={<EditBook />} />
            </Route>

            <Route path="authors">
              <Route index element={<AdminAuthors />} />
              <Route path="add" element={<AddAuthor />} />
              <Route path="edit/:id" element={<EditAuthor />} />
            </Route>

            <Route path="genres">
              <Route index element={<AdminGenres />} />
              <Route path="add" element={<AddGenre />} />
              <Route path="edit/:id" element={<EditGenre />} />
            </Route>

            <Route path="transactions">
              <Route index element={<AdminTransactions />} />
            </Route>

            <Route path="users">
              <Route index element={<AdminUsers />} />
              <Route path="edit/:id" element={<EditUser />} />
            </Route>

            <Route path="inbox" element={<Inbox />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
