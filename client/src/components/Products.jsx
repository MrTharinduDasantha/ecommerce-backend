import ForeverMineBouquetImage from "../assets/ForYou/ForeverMineBouquet.jpg";
import LoveInBloomBouquet from "../assets/ForYou/LoveInBloomBouquet.jpg";
import MeltMyHeart from "../assets/ForYou/MeltMyHeart.jpg";
import TruffleTemptation from "../assets/ForYou/TruffleTemptation.jpg";
import Anniversarypackage from "../assets/ForYou/AnniversaryPackage.jpg";
import LovelyTreats from "../assets/ForYou/LovelyTreats.jpg";
import SurpriseGift from "../assets/ForYou/SurpriseGift.jpg";
import ChanelChance from "../assets/ForYou/ChanelChance.jpg";
import ValentinesPackage from "../assets/ForYou/ValentinesPackage.jpg";
import VersaceEros from "../assets/ForYou/VersaceEros.jpg";


import Image2 from "../assets/ForYou/AnniversaryPackage.jpg";
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
    orderId: 1,
    category: "For You",
    name: "Forever Mine Bouquet",
    description: "A charming bouquet that captures the essence of romance and elegance. Perfect for expressing love and appreciation.",
    image: ForeverMineBouquetImage,
    marketPrice: 7000.0,
    sellingPrice: 5000.0,
    otherImages: [LoveInBloomBouquet,MeltMyHeart,TruffleTemptation],
    detail:
      "A charming bouquet that captures the essence of romance and elegance",
    specification:
      "Flowers: Preserved rose and dried red accents, Packaging: Wrapped in elegant striped paper with a red ribbon, Dimensions:  Approximately 12 inches in length.",
    reviews:
      "Customers adore the timeless beauty and exquisite presentation of this bouquet. It's a perfect gift for any special occasion.",
    rating: 4.7,
    noOfRatings: 342,
    variants: [
      {
        color: "#FEF3C7",
        colorName: "Beige",
        size: ["S", "M", "L", "XL"],
        price: 5000.0,
        quantity: 25,
      },
      {
        color: "#F59FDB",
        colorName: "Pink", 
        size: ["S", "M", "L", "XL"],
        price: 5000.0,
        quantity: 25,
      },
    ],
  },
  {
    id: 2,
    orderId: 2,
    category: "For You",
    name: "Anniversary Package",
    description: "Celebrate your special moments with this luxurious gift set, perfect for anniversaries or romantic occasions. It includes a bottle of premium champagne, a box of exquisite chocolates, and a bouquet of fresh roses.",
    image: Anniversarypackage,
    marketPrice: 9000.0,
    sellingPrice: 7000.0,
    otherImages: [ForeverMineBouquetImage,ValentinesPackage,TruffleTemptation],
    detail:
      "Luxurious gift set for anniversaries or romantic occasions..",
    specification:
      "Champagne: Moët & Chandon Ice Impérial, Chocolate: Assorted gourmet chocolates, Flowers: Fresh red roses in a decorative box, Extras: Personalized message card and decorative packaging.",
    reviews: "Customers love the elegance and thoughtfulness of this gift set. It's a perfect way to express love and appreciation.",
    rating: 4.3,
    noOfRatings: 128,
    variants: [
      {
        color: "#EB001B",
        colorName: "Red",
        size: ["S", "M", "L", "XL"],
        price: 7000.0,
        quantity: 100,
      },
      {
        color: "#FEF3C7",
        colorName: "Beige",
        size: ["S", "M", "L", "XL"],
        price: 7000.0,
        quantity: 85,
      },
    ],
  },
  {
    id: 3,
    orderId: 3,
    category: "For You",
    name: "Lovely Treats",
    description:
      "Indulge in a delightful assortment of sweet treats perfect for any celebration. This set includes beautifully decorated donuts and heart-shaped cookies, each crafted with love and care.",
    image: LovelyTreats,
    marketPrice: 6000.0,
    sellingPrice: 5500.0,
    otherImages: [LoveInBloomBouquet,MeltMyHeart,TruffleTemptation],
    detail:
      "This set includes beautifully decorated donuts and heart-shaped cookies, each crafted with love and care",
    specification:
      "Contents: Assorted donuts and heart-shaped cookies, Flavors: Chocolate, vanilla, and strawberry, Packaging: Presented on a decorative platter, ready for gifting.",
    reviews: "Customers rave about the delicious flavors and charming presentation. It's a perfect gift for loved ones or a sweet treat for yourself.",
    rating: 4.5,
    noOfRatings: 276,
    variants: [
      {
        color: "#F59FDB",
        colorName: "Pink",
        size: ["S", "M", "L", "XL"],
        price: 5500.0,
        quantity: 10,
      },

      {
        color: "#FEF3C7",
        colorName: "Beige",
        size: ["S", "M", "L", "XL"],
        price: 5500.0,
        quantity: 10,
      },
    ],
  },
  {
    id: 4,
    orderId: 4,
    category: "For You",
    name: "Truffle Temptation",
    description: "Experience the ultimate indulgence with this luxurious gift set. It features a premium multi-purpose dry oil for face, body, and hair, paired with a heart-shaped box of rich cherry-filled chocolates.",
    image: TruffleTemptation,
    marketPrice: 10000.0,
    sellingPrice: 9000.0,
    otherImages: [LoveInBloomBouquet,MeltMyHeart,Anniversarypackage],
    detail:
      "It features a premium multi-purpose dry oil for face, body, and hair, paired with a heart-shaped box of rich cherry-filled chocolates.",
    specification:
      "Oil: Nuxe Huile Prodigieuse, suitable for face, body, and hair, Chocolate: Heart-shaped box with cherry-filled chocolates, Packaging: Elegant and ready for gifting.",
    reviews: "Customers love the versatility of the oil and the decadent taste of the chocolates. It's a perfect gift for pampering and indulgence.",
    rating: 4.8,
    noOfRatings: 89,
    variants: [
      {
        color: "#EB001B",
        colorName: "Red",
        size: ["S", "M", "L", "XL"],
        price: 9000.0,
        quantity: 15,
      },
      {
        color: "#000000",
        colorName: "Black",
        size: ["S", "M", "L", "XL"],
        price: 9000.0,
        quantity: 10,
      },
    ],
  },
  {
    id: 5,
    orderId: 5,
    category: "For You",
    name: "Surprise Gift",
    description: "Delight in the mystery of a surprise gift box, elegantly wrapped and filled with delightful treats and treasures. Perfect for any occasion where a touch of surprise is desired.",
    image: SurpriseGift,
    marketPrice: 7000.0,
    sellingPrice: 5500.0,
    otherImages: [ChanelChance,VersaceEros,LovelyTreats],
    detail:
      "A beautifully wrapped gift box filled with delightful treats and treasures.",
    specification:
      'Contents: A variety of surprise items including sweets and small gifts, Packaging: Red box with a gold ribbon, Dimensions: Compact and easy to carry',
    reviews: "Customers enjoy the excitement and joy of discovering what's inside. It's a perfect way to add a little mystery and fun to any celebration.",
    rating: 4.5,
    noOfRatings: 421,
    variants: [
      {
        color: "#EB001B",
        colorName: "Red",
        size: ["S", "M", "L", "XL"],
        price: 5500.0,
        quantity: 30,
      },
      {
        color: "#E11D48",
        colorName: "Hot Pink",
        size: ["S", "M", "L", "XL"],
        price: 5500.0,
        quantity: 25,
      }
    ]
  },
  {
    id: 6,
    orderId: 6,
    category: "For You",
    name: "Chanel Chance",
    description: "Chanel Chance Eau Tendre is a delicate and radiant fragrance that combines the freshness of grapefruit and quince with the softness of jasmine and the smoothness of white musk. Perfect for adding a touch of elegance to any occassion.",
    image: ChanelChance,
    marketPrice: 55000.0,
    sellingPrice: 45000.0,
    otherImages: [LoveInBloomBouquet,MeltMyHeart,ValentinesPackage],
    detail: "Perfect for adding a touch of elegance for the occassion",
    specification: "Fragrance Notes: Grapefruit, quince, jasmine, white musk, Type: Eau de Toilette, Bottle Size: 100ml.",
    reviews: "Customers love the light and refreshing scent, describing it as both elegant and versatile.",
    rating: 4.8,
    noOfRatings: 89,
    variants: [
      {
        color: "#FEF3C7",
        colorName: "Beige",
        size: ["S", "M", "L", "XL"],
        price: 45000.0,
        quantity: 30,
      },
      {
        color: "#F59FDB",
        colorName: "Pink",
        size: ["S", "M", "L", "XL"],
        price: 45000.0,
        quantity: 25,
      }
    ]
  },
  {
    id: 7,
    orderId: 7,
    category: "For You",
    name: "Valentines Package",
    description: "A luxurious gift set designed to celebrate love and romance. It includes a bottle of premium champagne, a box of exquisite chocolates, and a bouquet of fresh roses.",
    image: ValentinesPackage,
    marketPrice: 15000.0,
    sellingPrice: 10000.0,
    otherImages: [Anniversarypackage,SurpriseGift,MeltMyHeart],
    detail: "A luxurious gift set designed to celebrate love and romance",
    specification: "Champagne: Moët & Chandon, Chocolate: Assorted gourmet chocolates, Flowers: Fresh red roses, Packaging: Elegant and ready for gifting.",
    reviews: "Customers appreciate the thoughtful combination of champagne, chocolates, and flowers. It's a perfect gift to express love and affection on Valentine's Day.",
    rating: 4.7,
    noOfRatings: 128,
    variants: [
      {
        color: "#EB001B",
        colorName: "Red",
        size: ["S", "M", "L", "XL"],
        price: 10000.0,
        quantity: 30,
      },
      {
        color: "#000000",
        colorName: "Black",
        size: ["S", "M", "L", "XL"],
        price: 10000.0,
        quantity: 30,
      }
    ]
  },
  {
    id: 8,
    orderId: 8,
    category: "For You",
    name: "Versace Eros",
    description: "Versace Eros is a bold and captivating fragrance for men, inspired by Greek mythology. It combines fresh mint leaves, Italian lemon zest, and green apple with warm notes of tonka bean, amber, and vanilla.",
    image: VersaceEros,
    marketPrice: 45000.0,
    sellingPrice: 35000.0,
    otherImages: [LoveInBloomBouquet,MeltMyHeart,TruffleTemptation],
    detail: "A luxurious gift set designed to celebrate love and romance",
    specification: "Fragrance Notes: Mint leaves, Italian lemon zest, green apple, tonka bean, amber, vanilla, Type: Eau de Toilette, Bottle Size: 100ml.",
    reviews: "Customers appreciate the bold and captivating scent, describing it as both masculine and versatile.",
    rating: 4.8,
    noOfRatings: 128,
    variants: [
      {
        color: "#0D6486",
        colorName: "Blue",
        size: ["S", "M", "L", "XL"],
        price: 35000.0,
        quantity: 30,
      },
      {
        color: "#000000",
        colorName: "Black",
        size: ["S", "M", "L", "XL"],
        price: 35000.0,
        quantity: 30,
      }
    ]
  },
  {
    id: 9,
    orderId: 9,
    category: "For You",
    name: "Love In Bloom Bouquet",
    description: "The Love In Bloom Bouquet is a stunning arrangement of fresh pink roses, perfect for expressing love and admiration. Ideal for anniversaries, birthdays, or any special occasion.",
    image: LoveInBloomBouquet,
    marketPrice: 8500.0,
    sellingPrice: 7500.0,
    otherImages: [ForeverMineBouquetImage,MeltMyHeart,ChanelChance],
    detail: "A stunning arrangement of fresh pink roses, perfect for expressing love and admiration.",
    specification: "Roses: 12 Pink Roses, Packaging: Wrapped in elegant striped paper with a red ribbon, Dimensions:  Approximately 12 inches in length.",
    reviews: "Customers love the vibrant color and freshness of the roses. It's a perfect gift to brighten someone's day and show how much you care.",
    rating: 4.8,
    noOfRatings: 128,
    variants: [
      {
        color: "#F59FDB",
        colorName: "Pink",
        size: ["S", "M", "L", "XL"],
        price: 7500.0,
        quantity: 30,
      },
      {
        color: "#EB001B",
        colorName: "Red",
        size: ["S", "M", "L", "XL"],
        price: 7500.0,
        quantity: 30,
      }
    ]
  },
  {
    id: 10,
    orderId: 10,
    category: "For You",
    name: "Melt My Heart",
    description: "The Melt My Heart gift set is a delightful combination of chocolate-covered strawberries and delicate flowers, perfect for expressing love and affection.",
    image: MeltMyHeart,
    marketPrice: 7500.0,
    sellingPrice: 6500.0,
    otherImages: [LoveInBloomBouquet,LovelyTreats,ValentinesPackage],
    detail: "A delightful combination of chocolate covered strawberries and delicate flowers.",
    specification: "Chocolate: 12 Chocolate Covered Strawberries, Flowers: 12 Pink Roses, Packaging: Wrapped in elegant striped paper with a red ribbon, Dimensions:  Approximately 12 inches in length.",
    reviews: "Customers love the delicious taste of the strawberries and the beautiful presentation. It's a perfect gift for special occasions and romantic gestures.",
    rating: 4.8,
    noOfRatings: 128,
    variants: [
      {
        color: "#F59FDB",
        colorName: "Pink",
        size: ["S", "M", "L", "XL"],
        price: 6500.0,
        quantity: 30,
      },
      {
        color: "#FEF3C7",
        colorName: "Beige",
        size: ["S", "M", "L", "XL"],
        price: 6500.0,
        quantity: 30,
      }
    ]
  }
];

export default products;


