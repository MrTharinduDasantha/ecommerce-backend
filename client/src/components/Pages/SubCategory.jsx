import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom"; 
import Sidebar from '../Sidebar';
import ProductCard from '../ProductCard';
import ForYouBanner from '../ForYouBanner';
import { getProductsBySubCategoryId } from '../../api/product';

const SubCategory = () => {
    const { id } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [products, setProducts] = useState([]);
    const [subcategoryName, setSubcategoryName] = useState(location.state?.subcategoryName || '');
    const [categoryName, setCategoryName] = useState(location.state?.categoryName || '');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getProductsBySubCategoryId(id);
                if (data && data.products) {
                    setProducts(data.products);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error(`Failed to load products for subcategory ${id}:`, error.message);
                setError(error.message || "Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProducts();
        }
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg text-gray-600">Loading products...</div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg text-red-600">Error: {error}</div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="container mx-auto px-3 xs:px-4 sm:px-5 py-4 sm:py-6 lg:py-8 flex-grow">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    <div className="w-full lg:w-64 xl:w-72">
                        <Sidebar />
                    </div>
                    <div className="flex-1">
                        <ForYouBanner className="mb-4 sm:py-6" />
                        
                        <div className="mb-6">
                            {categoryName && (
                                <div className="text-sm text-gray-600 mb-2">
                                    Category: {categoryName}
                                </div>
                            )}
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {subcategoryName || 'Products'}
                            </h2>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {products.map(product => (
                                    <ProductCard 
                                        key={product.idProduct}
                                        image={product.Main_Image_Url}
                                        title={product.Description}
                                        price={`LKR ${product.Selling_Price}`}
                                        oldPrice={`LKR ${product.Market_Price}`}
                                        weight={product.SIH || 'N/A'}
                                        id={product.idProduct}
                                        discountName={product.Discount_Name}
                                        discountAmount={product.Discount_Amount}
                                        className="h-full"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No products available for this subcategory.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubCategory;