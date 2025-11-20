import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";
import { formatDiscount } from "../utils/formatDiscount.js";

export default function CartDrawer({ onClose }) {
  const { user } = useAuth();
  const {
    cartItems,
    cartQuantity,
    cartTotal,
    updateItem,
    removeItem,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setTimeout(() => setIsVisible(true), 10);
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 200);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleClick = (product) => {
    if (!product.slug) return;
    navigate(`/product/${product.slug}`);
  };

  if (!cartItems)
    return (
      <div
        className={`fixed inset-0 bg-black/40 flex justify-end z-50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleOverlayClick}
      >
        <div
          className={`bg-white w-120 h-full shadow-xl p-6 flex flex-col transform transition-transform duration-300 ${
            isVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-screen justify-center items-center text-4xl text-yellow-500 font-bold">
            Loading...
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={`fixed inset-0 bg-black/40 flex justify-end z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-white w-120 h-full shadow-xl p-6 flex flex-col transform transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-center">
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900 text-6xl"
          >
            &times;
          </button>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-10 mt-4">
          <h1 className="text-3xl font-extrabold text-yellow-500">Your Cart</h1>
          <span
            className={`text-white text-[25px] hover:-translate-y-1 bg-yellow-500 ${
              cartQuantity > 9 ? "px-3" : "px-4.5"
            } rounded-full font-bold transition-all duration-200`}
          >
            {cartQuantity}
          </span>
        </div>

        {/* Cart Items */}
        <div className="flex-1 [&::-webkit-scrollbar]:hidden overflow-y-scroll space-y-2">
          {cartItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div key={item.$id} className="relative flex gap-3 border-b py-4">
                {/* Discount badge */}
                {formatDiscount(product.discount_tag) && (
                  <div
                    className={`absolute ${
                      product.price > 9.99
                        ? "top-2 left-12 px-0.75"
                        : "left-12 px-1.5"
                    } bg-green-700 text-white font-extrabold text-sm cursor-pointer hover:-translate-y-1 p-0.5 rounded-full transition-all duration-200`}
                  >
                    {product.discount_tag}
                  </div>
                )}

                {/* Product image */}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="cursor-pointer w-20 h-25 rounded-lg object-cover"
                  onClick={() => handleClick(product)}
                />

                {/* Product details */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p
                      className="font-mono text-lg text-gray-700 cursor-pointer hover:text-gray-900 font-semibold mt-1"
                      onClick={() => handleClick(product)}
                    >
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 ml-11 mt-1">
                      <div className="flex-col mt-0.5">
                        <button
                          className={`flex mb-1 ${
                            item.quantity === product.stock
                              ? "bg-gray-300"
                              : "bg-yellow-300 hover:bg-orange-600"
                          } cursor-pointer justify-center items-center w-5 h-5 font-bold rounded-md text-sm`}
                          onClick={() => updateItem(item.$id, product.$id, 1)}
                          disabled={item.quantity === product.stock}
                        >
                          +
                        </button>
                        <button
                          className={`flex mb-1 ${
                            item.quantity === 1
                              ? "bg-gray-300"
                              : "bg-yellow-300 hover:bg-orange-600"
                          } cursor-pointer justify-center items-center w-5 h-5 font-bold rounded-md text-sm`}
                          onClick={() => updateItem(item.$id, product.$id, -1)}
                          disabled={item.quantity === 1}
                        >
                          −
                        </button>
                        <button
                          className="flex justify-center items-center rounded-md w-5 h-5 cursor-pointer bg-red-400 hover:bg-red-500"
                          onClick={() => removeItem(item.$id)}
                        >
                          <img src="/icons/delete.png" alt="delete" />
                        </button>
                      </div>
                      <span
                        className={`text-white text-[25px] hover:-translate-y-1 bg-yellow-500 ${
                          item.quantity > 9 ? "px-3" : "px-4.5"
                        } rounded-full font-bold transition-all duration-200`}
                      >
                        {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Price + Subtotal */}
                  <div className="flex justify-between mt-10">
                    <div className="flex gap-2">
                      {formatDiscount(product.discount_tag) && (
                        <p className="text-gray-500 text-md font-mono">
                          {formatPrice(product.price, product.currency, product.discount_tag)}
                        </p>
                      )}
                      <p
                        className={`text-gray-500 text-md font-mono ${
                          formatDiscount(product.discount_tag)
                            ? "line-through text-sm"
                            : ""
                        }`}
                      >
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                    <p className="text-gray-700 font-mono">
                      {formatPrice(item.subtotal, product.currency)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer / Checkout */}
        <div className="mt-3 border-t-3 pt-5">
          <p className="flex justify-between font-extrabold text-orange-500">
            <span className="text-black text-[19px]">Total (USD):</span>
            <span className="text-[25px]">{formatPrice(cartTotal, "USD")}</span>
          </p>
          <button
            className="w-full bg-yellow-500 text-white py-2 rounded-full mt-3 hover:bg-orange-600 text-[18px] font-extrabold"
            onClick={async () => {
              setCheckoutLoading(true);
              await clearCart();
              setCheckoutLoading(false);
              alert("Checkout successful! Cart cleared.");
            }}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? "Processing..." : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}