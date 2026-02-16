// scripts/seedUsers.ts

import User from "../models/User";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { connectDB } from "../lib/mongodb";

const seedUsers = async () => {
  dotenv.config();
  await connectDB();

  const generateMatricNumber = () => {
  const uni = "SAZUG";                // University code
  const level = "UG";                  // Level (UG/PG)
  const faculty = "SCI";               // Faculty
  const dept = "CSC";                  // Department
  const randomNumber = faker.number.int({ min: 1000, max: 9999 }); // 4-digit number

  return `${uni}/${level}/${faculty}/${dept}/${randomNumber}`;
};

  const users = Array.from({ length: 20 }).map(() => ({ 
    name: faker.person.fullName(),
    matricNumber: generateMatricNumber(),
    email: faker.internet.email(),
    password: "87654321",
    role: "student",
  }));

  await User.insertMany(users);
  console.log("Seeded 20 users successfully!");
  process.exit(0);
};

seedUsers();