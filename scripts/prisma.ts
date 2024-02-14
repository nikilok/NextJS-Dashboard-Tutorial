// const { PrismaClient } = require('@prisma/client');
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   // ... you will write your Prisma Client queries here
//   const allUsers = await prisma.user.findMany({
//     include: {
//       posts: true,
//       profile: true,
//     },
//   });
//   console.dir(allUsers, { depth: null });

//   // Insert a record into the db.
//   // await prisma.user.create({
//   //   data: {
//   //     name: 'Alice',
//   //     email: 'alice@prisma.io',
//   //     posts: {
//   //       create: { title: 'Hello World' },
//   //     },
//   //     profile: {
//   //       create: { bio: 'I like turtles' },
//   //     },
//   //   },
//   // });

//   // const allUsers = await prisma.user.findMany({
//   //   include: {
//   //     posts: true,
//   //     profile: true,
//   //   },
//   // });
//   // console.dir(allUsers, { depth: null });

//   // Update publish field
//   // const post = await prisma.post.update({
//   //   where: { id: 1 },
//   //   data: { published: true },
//   // });
//   // console.log(post);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
