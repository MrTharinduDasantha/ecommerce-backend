import Image1 from "../assets/image1.jpg";
import Image2 from "../assets/image2.jpg";
import Image3 from "../assets/image3.jpg";
import Image4 from "../assets/image4.jpg";
import Image5 from "../assets/image5.jpg";
import Image6 from "../assets/image6.jpg";
import Image7 from "../assets/image7.jpg";
import Image8 from "../assets/image8.jpg";
import Image9 from "../assets/image9.jpg";

export const products = [
  {
    id: 1,
    category: "electronics",
    name: "Wireless Bluetooth Earbuds",
    description: "Premium sound quality with noise cancellation feature",
    image: Image9,
    marketPrice: 12000.0,
    sellingPrice: 8990.0,
    otherImages: [Image2, Image6, Image4],
    detail:
      "Experience crystal clear audio with our advanced wireless earbuds. Perfect for music lovers and professionals alike.",
    specification:
      "Battery: 8hrs playback | Charging: USB-C | Weight: 5g each | Water resistance: IPX5",
    reviews:
      "Customers praise the comfortable fit and excellent noise cancellation",
    rating: 4.7,
    noOfRatings: 342,
    variants: [
      {
        color: "#000000",
        colorName: "Black",
        size: null,
        price: 8890.0,
        quantity: 0,
      },
      {
        color: "#FFFFFF",
        colorName: "White",
        size: null,
        price: 8090.0,
        quantity: 25,
      },
    ],
  },
  {
    id: 2,
    category: "clothing",
    name: "Men's Slim Fit Shirt",
    description: "Premium cotton shirt with comfortable fit Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam autem ex nihil doloribus quas maxime obcaecati eveniet ipsa, voluptatem adipisci beatae temporibus illo magni voluptatibus sequi nobis. Labore, nemo est?",
    image: Image8,
    marketPrice: 3500.0,
    sellingPrice: 2490.0,
    otherImages: [Image5, Image6],
    detail:
      "Made with 100% premium cotton for all-day comfort. Perfect for both casual and formal occasions.",
    specification:
      "Material: 100% Cotton | Care: Machine wash | Origin: Sri Lanka",
    reviews: "Customers love the perfect fit and quality fabric",
    rating: 4.3,
    noOfRatings: 128,
    variants: [
      {
        color: "#1E40AF",
        colorName: "Blue",
        size: ["S", "M", "L", "XL"],
        price: 2490.0,
        quantity: 100,
      },
      {
        color: "#111827",
        colorName: "Navy",
        size: ["S", "M", "L", "XL"],
        price: 2490.0,
        quantity: 85,
      },
    ],
  },
  {
    id: 3,
    category: "groceries",
    name: "Organic Green Tea",
    description:
      "100% organic green tea leaves Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam autem ex nihil doloribus quas maxime obcaecati eveniet ipsa, voluptatem adipisci beatae temporibus illo magni voluptatibus sequi nobis. Labore, nemo est?",
    image: Image7,
    marketPrice: 800.0,
    sellingPrice: 650.0,
    otherImages: [Image1, Image6],
    detail:
      "Sourced from high-altitude tea estates. Rich in antioxidants and natural flavor.",
    specification:
      "Net weight: 100g | Shelf life: 12 months | Origin: Nuwara Eliya",
    reviews: "Customers appreciate the fresh aroma and health benefits",
    rating: 4.5,
    noOfRatings: 276,
    variants: [
      {
        color: null,
        size: null,
        price: 650.0,
        quantity: 10,
      },
    ],
  },
  {
    id: 4,
    category: "furniture",
    name: "Modern Wooden Chair",
    description: "Ergonomic design with premium wood finish",
    image: Image6,
    marketPrice: 12500.0,
    sellingPrice: 9990.0,
    otherImages: [Image3, Image5, Image6],
    detail:
      "Handcrafted from sustainable teak wood. Perfect for both home and office use.",
    specification:
      "Material: Teak Wood | Dimensions: 20x20x32 inches | Weight capacity: 120kg",
    reviews: "Highly rated for comfort and durability",
    rating: 4.8,
    noOfRatings: 89,
    variants: [
      {
        color: "#78350F",
        colorName: "Dark wood",
        size: null,
        price: 9990.0,
        quantity: 15,
      },
      {
        color: "#FEF3C7",
        colorName: "Light wood",
        size: null,
        price: 9990.0,
        quantity: 10,
      },
    ],
  },
  {
    id: 5,
    category: "electronics",
    name: "Smart Watch",
    description: "Fitness tracking with heart rate monitor",
    image: Image5,
    marketPrice: 15000.0,
    sellingPrice: 11990.0,
    otherImages: [Image6, Image2],
    detail:
      "Track your fitness goals with this feature-packed smartwatch. Compatible with both Android and iOS.",
    specification:
      'Battery: 7 days | Display: 1.4" AMOLED | Water resistance: 5ATM',
    reviews: "Excellent fitness tracking features and stylish design",
    rating: 4.5,
    noOfRatings: 421,
    variants: [
      {
        color: "#000000",
        colorName: "Black",
        size: null,
        price: 11990.0,
        quantity: 30,
      },
      {
        color: "#E11D48",
        colorName: "Rose gold", // Rose gold
        size: null,
        price: 12490.0,
        quantity: 25,
      },
    ],
  },
];
