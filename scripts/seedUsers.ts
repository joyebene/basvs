// scripts/seedUsers.ts

import User from "../models/User";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { connectDB } from "../lib/mongodb";

const seedUsers = async () => {
  dotenv.config();
  await connectDB();

  const users = Array.from({ length: 20 }).map(() => ({ 
    name: faker.person.fullName(),
    matricNumber: faker.string.numeric(8),
    email: faker.internet.email(),
    password: "87654321",
    role: "student",
  }));

  await User.insertMany(users);
  console.log("Seeded 20 users successfully!");
  process.exit(0);
};

seedUsers();