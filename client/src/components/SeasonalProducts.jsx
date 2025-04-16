import RoseVelvetCake from "../assets/RamadanOffers/RoseVelvetCake.jpg";
import ChocolateDelight from "../assets/RamadanOffers/ChocolateDelight.jpg";
import BerryDelight from "../assets/RamadanOffers/BerryDelight.jpg";
import CranberryDelight from "../assets/RamadanOffers/CranberryDelight.jpg";
import WonderChocolateTreat from "../assets/RamadanOffers/WonderChocolateTreat.jpg";
import WeddingCake from "../assets/RamadanOffers/WeddingCake.jpg";
import StrawberryTreat from "../assets/RamadanOffers/StrawberryTreat.jpg";
import FloralTouchDelight from "../assets/RamadanOffers/FloralTouchDelight.jpg";
import BlueberrySponge from "../assets/RamadanOffers/BlueberrySponge.jpg";
import FruitAndNuttyTreat from "../assets/RamadanOffers/FruitAndNuttyTreat.jpg";

export const seasonalProducts = [
  {
    id: 101,
    category: "Seasonal Offers",
    name: "Rose Velvet Cake",
    description: "A luxurious rose-flavored velvet cake with delicate cream frosting and edible rose petals.",
    image: RoseVelvetCake,
    marketPrice: 7990.0,
    sellingPrice: 6790.0,
    otherImages: [ChocolateDelight, BerryDelight, WonderChocolateTreat],
    detail: "A luxurious rose-flavored velvet cake with delicate cream frosting",
    specification: "Weight: 3.1 Lbs, Flavor: Rose Velvet, Ingredients: Premium flour, rose essence, fresh cream, edible rose petals",
    reviews: "Customers love the delicate rose flavor and the beautiful presentation of this cake.",
    rating: 4.8,
    noOfRatings: 156,
    variants: [
      {
        color: "#E11D48",
        colorName: "Rose",
        size: "3.1 Lbs",
        price: 6790.0,
        quantity: 20
      }
    ]
  },
  {
    id: 102,
    category: "Seasonal Offers",
    name: "Chocolate Delight",
    description: "Rich chocolate cake layered with chocolate ganache and topped with chocolate shavings.",
    image: ChocolateDelight,
    marketPrice: 7070.0,
    sellingPrice: 6070.0,
    otherImages: [RoseVelvetCake, BerryDelight, WeddingCake],
    detail: "Rich chocolate cake layered with chocolate ganache",
    specification: "Weight: 1.98 Lbs, Flavor: Chocolate, Ingredients: Premium cocoa, Belgian chocolate, fresh cream",
    reviews: "Chocolate lovers rave about the rich, decadent taste of this cake.",
    rating: 4.9,
    noOfRatings: 203,
    variants: [
      {
        color: "#78350F",
        colorName: "Chocolate",
        size: "1.98 Lbs",
        price: 6070.0,
        quantity: 25
      }
    ]
  },
  {
    id: 103,
    category: "Seasonal Offers",
    name: "Berry Delight",
    description: "Fresh berry cake with layers of mixed berries and light cream frosting.",
    image: BerryDelight,
    marketPrice: 7040.0,
    sellingPrice: 6040.0,
    otherImages: [RoseVelvetCake, ChocolateDelight, StrawberryTreat],
    detail: "Fresh berry cake with layers of mixed berries",
    specification: "Weight: 2.2 Lbs, Flavor: Mixed Berries, Ingredients: Fresh berries, premium flour, light cream",
    reviews: "Customers love the fresh berry flavor and the perfect balance of sweetness.",
    rating: 4.7,
    noOfRatings: 178,
    variants: [
      {
        color: "#BE185D",
        colorName: "Berry",
        size: "2.2 Lbs",
        price: 6040.0,
        quantity: 15
      }
    ]
  },
  {
    id: 104,
    category: "Seasonal Offers",
    name: "Wonder Chocolate Treat",
    description: "Decadent chocolate cake with layers of chocolate mousse and chocolate ganache.",
    image: WonderChocolateTreat,
    marketPrice: 6460.0,
    sellingPrice: 5460.0,
    otherImages: [ChocolateDelight, BerryDelight, WeddingCake],
    detail: "Decadent chocolate cake with layers of chocolate mousse",
    specification: "Weight: 2.33 Lbs, Flavor: Chocolate, Ingredients: Premium cocoa, chocolate mousse, ganache",
    reviews: "A perfect treat for chocolate lovers with its rich and creamy texture.",
    rating: 4.8,
    noOfRatings: 145,
    variants: [
      {
        color: "#78350F",
        colorName: "Chocolate",
        size: "2.33 Lbs",
        price: 5460.0,
        quantity: 20
      }
    ]
  },
  {
    id: 105,
    category: "Seasonal Offers",
    name: "Wedding Cake",
    description: "Elegant vanilla cake with buttercream frosting and delicate floral decorations.",
    image: WeddingCake,
    marketPrice: 7650.0,
    sellingPrice: 6650.0,
    otherImages: [RoseVelvetCake, FloralTouchDelight, FruitAndNuttyTreat],
    detail: "Elegant vanilla cake with buttercream frosting",
    specification: "Weight: 1.88 Lbs, Flavor: Vanilla, Ingredients: Premium flour, vanilla extract, buttercream",
    reviews: "Perfect for special occasions with its elegant design and delicious taste.",
    rating: 4.9,
    noOfRatings: 167,
    variants: [
      {
        color: "#FEF3C7",
        colorName: "White",
        size: "1.88 Lbs",
        price: 6650.0,
        quantity: 10
      }
    ]
  },
  {
    id: 106,
    category: "Seasonal Offers",
    name: "Strawberry Treat",
    description: "Fresh strawberry cake with layers of strawberry cream and fresh strawberries.",
    image: StrawberryTreat,
    marketPrice: 7290.0,
    sellingPrice: 6290.0,
    otherImages: [BerryDelight, RoseVelvetCake, BlueberrySponge],
    detail: "Fresh strawberry cake with layers of strawberry cream",
    specification: "Weight: 2.1 Lbs, Flavor: Strawberry, Ingredients: Fresh strawberries, strawberry cream, premium flour",
    reviews: "Customers love the fresh strawberry flavor and the light, creamy texture.",
    rating: 4.7,
    noOfRatings: 189,
    variants: [
      {
        color: "#E11D48",
        colorName: "Strawberry",
        size: "2.1 Lbs",
        price: 6290.0,
        quantity: 15
      }
    ]
  },
  {
    id: 107,
    category: "Seasonal Offers",
    name: "Cranberry Delight",
    description: "Moist cranberry cake with cream cheese frosting and cranberry compote.",
    image: CranberryDelight,
    marketPrice: 6970.0,
    sellingPrice: 5970.0,
    otherImages: [BerryDelight, FruitAndNuttyTreat, WonderChocolateTreat],
    detail: "Moist cranberry cake with cream cheese frosting",
    specification: "Weight: 2.3 Lbs, Flavor: Cranberry, Ingredients: Fresh cranberries, cream cheese, premium flour",
    reviews: "Perfect balance of tart and sweet with a moist, flavorful texture.",
    rating: 4.6,
    noOfRatings: 134,
    variants: [
      {
        color: "#BE185D",
        colorName: "Cranberry",
        size: "2.3 Lbs",
        price: 5970.0,
        quantity: 20
      }
    ]
  },
  {
    id: 108,
    category: "Seasonal Offers",
    name: "Floral Touch Delight",
    description: "Elegant cake with floral decorations and light vanilla cream frosting.",
    image: FloralTouchDelight,
    marketPrice: 7140.0,
    sellingPrice: 6140.0,
    otherImages: [WeddingCake, RoseVelvetCake, BerryDelight],
    detail: "Elegant cake with floral decorations",
    specification: "Weight: 2.5 Lbs, Flavor: Vanilla, Ingredients: Premium flour, vanilla extract, edible flowers",
    reviews: "Beautiful presentation and delicate flavor make this cake perfect for special occasions.",
    rating: 4.8,
    noOfRatings: 156,
    variants: [
      {
        color: "#FEF3C7",
        colorName: "White",
        size: "2.5 Lbs",
        price: 6140.0,
        quantity: 15
      }
    ]
  },
  {
    id: 109,
    category: "Seasonal Offers",
    name: "Blueberry Sponge",
    description: "Light sponge cake with fresh blueberries and whipped cream.",
    image: BlueberrySponge,
    marketPrice: 6860.0,
    sellingPrice: 5860.0,
    otherImages: [BerryDelight, StrawberryTreat, FruitAndNuttyTreat],
    detail: "Light sponge cake with fresh blueberries",
    specification: "Weight: 2.1 Lbs, Flavor: Blueberry, Ingredients: Fresh blueberries, sponge cake, whipped cream",
    reviews: "Light and fluffy texture with bursts of fresh blueberry flavor.",
    rating: 4.7,
    noOfRatings: 145,
    variants: [
      {
        color: "#1E40AF",
        colorName: "Blueberry",
        size: "2.1 Lbs",
        price: 5860.0,
        quantity: 20
      }
    ]
  },
  {
    id: 110,
    category: "Seasonal Offers",
    name: "Fruit & Nutty Treat",
    description: "Rich fruit cake with mixed nuts and dried fruits, perfect for celebrations.",
    image: FruitAndNuttyTreat,
    marketPrice: 7450.0,
    sellingPrice: 6450.0,
    otherImages: [CranberryDelight, WonderChocolateTreat, WeddingCake],
    detail: "Rich fruit cake with mixed nuts and dried fruits",
    specification: "Weight: 2.4 Lbs, Flavor: Mixed Fruit & Nut, Ingredients: Mixed nuts, dried fruits, premium flour",
    reviews: "Perfect combination of fruits and nuts with a rich, moist texture.",
    rating: 4.8,
    noOfRatings: 167,
    variants: [
      {
        color: "#78350F",
        colorName: "Brown",
        size: "2.4 Lbs",
        price: 6450.0,
        quantity: 15
      }
    ]
  }
]; 