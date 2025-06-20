import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent, getEventProducts } from "../../api/event";
import ProductCard from "../../components/ProductCard";

const EventProducts = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);

        // Fetch event details
        const eventData = await getEvent(eventId);
        if (eventData.message === "Event fetched successfully") {
          setEvent(eventData.event);
        }

        // Fetch event products
        const productsData = await getEventProducts(eventId);
        if (productsData.message === "Event products fetched successfully") {
          // Format products to match ProductCard component
          const formattedProducts = productsData.products.map((product) => ({
            id: product.idProduct,
            name: product.Description,
            image: product.Main_Image_Url,
            price: `LKR ${product.Selling_Price}`,
            oldPrice: product.Market_Price
              ? `LKR ${product.Market_Price}`
              : null,
            category: "Event Offer",
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  const handleProductClick = (product) => {
    navigate(`/product-page/${product.id}`, {
      state: {
        product: {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          oldPrice: product.oldPrice,
          discountName: product.discountName,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="container mx-auto px-3 xs:px-4 sm:px-5 lg:px-2 py-4 sm:py-6 lg:py-8 flex-grow">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5CAF90] mx-auto mb-4"></div>
              <p className="text-[#1D372E]">Loading event details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="container mx-auto px-3 xs:px-4 sm:px-5 lg:px-2 py-4 sm:py-6 lg:py-8 flex-grow">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4">😞</div>
              <h3 className="text-2xl font-semibold text-[#1D372E] mb-2">
                Event not found
              </h3>
              <p className="text-[#7A7A7A] mb-4">
                {error ||
                  "The event you're looking for doesn't exist or has been removed."}
              </p>
              <button
                onClick={() => navigate("/events")}
                className="bg-[#5CAF90] text-white px-6 py-2 rounded-md hover:bg-[#4a9f7a] transition-colors"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-3 xs:px-4 sm:px-5 lg:px-2 py-4 sm:py-6 lg:py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-4">
          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {/* Event Header */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-[#E8E8E8]">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Event Image */}
                {event.Event_Image_Url && (
                  <div className="md:w-1/3">
                    <img
                      src={event.Event_Image_Url}
                      alt={event.Event_Name}
                      className="w-full h-48 md:h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Event Details */}
                <div className="md:w-2/3">
                  <h1 className="text-[#1D372E] text-3xl md:text-4xl font-bold mb-4">
                    {event.Event_Name}
                  </h1>
                  <p className="text-[#7A7A7A] text-lg leading-relaxed mb-4">
                    {event.Event_Description}
                  </p>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-[#1D372E] text-2xl font-semibold mb-6">
                EVENT PRODUCTS
              </h2>

              {products.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-[#E8E8E8]">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-[#1D372E] mb-2">
                    No products available
                  </h3>
                  <p className="text-[#7A7A7A]">
                    This event doesn't have any products yet. Check back later!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
                    >
                      <ProductCard
                        image={product.image}
                        category={product.category}
                        title={product.name}
                        price={product.price}
                        oldPrice={product.oldPrice}
                        id={product.id}
                        onProductClick={() => handleProductClick(product)}
                        className="h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Back to Events Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate("/events")}
                className="bg-[#1D372E] text-white px-8 py-3 rounded-md hover:bg-[#2d4a3e] transition-colors font-semibold"
              >
                Back to All Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventProducts;
