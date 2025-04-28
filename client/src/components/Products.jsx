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
import ZARAHandbags from "../assets/OnSale/ZARAHandbags.jpg";
import Iphone16promax from "../assets/OnSale/Iphone16promax.jpg";
import ClassicHandbags from "../assets/OnSale/ClassicHandbags.jpg";
import GucciHandbag from "../assets/OnSale/GucciHandbag.jpg";
import Microwave from "../assets/OnSale/Microwave.jpg";
import LeisaraHandbag from "../assets/OnSale/LeisaraHandbag.jpg";
import MacbookAir from "../assets/OnSale/MacbookAir.jpg";
import DELLLaptop from "../assets/OnSale/DELLLaptop.jpg";
import NICHECoffeeMachine from "../assets/OnSale/NICHECoffeeMachine.jpg";
import Refrigerator from "../assets/OnSale/Refrigerator.jpg";
import BerryDelight from "../assets/RamadanOffers/BerryDelight.jpg";
import BlueberrySponge from "../assets/RamadanOffers/BlueberrySponge.jpg";
import ChocolateDelight from "../assets/RamadanOffers/ChocolateDelight.jpg";
import CranberryDelight from "../assets/RamadanOffers/CranberryDelight.jpg";
import FloralTouchDelight from "../assets/RamadanOffers/FloralTouchDelight.jpg";
import FruitAndNuttyTreat from "../assets/RamadanOffers/FruitAndNuttyTreat.jpg";
import RoseVelvetCake from "../assets/RamadanOffers/RoseVelvetCake.jpg";
import StrawberryTreat from "../assets/RamadanOffers/StrawberryTreat.jpg";
import WeddingCake from "../assets/RamadanOffers/WeddingCake.jpg";
import WonderChocolateTreat from "../assets/RamadanOffers/WonderChocolateTreat.jpg";
import CartierWatch from "../assets/RushDelivery/CartierWatch.jpg";
import ChanelPerfume from "../assets/RushDelivery/ChanelPerfume.jpg";
import CupidsKissesBox from "../assets/RushDelivery/CupidsKissesBox.jpg";
import GiftBundle from "../assets/RushDelivery/GiftBundle.jpg";
import MacaronsTreat from "../assets/RushDelivery/MacaronsTreat.jpg";
import ReindeerCup from "../assets/RushDelivery/ReindeerCup.jpg";
import RosyTreats from "../assets/RushDelivery/RosyTreats.jpg";
import SummerMistBouquet from "../assets/RushDelivery/SummerMistBouquet.jpg";
import SweetDelight from "../assets/RushDelivery/SweetDelight.jpg";
import LovelySpringBouquet from "../assets/RushDelivery/LovelySpringBouquet.jpg";


import Image2 from "../assets/ForYou/AnniversaryPackage.jpg";
import Image3 from "../assets/image3.jpg";
import Image4 from "../assets/image4.jpg";
import Image5 from "../assets/image5.jpg";
import Image6 from "../assets/image6.jpg";
import Image7 from "../assets/image7.jpg";
import Image8 from "../assets/image8.jpg";
import Image9 from "../assets/image9.jpg";

// For You Products
const ForYouProducts = [
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

// On Sale Products
const onSaleProducts = [
  {
    id: 11,
    orderId: 11,
    category: "On Sale",
    name: "ZARA Handbags",
    description: "Elegant and stylish ZARA handbags collection, perfect for any occasion. Made with premium materials and featuring modern designs.",
    image: ZARAHandbags,
    marketPrice: 6000.0,
    sellingPrice: 5500.0,
    otherImages: [ClassicHandbags, GucciHandbag, LeisaraHandbag],
    detail: "Premium quality handbags with modern designs",
    specification: "Material: Premium leather, Dimensions: Various sizes available, Features: Multiple compartments, adjustable straps",
    reviews: "Customers love the quality and style of these handbags. Perfect for both casual and formal occasions.",
    rating: 4.6,
    noOfRatings: 256,
    variants: [
      {
        color: "#9F519A",
        colorName: "Purple",
        size: ["S", "M", "L", "XL"],
        price: 5500.0,
        quantity: 20,
      },
      {
        color: "#000000",
        colorName: "Black",
        size: ["S", "M", "L", "XL"],
        price: 5500.0,
        quantity: 20,
      }
    ]
  },
  {
    id: 12,
    orderId: 12,
    category: "On Sale",
    name: "iPhone 16 Pro Max",
    description: "The latest iPhone 16 Pro Max with cutting-edge technology and premium features. Experience the future of mobile technology.",
    image: Iphone16promax,
    marketPrice: 300000.0,
    sellingPrice: 233000.0,
    otherImages: [MacbookAir, DELLLaptop, NICHECoffeeMachine],
    detail: "Latest iPhone with premium features and cutting-edge technology",
    specification: "Display: 6.7-inch Super Retina XDR, Storage: 256GB/512GB/1TB, Camera: Triple 48MP camera system",
    reviews: "Customers are amazed by the performance and camera quality. A perfect upgrade for tech enthusiasts.",
    rating: 4.9,
    noOfRatings: 189,
    variants: [
      {
        color: "#31032E",
        colorName: "Dark Purple",
        size: ["S", "M", "L", "XL"],
        price: 233000.0,
        quantity: 10,
      },
      {
        color: "#000000",
        colorName: "Space Black",
        size: ["S", "M", "L", "XL"],
        price: 233000.0,
        quantity: 10,
      }
    ]
  },
  {
    id: 13,
    orderId: 13,
    category: "On Sale",
    name: "Classic Handbags",
    description: "Timeless classic handbags collection featuring elegant designs and premium craftsmanship. Perfect for the sophisticated woman.",
    image: ClassicHandbags,
    marketPrice: 7000.0,
    sellingPrice: 6500.0,
    otherImages: [ZARAHandbags, GucciHandbag, LeisaraHandbag],
    detail: "Timeless designs with premium craftsmanship",
    specification: "Material: Genuine leather, Dimensions: Various sizes, Features: Multiple compartments, detachable straps",
    reviews: "Customers appreciate the classic design and durability. A perfect investment piece for any wardrobe.",
    rating: 4.7,
    noOfRatings: 178,
    variants: [
      {
        color: "#FFFFFF",
        colorName: "White",
        size: ["S", "M", "L", "XL"],
        price: 6500.0,
        quantity: 15,
      },
      {
        color: "#D27B44",
        colorName: "Brown",
        size: ["S", "M", "L", "XL"],
        price: 6500.0,
        quantity: 12,
      }
    ]
  },
  {
    id: 14,
    orderId: 14,
    category: "On Sale",
    name: "Gucci Handbag",
    description: "Luxurious Gucci handbag featuring the iconic GG pattern and premium materials. A statement piece for any fashion-forward individual.",
    image: GucciHandbag,
    marketPrice: 18000.0,
    sellingPrice: 10000.0,
    otherImages: [ClassicHandbags, ZARAHandbags, LeisaraHandbag],
    detail: "Iconic GG pattern with premium materials",
    specification: "Material: Canvas and leather, Dimensions: Various sizes, Features: Adjustable strap, multiple compartments",
    reviews: "Customers love the luxury feel and iconic design. A perfect addition to any collection.",
    rating: 4.8,
    noOfRatings: 145,
    variants: [
      {
        color: "#000000",
        colorName: "Black",
        size: ["S", "M", "L", "XL"],
        price: 10000.0,
        quantity: 8,
      },
      {
        color: "#FFFFFF",
        colorName: "White",
        size: ["S", "M", "L", "XL"],
        price: 10000.0,
        quantity: 8,
      }
    ]
  },
  {
    id: 15,
    orderId: 15,
    category: "On Sale",
    name: "Microwave Oven",
    description: "Advanced microwave oven with multiple cooking functions and smart features. Perfect for modern kitchens.",
    image: Microwave,
    marketPrice: 20000.0,
    sellingPrice: 15000.0,
    otherImages: [NICHECoffeeMachine, Refrigerator, DELLLaptop],
    detail: "Advanced cooking functions with smart features",
    specification: "Capacity: 30L, Power: 1000W, Features: Multiple cooking modes, child lock, timer",
    reviews: "Customers appreciate the ease of use and multiple cooking functions. A perfect addition to any kitchen.",
    rating: 4.6,
    noOfRatings: 234,
    variants: [
      {
        color: "#FFFFFF",
        colorName: "White",
        size: ["Standard"],
        price: 15000.0,
        quantity: 15,
      },
      {
        color: "#000000",
        colorName: "Black",
        size: ["Standard"],
        price: 15000.0,
        quantity: 15,
      }
    ]
  },
  {
    id: 16,
    orderId: 16,
    category: "On Sale",
    name: "Leisara Handbag",
    description: "Elegant Leisara handbag collection featuring unique designs and premium materials. Perfect for fashion enthusiasts.",
    image: LeisaraHandbag,
    marketPrice: 5500.0,
    sellingPrice: 4500.0,
    otherImages: [ZARAHandbags, ClassicHandbags, GucciHandbag],
    detail: "Unique designs with premium materials",
    specification: "Material: Premium leather, Dimensions: Various sizes, Features: Multiple compartments, detachable straps",
    reviews: "Customers love the unique designs and quality. A perfect statement piece.",
    rating: 4.7,
    noOfRatings: 167,
    variants: [
      {
        color: "#FFFFFF",
        colorName: "White",
        size: ["S", "M", "L", "XL"],
        price: 4500.0,
        quantity: 12,
      },
      {
        color: "#6E7061",
        colorName: "Light Grey",
        size: ["S", "M", "L", "XL"],
        price: 4500.0,
        quantity: 10,
      }
    ]
  },
  {
    id: 17,
    orderId: 17,
    category: "On Sale",
    name: "Macbook Air",
    description: "Ultra-thin and lightweight Macbook Air with powerful performance and stunning display. Perfect for professionals and students.",
    image: MacbookAir,
    marketPrice: 250000.0,
    sellingPrice: 200000.0,
    otherImages: [Iphone16promax, DELLLaptop, NICHECoffeeMachine],
    detail: "Ultra-thin design with powerful performance",
    specification: "Display: 13.3-inch Retina, Processor: M2 chip, Storage: 256GB/512GB, Memory: 8GB/16GB",
    reviews: "Customers love the performance and portability. Perfect for work and entertainment.",
    rating: 4.9,
    noOfRatings: 345,
    variants: [
      {
        color: "#9B9B9B",
        colorName: "Silver",
        size: ["S", "M", "L", "XL"],
        price: 200000.0,
        quantity: 8,
      },
      {
        color: "#666666",
        colorName: "Grey",
        size: ["S", "M", "L", "XL"],
        price: 200000.0,
        quantity: 8,
      }
    ]
  },
  {
    id: 18,
    orderId: 18,
    category: "On Sale",
    name: "DELL Laptop",
    description: "Powerful DELL laptop with high-performance specifications and premium build quality. Perfect for work and gaming.",
    image: DELLLaptop,
    marketPrice: 150000.0,
    sellingPrice: 130000.0,
    otherImages: [MacbookAir, Iphone16promax, Refrigerator],
    detail: "High-performance specifications with premium build",
    specification: "Display: 15.6-inch FHD, Processor: Intel Core i7, Storage: 512GB SSD, Memory: 16GB RAM",
    reviews: "Customers appreciate the performance and build quality. Perfect for both work and entertainment.",
    rating: 4.8,
    noOfRatings: 278,
    variants: [
      {
        color: "#000000",
        colorName: "Black",
        size: ["S", "M", "L", "XL"],
        price: 130000.0,
        quantity: 10,
      },
      {
        color: "#9B9B9B",
        colorName: "Silver",
        size: ["S", "M", "L", "XL"],
        price: 130000.0,
        quantity: 10,
      }
    ]
  },
  {
    id: 19,
    orderId: 19,
    category: "On Sale",
    name: "NICHE Coffee Machine",
    description: "Premium coffee machine with advanced brewing technology and multiple coffee options. Perfect for coffee enthusiasts.",
    image: NICHECoffeeMachine,
    marketPrice: 35000.0,
    sellingPrice: 30000.0,
    otherImages: [Microwave, Refrigerator, MacbookAir],
    detail: "Advanced brewing technology with multiple options",
    specification: "Capacity: 1.8L, Power: 1500W, Features: Multiple brewing modes, timer, keep-warm function",
    reviews: "Customers love the coffee quality and ease of use. Perfect for home or office.",
    rating: 4.7,
    noOfRatings: 189,
    variants: [
      {
        color: "#FFFFFF",
        colorName: "White",
        size: ["S", "M", "L", "XL"],
        price: 30000.0,
        quantity: 12,
      },
      {
        color: "#000000",
        colorName: "Black",
        size: ["S", "M", "L", "XL"],
        price: 30000.0,
        quantity: 12,
      }
    ]
  },
  {
    id: 20,
    orderId: 20,
    category: "On Sale",
    name: "Refrigerator",
    description: "Modern refrigerator with advanced cooling technology and spacious storage. Perfect for any household.",
    image: Refrigerator,
    marketPrice: 45000.0,
    sellingPrice: 40000.0,
    otherImages: [Microwave, NICHECoffeeMachine, DELLLaptop],
    detail: "Advanced cooling technology with spacious storage",
    specification: "Capacity: 300L, Features: Frost-free, multiple compartments, energy efficient",
    reviews: "Customers appreciate the spacious storage and cooling performance. Perfect for any family.",
    rating: 4.6,
    noOfRatings: 234,
    variants: [
      {
        color: "#666666",
        colorName: "Grey",
        size: ["S", "M", "L", "XL"],
        price: 40000.0,
        quantity: 10,
      },
      {
        color: "#000000",
        colorName: "Black",
        size: ["S", "M", "L", "XL"],
        price: 40000.0,
        quantity: 10,
      }
    ]
  }
];

// Seasonal Offers Products
const seasonalOffersProducts = [
  {
    id: 21,
    orderId: 21,
    category: "Seasonal Offers",
    name: "Berry Delight",
    description: "A delightful combination of fresh berries and cream, perfect for any celebration.",
    image: BerryDelight,
    marketPrice: 7040.0,
    sellingPrice: 6040.0,
    otherImages: [BlueberrySponge, ChocolateDelight, StrawberryTreat],
    detail: "Fresh berries and cream combination",
    specification: "Ingredients: Fresh berries, cream, sugar, Size: 8-inch round",
    reviews: "Customers love the fresh taste and beautiful presentation.",
    rating: 4.8,
    noOfRatings: 156,
    variants: [
      {
        color: "#C50DA3",
        colorName: "Pink",
        size: ["S", "M", "L", "XL"],
        price: 6040.0,
        quantity: 20,
      },
      {
        color: "#EB001B",
        colorName: "Red",
        size: ["S", "M", "L", "XL"],
        price: 6040.0,
        quantity: 20,
      }
    ]
  },
  {
    id: 22,
    orderId: 22,
    category: "Seasonal Offers",
    name: "Blueberry Sponge",
    description: "Light and fluffy sponge cake with fresh blueberry filling and cream.",
    image: BlueberrySponge,
    marketPrice: 6860.0,
    sellingPrice: 5860.0,
    otherImages: [BerryDelight, ChocolateDelight, FloralTouchDelight],
    detail: "Light sponge with blueberry filling",
    specification: "Ingredients: Sponge cake, blueberries, cream, Size: 8-inch round",
    reviews: "Customers appreciate the light texture and fruity flavor.",
    rating: 4.7,
    noOfRatings: 189,
    variants: [
      {
        color: "#254AA5",
        colorName: "Blue",
        size: ["S", "M", "L", "XL"],
        price: 5860.0,
        quantity: 15,
      },
      {
        color: "#F59FDB",
        colorName: "Pink",
        size: ["S", "M", "L", "XL"],
        price: 5860.0,
        quantity: 15,
      }
    ]
  },
  {
    id: 23,
    orderId: 23,
    category: "Seasonal Offers",
    name: "Chocolate Delight",
    description: "Rich chocolate cake with layers of chocolate ganache and cream.",
    image: ChocolateDelight,
    marketPrice: 7070.0,
    sellingPrice: 6070.0,
    otherImages: [BerryDelight, FloralTouchDelight, FruitAndNuttyTreat],
    detail: "Rich chocolate cake with ganache",
    specification: "Ingredients: Chocolate cake, ganache, cream, Size: 8-inch round",
    reviews: "Customers love the rich chocolate flavor and smooth texture.",
    rating: 4.9,
    noOfRatings: 234,
    variants: [
      {
        color: "#4A230B",
        colorName: "Dark Brown",
        size: ["S", "M", "L", "XL"],
        price: 6070.0,
        quantity: 25,
      },
      {
        color: "#D27B44",
        colorName: "Brown",
        size: ["S", "M", "L", "XL"],
        price: 6070.0,
        quantity: 25,
      }
    ]
  },
  {
    id: 24,
    orderId: 24,
    category: "Seasonal Offers",
    name: "Cranberry Delight",
    description: "Moist cake with cranberry filling and cream cheese frosting.",
    image: CranberryDelight,
    marketPrice: 6970.0,
    sellingPrice: 5970.0,
    otherImages: [StrawberryTreat, BlueberrySponge, RoseVelvetCake],
    detail: "Cranberry cake with cream cheese frosting",
    specification: "Ingredients: Cake, cranberries, cream cheese, Size: 8-inch round",
    reviews: "Customers enjoy the tart cranberry flavor and creamy frosting.",
    rating: 4.6,
    noOfRatings: 167,
    variants: [
      {
        color: "#EB001B",
        colorName: "Red",
        size: ["S", "M", "L", "XL"],
        price: 5970.0,
        quantity: 18,
      },
      {
        color: "#F59FDB",
        colorName: "Pink",
        size: ["S", "M", "L", "XL"],
        price: 5970.0,
        quantity: 18,
      }
    ]
  },
  {
    id: 25,
    orderId: 25,
    category: "Seasonal Offers",
    name: "Floral Touch Delight",
    description: "Elegant cake decorated with edible flowers and light cream.",
    image: FloralTouchDelight,
    marketPrice: 7140.0,
    sellingPrice: 6140.0,
    otherImages: [WeddingCake, StrawberryTreat, RoseVelvetCake],
    detail: "Cake with edible flowers decoration",
    specification: "Ingredients: Cake, edible flowers, cream, Size: 8-inch round",
    reviews: "Customers love the beautiful floral decoration and delicate taste.",
    rating: 4.8,
    noOfRatings: 145,
    variants: [
      {
        color: "#F59FDB",
        colorName: "Pink",
        size: ["S", "M", "L", "XL"],
        price: 6140.0,
        quantity: 12,
      },
      {
        color: "#FEF3C7",
        colorName: "Beige",
        size: ["S", "M", "L", "XL"],
        price: 6140.0,
        quantity: 12,
      }
    ]
  },
  {
    id: 26,
    orderId: 26,
    category: "Seasonal Offers",
    name: "Fruit and Nutty Treat",
    description: "Rich fruit cake with mixed nuts and dried fruits.",
    image: FruitAndNuttyTreat,
    marketPrice: 7450.0,
    sellingPrice: 6450.0,
    otherImages: [ChocolateDelight, CranberryDelight, WonderChocolateTreat],
    detail: "Fruit cake with mixed nuts",
    specification: "Ingredients: Cake, mixed nuts, dried fruits, Size: 8-inch round",
    reviews: "Customers appreciate the combination of fruits and nuts.",
    rating: 4.7,
    noOfRatings: 178,
    variants: [
      {
        color: "#D27B44",
        colorName: "Brown",
        size: ["S", "M", "L", "XL"],
        price: 6450.0,
        quantity: 15,
      },
      {
        color: "#FF5F00",
        colorName: "Orange",
        size: ["S", "M", "L", "XL"],
        price: 6450.0,
        quantity: 15,
      }
    ]
  },
  {
    id: 27,
    orderId: 27,
    category: "Seasonal Offers",
    name: "Rose Velvet Cake",
    description: "Velvety smooth cake with rose flavor and cream cheese frosting.",
    image: RoseVelvetCake,
    marketPrice: 7990.0,
    sellingPrice: 6790.0,
    otherImages: [FruitAndNuttyTreat, FloralTouchDelight, WeddingCake],
    detail: "Rose flavored velvet cake",
    specification: "Ingredients: Velvet cake, rose flavor, cream cheese, Size: 8-inch round",
    reviews: "Customers love the unique rose flavor and velvety texture.",
    rating: 4.8,
    noOfRatings: 189,
    variants: [
      {
        color: "#F59FDB",
        colorName: "Pink",
        size: ["S", "M", "L", "XL"],
        price: 6790.0,
        quantity: 20,
      },
      {
        color: "#FEF3C7",
        colorName: "Beige",
        size: ["S", "M", "L", "XL"],
        price: 6790.0,
        quantity: 20,
      }
    ]
  },
  {
    id: 28,
    orderId: 28,
    category: "Seasonal Offers",
    name: "Strawberry Treat",
    description: "Fresh strawberry cake with whipped cream and strawberry filling.",
    image: StrawberryTreat,
    marketPrice: 7290.0,
    sellingPrice: 6290.0,
    otherImages: [BerryDelight, CranberryDelight, WonderChocolateTreat],
    detail: "Strawberry cake with whipped cream",
    specification: "Ingredients: Cake, strawberries, whipped cream, Size: 8-inch round",
    reviews: "Customers enjoy the fresh strawberry flavor and light texture.",
    rating: 4.7,
    noOfRatings: 167,
    variants: [
      {
        color: "#EB001B",
        colorName: "Red",
        size: ["S", "M", "L", "XL"],
        price: 6290.0,
        quantity: 18,
      },
      {
        color: "#F59FDB",
        colorName: "Pink",
        size: ["S", "M", "L", "XL"],
        price: 6290.0,
        quantity: 18,
      }
    ]
  },
  {
    id: 29,
    orderId: 29,
    category: "Seasonal Offers",
    name: "Wedding Cake",
    description: "Elegant multi-tiered cake perfect for special occasions.",
    image: WeddingCake,
    marketPrice: 7650.0,
    sellingPrice: 6650.0,
    otherImages: [FloralTouchDelight, RoseVelvetCake, WonderChocolateTreat],
    detail: "Multi-tiered wedding cake",
    specification: "Ingredients: Cake, fondant, decorations, Size: 3-tier",
    reviews: "Customers love the elegant design and delicious taste.",
    rating: 4.9,
    noOfRatings: 89,
    variants: [
      {
        color: "#FFFFFF",
        colorName: "White",
        size: ["S", "M", "L", "XL"],
        price: 6650.0,
        quantity: 5,
      },
      {
        color: "#F59FDB",
        colorName: "Pink",
        size: ["S", "M", "L", "XL"],
        price: 6650.0,
        quantity: 5,
      }
    ]
  },
  {
    id: 30,
    orderId: 30,
    category: "Seasonal Offers",
    name: "Wonder Chocolate Treat",
    description: "Decadent chocolate cake with multiple layers and chocolate decorations.",
    image: WonderChocolateTreat,
    marketPrice: 6460.0,
    sellingPrice: 5460.0,
    otherImages: [ChocolateDelight, BerryDelight, WeddingCake],
    detail: "Multi-layered chocolate cake",
    specification: "Ingredients: Chocolate cake, ganache, decorations, Size: 8-inch round",
    reviews: "Customers love the rich chocolate layers and beautiful decoration.",
    rating: 4.8,
    noOfRatings: 234,
    variants: [
      {
        color: "#4A230B",
        colorName: "Dark Brown",
        size: ["S", "M", "L", "XL"],
        price: 5000.0,
        quantity: 15,
      },
      {
        color: "#D27B44",
        colorName: "Brown",
        size: ["S", "M", "L", "XL"],
        price: 5000.0,
        quantity: 15,
      }
    ]
  }
];

// Rush Delivery Products
const rushDeliveryProducts = [
  {
    id: 31,
    orderId: 31,
    category: "Rush Delivery",
    name: "Gift Bundle",
    description: "A beautiful gift bundle perfect for any occasion",
    image: GiftBundle,
    marketPrice: 5000.0,
    sellingPrice: 4000.0,
    otherImages: [SweetDelight, MacaronsTreat, CupidsKissesBox],
    detail: "Premium gift bundle with carefully selected items",
    specification: "Weight: 1.5 kg\nDimensions: 30x20x15 cm",
    reviews: "Customers love this gift bundle for its quality and presentation",
    rating: 4.5,
    noOfRatings: 120,
    variants: [{
      color: "#EB001B",
      colorName: "Red",
      price: 4000.0,
      quantity: 10,
      size: ["S", "M", "L", "XL"]
    },
    {
      color: "#F59FDB",
      colorName: "Pink",
      price: 4000.0,
      quantity: 10,
      size: ["S", "M", "L", "XL"]
    }]
  },
  {
    id: 32,
    orderId: 32,
    category: "Rush Delivery",
    name: "Macarons Treat",
    description: "Delicious assortment of French macarons",
    image: MacaronsTreat,
    marketPrice: 4500.0,
    sellingPrice: 3500.0,
    otherImages: [RosyTreats, CupidsKissesBox, SweetDelight],
    detail: "Freshly made macarons in various flavors",
    specification: "Weight: 500 g\nContains: 12 pieces",
    reviews: "The macarons are always fresh and delicious",
    rating: 4.8,
    noOfRatings: 85,
    variants: [{
      color: "#F59FDB",
      colorName: "Pink",
      price: 3500.0,
      quantity: 15,
      size: ["S", "M", "L", "XL"]
    },
    {
      color: "#FEF3C7",
      colorName: "Beige",
      price: 3500.0,
      quantity: 15,
      size: ["S", "M", "L", "XL"]
    }]
  },
  {
    id: 33,
    orderId: 33,
    category: "Rush Delivery",
    name: "Rosy Treats",
    description: "A delightful assortment of rose-themed treats",
    image: RosyTreats,
    marketPrice: 6000.0,
    sellingPrice: 5000.0,
    otherImages: [SweetDelight, CupidsKissesBox, MacaronsTreat],
    detail: "Beautiful rose-themed treats perfect for special occasions",
    specification: "Weight: 500 g\nContains: 8 pieces",
    reviews: "The rose treats are beautifully presented and delicious",
    rating: 4.7,
    noOfRatings: 95,
    variants: [{
      color: "#F59FDB",
      colorName: "Pink",
      price: 5000.0,
      quantity: 12,
      size: ["S", "M", "L", "XL"]
    },
    {
      color: "#EB001B",
      colorName: "Red",
      price: 5000.0,
      quantity: 12,
      size: ["S", "M", "L", "XL"]
    }]
  },
  {
    id: 34,
    orderId: 34,
    category: "Rush Delivery",
    name: "Lovely Spring Bouquet",
    description: "A vibrant spring bouquet with fresh flowers",
    image: LovelySpringBouquet,
    marketPrice: 8500.0,
    sellingPrice: 7500.0,
    otherImages: [SummerMistBouquet, ChanelPerfume, SweetDelight],
    detail: "Fresh spring flowers arranged in a beautiful bouquet",
    specification: "Weight: 1.5 kg\nContains: 12 stems",
    reviews: "The spring bouquet is always fresh and beautiful",
    rating: 4.9,
    noOfRatings: 150,
    variants: [{
      color: "#F59FDB",
      colorName: "Light Pink",
      price: 7500.0,
      quantity: 8,
      size: ["S", "M", "L", "XL"]
    },
    {
      color: "#E61658",
      colorName: "Hot Pink",
      price: 7500.0,
      quantity: 8,
      size: ["S", "M", "L", "XL"]
    }]
  },
  {
    id: 35,
    orderId: 35,
    category: "Rush Delivery",
    name: "Sweet Delight",
    description: "A sweet treat perfect for any occasion",
    image: SweetDelight,
    marketPrice: 5800.0,
    sellingPrice: 4800.0,
    otherImages: [RosyTreats, MacaronsTreat, CupidsKissesBox],
    detail: "Delicious sweet treats in a beautiful package",
    specification: "Weight: 250 g\nContains: 6 pieces",
    reviews: "The sweet delight is always a hit with customers",
    rating: 4.6,
    noOfRatings: 110,
    variants: [{
      color: "#E61658",
      colorName: "Hot Pink",
      price: 4800.0,
      quantity: 15,
      size: ["S", "M", "L", "XL"]
    },
    {
      color: "#EB001B",
      colorName: "Red",
      price: 4800.0,
      quantity: 15,
      size: ["S", "M", "L", "XL"]
    }]
  },
  {
    id: 36,
    orderId: 36,
    category: "Rush Delivery",
    name: "Cartier Watch",
    description: "Luxurious Cartier watch for special occasions",
    image: CartierWatch,
    marketPrice: 55000.0,
    sellingPrice: 50000.0,
    otherImages: [ChanelPerfume, LovelySpringBouquet, RosyTreats],
    detail: "Authentic Cartier watch with warranty",
    specification: "Weight: 450 g\nMaterial: Stainless Steel",
    reviews: "The Cartier watch is authentic and beautiful",
    rating: 4.9,
    noOfRatings: 75,
    variants: [{
      color: "#000000",
      colorName: "Black",
      price: 50000.0,
      quantity: 5,
      size: ["S", "M", "L", "XL"]
    },
    {
      color: "#FEF3C7",
      colorName: "Beige",
      price: 50000.0,
      quantity: 5,
      size: ["S", "M", "L", "XL"]
    }]
  },
  {
    id: 37,
    orderId: 37,
    category: "Rush Delivery",
    name: "Chanel Perfume",
    description: "Elegant Chanel perfume for special moments",
    image: ChanelPerfume,
    marketPrice: 35000.0,
    sellingPrice: 30000.0,
    otherImages: [CartierWatch, RosyTreats, LoveInBloomBouquet],
    detail: "Authentic Chanel perfume in original packaging",
    specification: "Weight: 550 g\nVolume: 100ml",
    reviews: "The Chanel perfume is authentic and long-lasting",
    rating: 4.8,
    noOfRatings: 90,
    variants: [{
      color: "#000000",
      colorName: "Black",
      price: 30000.0,
      quantity: 8,
      size: ["S", "M", "L", "XL"]
    },
    {
      color: "#F59FDB",
      colorName: "Light Pink",
      price: 30000.0,
      quantity: 8,
      size: ["S", "M", "L", "XL"]
    }]
  },
  {
    id: 38,
    orderId: 38,
    category: "Rush Delivery",
    name: "Cupids Kisses Box",
    description: "Romantic box of treats for Valentine's Day",
    image: CupidsKissesBox,
    marketPrice: 6000.0,
    sellingPrice: 5000.0,
    otherImages: [MacaronsTreat, SweetDelight, RosyTreats],
    detail: "Romantic treats in a beautiful heart-shaped box",
    specification: "Weight: 500 g\nContains: 12 pieces",
    reviews: "The Cupid's kisses box is perfect for Valentine's Day",
    rating: 4.7,
    noOfRatings: 85,
    variants: [{
      color: "#E61658",
      colorName: "Hot Pink",
      price: 5000.0,
      quantity: 10,
      size: ["S", "M", "L", "XL"]
    },
    {
      color: "#EB001B",
      colorName: "Red",
      price: 5000.0,
      quantity: 10,
      size: ["S", "M", "L", "XL"]
    }]
  },
  {
    id: 39,
    orderId: 39,
    category: "Rush Delivery",
    name: "Reindeer Cup",
    description: "Festive reindeer-themed cup for the holidays",
    image: ReindeerCup,
    marketPrice: 4500.0,
    sellingPrice: 3500.0,
    otherImages: [LoveInBloomBouquet, ChanelPerfume, LovelySpringBouquet],
    detail: "Festive reindeer cup perfect for holiday drinks",
    specification: "Weight: 300 g\nMaterial: Ceramic",
    reviews: "The reindeer cup is cute and festive",
    rating: 4.6,
    noOfRatings: 70,
    variants: [{
      color: "#EB001B",
      colorName: "Red",
      price: 3500.0,
      quantity: 12,
      size: ["S", "M", "L", "XL"]
    },
    {
      color: "#FEF3C7",
      colorName: "Beige",
      price: 3500.0,
      quantity: 12,
      size: ["S", "M", "L", "XL"]
    }]
  },
  {
    id: 40,
    orderId: 40,
    category: "Rush Delivery",
    name: "Summer Mist Bouquet",
    description: "Refreshing summer bouquet with seasonal flowers",
    image: SummerMistBouquet,
    marketPrice: 8850.0,
    sellingPrice: 7850.0,
    otherImages: [RosyTreats, LovelySpringBouquet, ChanelPerfume],
    detail: "Fresh summer flowers in a beautiful arrangement",
    specification: "Weight: 1.5 kg\nContains: 15 stems",
    reviews: "The summer mist bouquet is always fresh and beautiful",
    rating: 4.8,
    noOfRatings: 100,
    variants: [{
      color: "#F59FDB",
      colorName: "Light Pink",
      price: 7850.0,
      quantity: 8,
      size: ["S", "M", "L", "XL"]
    },
    {
      color: "#E61658",
      colorName: "Hot Pink",
      price: 7850.0,
      quantity: 8,
      size: ["S", "M", "L", "XL"]
    }]
  }
];

// Combine all product arrays
const allProducts = [...ForYouProducts, ...onSaleProducts, ...seasonalOffersProducts, ...rushDeliveryProducts];

// Export the combined products array
export const products = allProducts;
export { ForYouProducts, onSaleProducts, seasonalOffersProducts, rushDeliveryProducts };
export default allProducts;


