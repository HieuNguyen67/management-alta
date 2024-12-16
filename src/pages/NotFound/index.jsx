
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="not-found">
    <img
      src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
      alt="not-found"
      className="w-100"
      loading="lazy"
    />
    <p className="text-center">
      <button variant="dark">
        <Link
          to="/"
          className="link-home text-decoration-none text-light"
        >
          Go Home
        </Link>
      </button>
    </p>
  </div>
);

export default NotFound;
