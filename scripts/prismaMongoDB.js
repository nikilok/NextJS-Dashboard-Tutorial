const { PrismaClient } = require('@prisma/client');
// import { PrismaClient } from '@prisma/client';
const { fakerDE: faker } = require('@faker-js/faker');
const fs = require('fs');
const folderPath = './public/customers';

const randomFileNames = getFiles(folderPath);
console.log({ randomFileNames });

function getFiles(folderPath) {
  try {
    return fs.readdirSync(folderPath);
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

function getRandomString(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const prisma = new PrismaClient();

// interface Invoices {
//   imageUrl: string;
//   name: string;
//   email?: string;
//   status: string;
//   amount: number;
//   date: Date;
// }

function createRandomInvoice() {
  return {
    imageUrl: getRandomString(randomFileNames),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    status: getRandomString(['pending', 'paid']),
    date: faker.date.past(),
    amount: faker.number.int(),
  };
}

const Invoices = faker.helpers.multiple(
  createRandomInvoice,
  {
    count: 200,
  },
);

console.log({ Invoices });

async function main() {
  // ... you will write your Prisma Client queries here
  // Create
  //   await prisma.user.create({
  //     data: {
  //       name: 'Michael',
  //       email: 'michael@prisma.com',
  //       photo: 'michael-novotny',
  //       //   posts: {
  //       //     create: {
  //       //       title: 'My first post',
  //       //       body: 'Lots of really interesting stuff',
  //       //       slug: 'my-first-post',
  //       //     },
  //       //   },
  //     },
  //   });
  //   await prisma.revenue.createMany({
  //     data: [
  //       {
  //         month: 'Jul',
  //         revenue: 4200,
  //       },
  //       {
  //         month: 'Aug',
  //         revenue: 200,
  //       },
  //     ],
  //   });
  // Insert records into invoices
  // await prisma.invoices.createMany({
  //   data: Invoices
  // });
  // await prisma.invoices.createMany({
  //   data: [
  //     {
  //       imageUrl: 'steph-dietz.png',
  //       name: 'steph dietz',
  //       email: 's.dietz@abc.com',
  //       status: 'pending',
  //       amount: 500000,
  //       date: new Date(),
  //     },
  //     {
  //       imageUrl: 'amy-burns.png',
  //       name: 'amy burns',
  //       email: 'a.burns@abc.com',
  //       status: 'paid',
  //       amount: 100000,
  //       date: new Date(),
  //     },
  //     {
  //       imageUrl: 'emil-kowalski.png',
  //       name: 'emil kowalski',
  //       email: 'e.kowalski@abc.com',
  //       status: 'pending',
  //       amount: 1200000,
  //       date: new Date(),
  //     },
  //   ],
  // });
  //   await prisma.user.create({
  //     data: {
  //       name: 'Snave',
  //       photo: 'delba-de-oliveira.png',
  //       email: 'oliveria@prisma.com',
  //       posts: {
  //         create: {
  //           title: 'When Olivera went dancing',
  //           body: 'The hip hop dance moves of Oliveria',
  //           slug: 'oliveria-goes-dancing',
  //           comments: {
  //             createMany: {
  //               data: [
  //                 { comment: 'This is a test comment for the post' },
  //                 { comment: 'This is a second comment for the post' },
  //               ],
  //             },
  //           },
  //         },
  //       },
  //       address: {
  //         street: '12 Chestnut',
  //         city: 'London',
  //         state: 'Walt',
  //         zip: 'E17 513',
  //       },
  //     },
  //   });
  // update user photo
  //   await prisma.user.update({
  //     where: {
  //       id: '65981ed0d1954b6187331eb4',
  //     },
  //     data: {
  //       photo: 'guillermo-rauch.png',
  //     },
  //   });
  // Update
  //   await prisma.post.update({
  //     where: {
  //       slug: 'the-lorem-ipsum-post',
  //     },
  //     data: {
  //       comments: {
  //         createMany: {
  //           data: [
  //             { comment: 'There are some interesting lorems in this blog' },
  //             { comment: 'And the ipsums are great too.' },
  //             { comment: 'Good lorem ipsum post !!' },
  //           ],
  //         },
  //       },
  //     },
  //   });
  // Add a post for user nikil
  // _id 6597f20ae22fdaa6440b1422
  //   const createPostForNikil = await prisma.post.create({
  //     data: {
  //       body: 'This is a lorem ipsum post, with some loremipsum data',
  //       slug: 'the-lorem-ipsum-post',
  //       title: 'The loremipsum title',
  //       authorId: '6597f20ae22fdaa6440b1422',
  //     },
  //   });
  //   console.dir(createPostForNikil, { depth: Infinity });
  // Query
  // const allUsers = await prisma.user.findUnique({
  //   where: {
  //     email: 'nikil@prisma.com',
  //   },
  //   select: {
  //     name: true,
  //     email: true,
  //     photo: true,
  //     address: {
  //       select: {
  //         street: true,
  //         city: true,
  //       },
  //     },
  //     posts: {
  //       select: {
  //         slug: true,
  //         title: true,
  //         body: true,
  //         comments: {
  //           select: {
  //             comment: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  //   console.dir(allUsers, { depth: Infinity });
  //   const allRevenues = await prisma.revenue.findMany({
  //     select: {
  //       month: true,
  //       revenue: true,
  //     },
  //   });
  //   console.dir(allRevenues, { depth: Infinity });
  //   const allUsers = await prisma.user.findMany({
  //     select: {
  //       //   _count: {
  //       //     select: {
  //       //       posts: true,
  //       //     },
  //       //   },
  //       name: true,
  //       email: true,
  //       photo: true,
  //       posts: {
  //         select: {
  //           comments: {
  //             select: {
  //               comment: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   console.dir(allUsers, { depth: Infinity });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
