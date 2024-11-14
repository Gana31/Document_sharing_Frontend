
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const currency  = '₹'
  const imageUrl = image && image.length > 0 ? image[0].url : 'default_image_url_here';
  return (
    <Link className=" text-gary-700 cursor-pointer" to={`productPage/${id}`}>
      <div className=" overflow-hidden ">
        <img
          className=" hover:scale-110 transition ease-in-out"
          src={imageUrl}
          alt=""
        />
      </div>

      <p className=" pt-3 pb-1 text-sm">{name}</p>
      <p className=" text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;