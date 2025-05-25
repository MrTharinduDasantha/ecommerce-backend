import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import Sidebar from '../Sidebar';
import ProductCard from '../ProductCard';
import ForYouBanner from '../ForYouBanner';
import { getCategories, getProductsBySubCategoryId } from '../../api/product';

const SubCategory = () => {
    const { id } = useParams(); // Get subcategory ID from the URL
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                if (data && data.categories) {
                    setCategories(data.categories);
                } else {
                    setError("Unexpected data structure: " + JSON.stringify(data));
                }
            } catch (error) {
                console.error("Failed to load categories:", error.message);
                setError(error.message || "Failed to load categories");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProductsBySubCategoryId(id); // Fetch products directly by subcategory ID
                setProducts(data.products || []);
            } catch (error) {
                console.error(`Failed to load products for subcategory ${id}:`, error.message);
                setError(error.message || "Failed to load products");
            }
        };

        if (id) {
            fetchProducts();
        }
    }, [id]);

    if (loading) return <div>Loading categories...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="container mx-auto px-3 xs:px-4 sm:px-5 py-4 sm:py-6 lg:py-8 flex-grow">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    <div className="w-full lg:w-64 xl:w-72">
                        <Sidebar />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ForYouBanner className="mb-4 sm:mb-6" />

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {products.map(product => (
                                    <ProductCard 
                                        key={product.idProduct}
                                        image={product.Main_Image_Url}
                                        title={product.Description}
                                        price={product.Selling_Price}
                                        oldPrice={product.Market_Price}
                                        weight={product.SIH || 'N/A'}
                                        id={product.idProduct}
                                        discountName={product.Discount_Name}
                                        discountAmount={product.Discount_Amount}
                                        className="h-full"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No products available for this subcategory.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubCategory;