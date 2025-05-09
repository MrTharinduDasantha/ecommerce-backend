import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import Sidebar from '../Sidebar';
import ProductCard from '../ProductCard';
import ForYouBanner from '../ForYouBanner';
import { getCategories, getProductsBySubCategoryId } from '../../api/product';

const AllCategories = () => {
    const location = useLocation(); 
    const selectedCategoryId = location.state?.selectedCategoryId;
    const navigate = useNavigate();

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

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="container mx-auto px-3 xs:px-4 sm:px-5 py-4 sm:py-6 lg:py-8 flex-grow">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    <div className="w-full lg:w-64 xl:w-72">
                        <Sidebar />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ForYouBanner className="mb-4 sm:mb-6" />
                       
                        {selectedCategory ? (
                            <div className="space-y-4 mt-4">
                                {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 ? (
                                    selectedCategory.subcategories.map((subcategory) => (
                                        <div key={subcategory.idSub_Category} >
                                            <div className="p-4 bg-gray-100 text-lg font-medium text-gray-800">
                                                {subcategory.Description}
                                            </div>
                                            <div className="pl-6 pb-4 pt-2">
                                                {productsBySubCategory[subcategory.idSub_Category]?.length > 0 ? (
                                                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                       {productsBySubCategory[subcategory.idSub_Category].map(product => (
    <ProductCard 
        key={product.idProduct}
        image={product.Main_Image_Url}
        category={subcategory.Description}
        title={product.Description}
        price={product.Selling_Price}
        oldPrice={product.Market_Price}
        weight={product.SIH || 'N/A'}
        id={product.idProduct}
        
        // Assuming the discount fields are coming from your API data
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
                                    ))
                                ) : (
                                    <div>No subcategories available for this category.</div>
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
