import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import Sidebar1 from '../Sidebar1';
import ProductCard from '../ProductCard';
import ForYouBanner from '../ForYouBanner';
import { getCategories, getProductsBySubCategoryId } from '../../api/product';

const AllCategories = () => {
    const location = useLocation(); 
    const selectedCategoryId = location.state?.selectedCategoryId;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [productsBySubCategory, setProductsBySubCategory] = useState({});

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

    const selectedCategory = categories.find(c => c.idProduct_Category === parseInt(selectedCategoryId));

    useEffect(() => {
        const fetchProducts = async (subcategories) => {
            const newProductsBySubCategory = {};
            for (const sub of subcategories) {
                try {
                    const data = await getProductsBySubCategoryId(sub.idSub_Category);
                    newProductsBySubCategory[sub.idSub_Category] = data.products || [];
                } catch (error) {
                    console.error(`Failed to load products for subcategory ${sub.idSub_Category}:`, error.message);
                }
            }
            setProductsBySubCategory(newProductsBySubCategory);
        };

        if (selectedCategory && selectedCategory.subcategories?.length > 0) {
            fetchProducts(selectedCategory.subcategories);
        }
    }, [selectedCategory]);

    if (loading) return <div>Loading categories...</div>;
    if (error) return <div>Error: {error}</div>;

    // Flatten all products from all subcategories into a single array
    const allProducts = Object.values(productsBySubCategory).flat();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="container mx-auto px-3 xs:px-4 sm:px-5 py-4 sm:py-6 lg:py-8 flex-grow">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    <div className="w-full lg:w-64 xl:w-72">
                        <Sidebar1 subcategories={selectedCategory?.subcategories || []} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ForYouBanner className="mb-4 sm:mb-6" />
                       
                        {selectedCategory ? (
                            <div className="space-y-4 mt-4">
                                {allProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {allProducts.map(product => (
                                            <ProductCard 
                                                key={product.idProduct}
                                                image={product.Main_Image_Url}
                                                category={selectedCategory.Description} // Use category description instead of subcategory
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
                                    <p className="text-sm text-gray-500">No products available for this category.</p>
                                )}
                            </div>
                        ) : (
                            <div>No category found. Please enter a valid Category ID.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllCategories;