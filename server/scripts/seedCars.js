import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Car from "../models/Car.js";

const u = (id) => `https://images.unsplash.com/photo-${id}?w=1280&q=80&auto=format&fit=crop`;

// Six curated photo sets (front/side/rear/interior/dashboard), cycled across the 24 listings.
const PHOTO_SETS = [
  // Luxury sedan
  [
    u("1617531653332-bd46c24f2068"),
    u("1503376780353-7e6692767b70"),
    u("1549317661-bd32c8ce0db2"),
    u("1552519507-da3b142c6e3d"),
    u("1511919884226-fd3cad34687c"),
  ],
  // SUV
  [
    u("1606664515524-ed2f786a0bd6"),
    u("1533473359331-0135ef1b58bf"),
    u("1605559424843-9e4c228bf1c2"),
    u("1606220838315-056192d5e927"),
    u("1580273916550-e323be2ae537"),
  ],
  // Sports / coupe
  [
    u("1555215695-3004980ad54e"),
    u("1583121274602-3e2820c69888"),
    u("1544636331-e26879cd4d9b"),
    u("1552519507-da3b142c6e3d"),
    u("1494976388531-d1058494cdd8"),
  ],
  // White / family
  [
    u("1549399542-7e3f8b79c341"),
    u("1494976388531-d1058494cdd8"),
    u("1605515298946-d0573716b55b"),
    u("1606664515524-ed2f786a0bd6"),
    u("1511919884226-fd3cad34687c"),
  ],
  // Compact (rebuilt with verified URLs)
  [
    u("1494976388531-d1058494cdd8"),
    u("1503376780353-7e6692767b70"),
    u("1583121274602-3e2820c69888"),
    u("1555215695-3004980ad54e"),
    u("1606664515524-ed2f786a0bd6"),
  ],
  // Premium
  [
    u("1503376780353-7e6692767b70"),
    u("1552519507-da3b142c6e3d"),
    u("1617531653332-bd46c24f2068"),
    u("1544636331-e26879cd4d9b"),
    u("1555215695-3004980ad54e"),
  ],
];

// 24 listings: four cars per country, one per city.
const LISTINGS = [
  // Nigeria
  { country: "Nigeria", location: "Abuja", brand: "Toyota", model: "Camry", year: 2022, category: "Sedan", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 85 },
  { country: "Nigeria", location: "Lagos", brand: "Lexus", model: "RX", year: 2021, category: "SUV", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 130 },
  { country: "Nigeria", location: "Benin City", brand: "Honda", model: "Accord", year: 2020, category: "Sedan", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 70 },
  { country: "Nigeria", location: "Port Harcourt", brand: "Toyota", model: "Prado", year: 2022, category: "SUV", transmission: "Automatic", fuel_type: "Diesel", seating_capacity: 7, pricePerDay: 150 },
  // Ghana
  { country: "Ghana", location: "Accra", brand: "Mercedes-Benz", model: "C-Class", year: 2021, category: "Sedan", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 120 },
  { country: "Ghana", location: "Kumasi", brand: "Toyota", model: "RAV4", year: 2020, category: "SUV", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 95 },
  { country: "Ghana", location: "Takoradi", brand: "Hyundai", model: "Elantra", year: 2022, category: "Sedan", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 65 },
  { country: "Ghana", location: "Tamale", brand: "Ford", model: "Explorer", year: 2021, category: "SUV", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 7, pricePerDay: 110 },
  // Kenya
  { country: "Kenya", location: "Nairobi", brand: "BMW", model: "5 Series", year: 2022, category: "Sedan", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 140 },
  { country: "Kenya", location: "Mombasa", brand: "Toyota", model: "Land Cruiser", year: 2021, category: "SUV", transmission: "Automatic", fuel_type: "Diesel", seating_capacity: 7, pricePerDay: 170 },
  { country: "Kenya", location: "Kisumu", brand: "Nissan", model: "Rogue", year: 2020, category: "SUV", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 80 },
  { country: "Kenya", location: "Nakuru", brand: "Mazda", model: "CX-5", year: 2021, category: "SUV", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 90 },
  // South Africa
  { country: "South Africa", location: "Johannesburg", brand: "Range Rover", model: "Sport", year: 2022, category: "SUV", transmission: "Automatic", fuel_type: "Diesel", seating_capacity: 5, pricePerDay: 200 },
  { country: "South Africa", location: "Cape Town", brand: "Mercedes-Benz", model: "E-Class", year: 2021, category: "Sedan", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 160 },
  { country: "South Africa", location: "Durban", brand: "BMW", model: "X5", year: 2022, category: "SUV", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 180 },
  { country: "South Africa", location: "Pretoria", brand: "Volkswagen", model: "Tiguan", year: 2020, category: "SUV", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 85 },
  // Egypt
  { country: "Egypt", location: "Cairo", brand: "Hyundai", model: "Tucson", year: 2022, category: "SUV", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 75 },
  { country: "Egypt", location: "Alexandria", brand: "Kia", model: "Sportage", year: 2021, category: "SUV", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 70 },
  { country: "Egypt", location: "Giza", brand: "Toyota", model: "Corolla", year: 2022, category: "Sedan", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 55 },
  { country: "Egypt", location: "Sharm El Sheikh", brand: "Jeep", model: "Wrangler", year: 2021, category: "SUV", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 4, pricePerDay: 120 },
  // Morocco
  { country: "Morocco", location: "Casablanca", brand: "Peugeot", model: "3008", year: 2022, category: "SUV", transmission: "Automatic", fuel_type: "Diesel", seating_capacity: 5, pricePerDay: 85 },
  { country: "Morocco", location: "Marrakech", brand: "Volkswagen", model: "Golf", year: 2020, category: "Hatchback", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 60 },
  { country: "Morocco", location: "Rabat", brand: "Mercedes-Benz", model: "GLC", year: 2022, category: "SUV", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 140 },
  { country: "Morocco", location: "Fez", brand: "Kia", model: "Rio", year: 2021, category: "Hatchback", transmission: "Automatic", fuel_type: "petrol", seating_capacity: 5, pricePerDay: 45 },
];

const descriptionFor = (car) =>
  `${car.year} ${car.brand} ${car.model} in excellent condition, available in ${car.location}, ${car.country}. ` +
  `Well-maintained, full service history, comfortable ${car.seating_capacity}-seater ${car.category.toLowerCase()} ideal for city driving and longer trips.`;

async function run() {
  const email = process.argv[2];
  const fresh = process.argv.includes("--fresh");
  if (!email) {
    console.error("Usage: node scripts/seedCars.js <user-email> [--fresh]");
    process.exit(1);
  }

  await mongoose.connect(`${process.env.MONGODB_URI}/Drivio`);
  console.log("Connected to Mongo");

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No user with email ${email}. Sign up first, then re-run.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  if (user.role !== "owner") {
    user.role = "owner";
    await user.save();
    console.log(`Upgraded ${email} to owner`);
  }

  if (fresh) {
    const { deletedCount } = await Car.deleteMany({ owner: user._id });
    console.log(`Removed ${deletedCount} existing cars owned by ${email}`);
  }

  const docs = LISTINGS.map((listing, i) => {
    const set = PHOTO_SETS[i % PHOTO_SETS.length];
    return {
      owner: user._id,
      brand: listing.brand,
      model: listing.model,
      image: set[0],
      gallery: set.slice(1),
      year: listing.year,
      category: listing.category,
      seating_capacity: listing.seating_capacity,
      fuel_type: listing.fuel_type,
      transmission: listing.transmission,
      pricePerDay: listing.pricePerDay,
      country: listing.country,
      location: listing.location,
      description: descriptionFor(listing),
      isAvailable: true,
      isApproved: true,
      approvedAt: new Date(),
    };
  });

  const result = await Car.insertMany(docs);
  console.log(`Seeded ${result.length} cars for ${email}`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
