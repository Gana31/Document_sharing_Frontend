import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const currency = '₹';
  const maxNameLength = 20;
  const imageUrl = image && image.length > 0 ? image[0].url : 'default_image_url_here';
  const trimmedName = name.length > maxNameLength ? name.slice(0, maxNameLength) + "..." : name;

  return (
    <Link
      className="text-gray-700 cursor-pointer"
      to={`productPage/${id}`}
    >
      <div className="w-full h-full flex flex-col items-center bg-white border rounded-lg overflow-hidden shadow-sm">
        {/* Image container */}
        <div className="w-full h-60 bg-white flex items-center justify-center overflow-hidden group">
          <img
            className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
            src={imageUrl}
            alt={name}
          />
        </div>

        {/* Product details */}
        <div className="flex flex-col items-center p-3">
          <p className="text-sm font-medium text-center truncate w-full">
            {trimmedName}
          </p>
          <p className="text-sm font-semibold">
            {currency}{price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
