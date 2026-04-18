require("dotenv").config();
const connectDB = require("../src/config/db");
const Product = require("../src/models/Product");

const sampleProducts = [
  {
    name: "Margherita Pizza",
    description: "Classic mozzarella and basil with fresh tomato sauce.",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1000&q=80",
    category: "Pizza",
    estimatedPrepTimeMins: 18,
  },
  {
    name: "Farmhouse Pizza",
    description: "Loaded with onion, capsicum, mushroom, and sweet corn.",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
    category: "Pizza",
    estimatedPrepTimeMins: 20,
  },
  {
    name: "Smoky Chicken Burger",
    description: "Grilled chicken patty with smoky mayo and lettuce.",
    price: 229,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
    category: "Burgers",
    estimatedPrepTimeMins: 14,
  },
  {
    name: "Crispy Veg Burger",
    description: "Crunchy veg patty with cheese and spicy house sauce.",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80",
    category: "Burgers",
    estimatedPrepTimeMins: 12,
  },
  {
    name: "Cold Coffee",
    description: "Creamy chilled coffee topped with cocoa dust.",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=80",
    category: "Drinks",
    estimatedPrepTimeMins: 6,
  },
  {
    name: "Fresh Lime Soda",
    description: "Refreshing lime soda with mint and crushed ice.",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1000&q=80",
    category: "Drinks",
    estimatedPrepTimeMins: 4,
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm gooey center served with vanilla drizzle.",
    price: 179,
    image:
      "https://images.unsplash.com/photo-1617305855058-336d24456869?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    estimatedPrepTimeMins: 10,
  },
  {
    name: "Pepperoni Feast",
    description: "Loaded pepperoni, extra mozzarella, and herbed tomato base.",
    price: 429,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1000&q=80",
    category: "Pizza",
    estimatedPrepTimeMins: 22,
  },
  {
    name: "BBQ Chicken Ranch",
    description: "Smoky BBQ chicken, red onion, ranch drizzle, and cilantro.",
    price: 449,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
    category: "Pizza",
    estimatedPrepTimeMins: 21,
  },
  {
    name: "Truffle Mushroom",
    description: "Creamy white sauce, roasted mushrooms, parmesan, and truffle oil.",
    price: 479,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=80",
    category: "Pizza",
    estimatedPrepTimeMins: 19,
  },
  {
    name: "Double Cheese Melt",
    description: "Two beef patties, cheddar, caramelized onion, and brioche bun.",
    price: 319,
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80",
    category: "Burgers",
    estimatedPrepTimeMins: 16,
  },
  {
    name: "Spicy Paneer Tikka Burger",
    description: "Charred paneer tikka, mint chutney, pickled onion, and slaw.",
    price: 219,
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=1000&q=80",
    category: "Burgers",
    estimatedPrepTimeMins: 13,
  },
  {
    name: "Classic Milkshake",
    description: "Vanilla bean ice cream, whole milk, whipped cream, and cherry.",
    price: 169,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc929?auto=format&fit=crop&w=1000&q=80",
    category: "Drinks",
    estimatedPrepTimeMins: 5,
  },
  {
    name: "Mango Lassi",
    description: "Alphonso mango, yogurt, cardamom, and a hint of rose.",
    price: 139,
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1000&q=80",
    category: "Drinks",
    estimatedPrepTimeMins: 4,
  },
  {
    name: "Masala Chai",
    description: "Slow-steeped Assam tea with ginger, cloves, and steamed milk.",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1000&q=80",
    category: "Drinks",
    estimatedPrepTimeMins: 7,
  },
  {
    name: "Tiramisu Slice",
    description: "Espresso-soaked ladyfingers, mascarpone, and cocoa dust.",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    estimatedPrepTimeMins: 5,
  },
  {
    name: "Berry Parfait",
    description: "Greek yogurt, seasonal berries, honey granola, and mint.",
    price: 159,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    estimatedPrepTimeMins: 6,
  },
  {
    name: "Gulab Jamun Cheesecake",
    description: "Baked cheesecake with saffron syrup swirl and crushed pistachio.",
    price: 229,
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    estimatedPrepTimeMins: 8,
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log("Sample products seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed products:", error);
    process.exit(1);
  }
};

seed();
