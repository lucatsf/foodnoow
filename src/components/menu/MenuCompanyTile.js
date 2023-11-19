import AddToCartButton from "@/components/menu/AddToCartButton";

export default function MenuCompanyTile({onAddToCart, ...item}) {
  const {image, description, name,
  } = item;
  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center cursor-pointer
      group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
      <div className="text-center">
        <img src={image || '/not-image.png'} className="max-h-auto max-h-24 block mx-auto"/>
      </div>
      <h4 className="font-semibold text-xl my-3">{name}</h4>
      <p className="text-gray-500 text-sm line-clamp-3">
        {description}
      </p>
    </div>
  );
}