import { MdMenuBook } from "react-icons/md";
import { FaXTwitter, FaInstagram, FaFacebook } from "react-icons/fa6";

import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10">
    <aside>
      <MdMenuBook className="h-20 w-20 text-primary" />
      <p>
        BookStore
        <br />
      </p>
    </aside>
    <nav>
      <h6 className="footer-title">Social</h6>
      <div className="grid grid-flow-col gap-4">
        <Link to="hhtps://facebook.com">
          <FaFacebook className="h-8 w-8" />
        </Link>
        <Link to="hhtps://instagram.com">
          <FaInstagram className="h-8 w-8" />
        </Link>
        <Link to="hhtps://x.com">
          <FaXTwitter className="h-8 w-8" />
        </Link>
      </div>
    </nav>
  </footer>
);

export default Footer;
