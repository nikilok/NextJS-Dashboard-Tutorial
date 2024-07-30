import { sql } from "@vercel/postgres";
import type {
	CustomerField,
	CustomersTableType,
	InvoiceForm,
	InvoicesTable,
	LatestInvoiceRaw,
	User,
	Revenue,
	FullUser,
} from "./definitions";
import { formatCurrency, sortRevenueByMonth } from "./utils";
import { PrismaClient } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

const prisma = new PrismaClient();

export async function fetchPrismaRevenue() {
	noStore();

	const today = new Date();
	const twelveMonthsAgo = new Date(today);
	twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
	try {
		const invoices = await prisma.invoices.findMany({
			where: {
				AND: [
					{
						date: {
							gte: twelveMonthsAgo, // Greater than or equal to 12 months ago
							lte: today, // Less than or equal to today
						},
					},
					{
						status: "paid",
					},
				],
			},
		});

		const invoicesByMonth = invoices.reduce((result, { date, amount }) => {
			const month = date.toLocaleString("default", { month: "long" });
			//@ts-ignore
			result[month] = (result[month] || 0) + amount;
			return result;
		}, {});

		const revenueByMonth = Object.entries(invoicesByMonth).map(
			([month, revenue]) => ({
				month,
				revenue: Number(revenue),
			}),
		);

		const sortedRevenue = sortRevenueByMonth(revenueByMonth);
		return sortedRevenue;
	} catch (error) {
		console.error("Database error:", error);
		throw new Error("Failed to fetch revenue by month data");
	}
}

// export async function fetchInvoicesDataOld() {
//   noStore();

//   try {
//     const data = await prisma.user.findMany({
//       select: {
//         name: true,
//         email: true,
//         photo: true,
//         posts: {
//           select: {
//             // slug: true,
//             // title: true,
//             // body: true,
//             comments: {
//               select: {
//                 comment: true,
//               },
//             },
//           },
//         },
//         _count: {
//           select: {
//             posts: true,
//           },
//         },
//       },
//       skip: 0,
//       take: 5,
//     });

//     // console.dir(
//     //   { data, date: new Date().toLocaleString() },
//     //   { depth: Infinity },
//     // );

//     const sortedData = data
//       .map((row, id) => ({
//         id: id.toString(),
//         name: row.name,
//         image_url: row.photo,
//         email: row.email,
//         amount: row.posts.reduce(
//           (acc, current) => acc + current.comments.length,
//           0,
//         ),
//       }))
//       .sort((a, b) => (a.amount > b.amount ? -1 : 1));

//     console.dir({ sortedData, date: new Date() }, { depth: Infinity });
//     console.log('*******');
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return sortedData;
//   } catch (error) {
//     console.error('Database error:', error);
//     throw new Error('Failed to fetch invoice data');
//   }
// }

export async function fetchInvoicesData() {
	noStore();

	try {
		const data = await prisma.invoices.findMany({
			select: {
				id: true,
				amount: true,
				customer: {
					select: {
						name: true,
						photo: true,
						email: true,
					},
				},
			},
			where: {
				status: "pending",
			},
			orderBy: {
				date: "desc",
			},
			skip: 0,
			take: 5,
		});

		// console.dir(
		//   { data, date: new Date().toLocaleString() },
		//   { depth: Infinity },
		// );

		const sortedData = data.map((row, id) => ({
			id: id.toString(),
			name: row.customer.name,
			image_url: row.customer.photo,
			email: row.customer.email,
			amount: row.amount,
		}));

		console.dir(
			{ sortedData, date: new Date() },
			{ depth: Number.POSITIVE_INFINITY },
		);
		console.log("*******");
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return sortedData;
	} catch (error) {
		console.error("Database error:", error);
		throw new Error("Failed to fetch invoice data");
	}
}

export async function invoiceCollected() {
	try {
		const data = await prisma.invoices.count({
			where: {
				status: "paid",
			},
		});

		return data;
	} catch (err) {
		return { message: "Database error: failed to get invoice collected" };
	}
}

export async function invoicePending() {
	try {
		const data = await prisma.invoices.count({
			where: {
				status: "pending",
			},
		});

		return data;
	} catch (err) {
		return { message: "Database error: failed to get invoice pending" };
	}
}

export async function invoiceTotal() {
	try {
		const data = await prisma.invoices.count();

		return data;
	} catch (err) {
		return { message: "Database error: failed to get invoice total" };
	}
}

export async function totalCustomers() {
	try {
		const data = await prisma.user.count();

		return data;
	} catch (err) {
		return { message: "Database error: failed to get total customers" };
	}
}

export const ITEMS_PER_PAGE = 100;
export async function fetchFilteredInvoices(
	query: string,
	currentPage: number,
) {
	// noStore();
	console.log({ query, currentPage });

	try {
		const data = await prisma.invoices.findMany({
			select: {
				id: true,
				status: true,
				amount: true,
				date: true,
				customerId: true,
				customer: {
					select: {
						photo: true,
						name: true,
						email: true,
					},
				},
			},
			skip: (currentPage - 1) * ITEMS_PER_PAGE,
			take: ITEMS_PER_PAGE,
			where: {
				OR: [
					{
						customer: {
							name: {
								contains: query,
								mode: "insensitive",
							},
						},
					},
					{
						customer: {
							email: {
								contains: query,
								mode: "insensitive",
							},
						},
					},
					{
						status: {
							contains: query,
							mode: "insensitive",
						},
					},
				],
			},
			orderBy: {
				date: "desc",
			},
		});

		// console.dir(data, { depth: Infinity });
		console.log("------");

		return data.map((row, id) => ({
			id: row.id,
			image_url: `/customers/${row.customer.photo}`,
			name: row.customer.name,
			email: row.customer.email,
			status: row.status,
			amount: row.amount,
			date: row.date.toString(),
		}));
	} catch (error) {
		console.error("Database error:", error);
		throw new Error("Failed to fetch invoices data");
	}
}

export async function totalPagesInvoices(query: string) {
	// noStore();

	try {
		const count = await prisma.invoices.count({
			where: {
				OR: [
					{
						customer: {
							name: {
								contains: query,
								mode: "insensitive",
							},
						},
					},
					{
						customer: {
							email: {
								contains: query,
								mode: "insensitive",
							},
						},
					},
					{
						status: {
							contains: query,
							mode: "insensitive",
						},
					},
				],
			},
		});

		const totalPageCount = Math.ceil(count / ITEMS_PER_PAGE);
		return { totalPageCount, count };
	} catch (error) {
		console.error("Database error:", error);
		throw new Error("Failed to fetch totalPages data");
	}
}

export async function fetchRevenue() {
	// Add noStore() here prevent the response from being cached.
	// This is equivalent to in fetch(..., {cache: 'no-store'}).

	try {
		// Artificially delay a response for demo purposes.
		// Don't do this in production :)

		// console.log('Fetching revenue data...');
		// await new Promise((resolve) => setTimeout(resolve, 3000));

		const data = await sql<Revenue>`SELECT * FROM revenue`;

		// console.log('Data fetch completed after 3 seconds.');

		return data.rows;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch revenue data.");
	}
}

export async function fetchLatestInvoices() {
	try {
		const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

		const latestInvoices = data.rows.map((invoice) => ({
			...invoice,
			amount: formatCurrency(invoice.amount),
		}));
		return latestInvoices;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch the latest invoices.");
	}
}

export async function fetchCardData() {
	try {
		// You can probably combine these into a single SQL query
		// However, we are intentionally splitting them to demonstrate
		// how to initialize multiple queries in parallel with JS.
		const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
		const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
		const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

		const data = await Promise.all([
			invoiceCountPromise,
			customerCountPromise,
			invoiceStatusPromise,
		]);

		const numberOfInvoices = Number(data[0].rows[0].count ?? "0");
		const numberOfCustomers = Number(data[1].rows[0].count ?? "0");
		const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? "0");
		const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? "0");

		return {
			numberOfCustomers,
			numberOfInvoices,
			totalPaidInvoices,
			totalPendingInvoices,
		};
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch card data.");
	}
}

export async function fetchFilteredInvoicesSql(
	query: string,
	currentPage: number,
) {
	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	try {
		const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

		return invoices.rows;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch invoices.");
	}
}

export async function fetchInvoicesPages(query: string) {
	try {
		const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

		const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
		return totalPages;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch total number of invoices.");
	}
}

export async function fetchInvoiceById(id: string) {
	try {
		const data = await prisma.invoices.findUnique({
			select: {
				id: true,
				customerId: true,
				amount: true,
				status: true,
			},
			where: {
				id,
			},
		});

		if (data) {
			const invoice = {
				id: data.id,
				customerId: data.customerId,
				amount: data.amount / 100,
				status: data.status,
			};

			return invoice;
		}
	} catch (err) {
		console.error("Database error", err);
		throw new Error("fetchInvoiceById");
	}
}

export async function fetchInvoiceByIdSql(id: string) {
	try {
		const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

		const invoice = data.rows.map((invoice) => ({
			...invoice,
			// Convert amount from cents to dollars
			amount: invoice.amount / 100,
		}));

		return invoice[0];
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch invoice.");
	}
}

export async function fetchCustomers() {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
			},
		});

		return users;
	} catch (err) {
		console.error("Database Error:", err);
		throw new Error("Failed to fetch all customers.");
	}
}

export async function fetchCustomersSql() {
	try {
		const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

		const customers = data.rows;
		return customers;
	} catch (err) {
		console.error("Database Error:", err);
		throw new Error("Failed to fetch all customers.");
	}
}

export async function fetchFilteredCustomers(query: string) {
	try {
		const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

		const customers = data.rows.map((customer) => ({
			...customer,
			total_pending: formatCurrency(customer.total_pending),
			total_paid: formatCurrency(customer.total_paid),
		}));

		return customers;
	} catch (err) {
		console.error("Database Error:", err);
		throw new Error("Failed to fetch customer table.");
	}
}

export async function getUser(email: string) {
	try {
		const user = await sql`SELECT * FROM users WHERE email=${email}`;
		return user.rows[0] as User;
	} catch (error) {
		return { message: "Failed to fetch user:" };
	}
}

export async function getCustomersCount(query: string) {
	try {
		const count = await prisma.user.count({
			where: {
				OR: [
					{
						name: { contains: query, mode: "insensitive" },
					},
					{
						email: { contains: query, mode: "insensitive" },
					},
				],
			},
		});

		const totalPageCount = Math.ceil(count / ITEMS_PER_PAGE);
		return { totalPageCount, count };
	} catch (err) {
		return { message: "Database error, fetching customers count" };
	}
}

export async function getCustomersTable(
	query: string,
	currentPage: number,
): Promise<FullUser[]> {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				photo: true,
				name: true,
				invoices: {
					select: {
						status: true,
					},
				},
			},
			where: {
				OR: [
					{
						name: {
							contains: query,
							mode: "insensitive",
						},
					},
					{
						email: {
							contains: query,
							mode: "insensitive",
						},
					},
				],
			},
			skip: (currentPage - 1) * ITEMS_PER_PAGE,
			take: ITEMS_PER_PAGE,
			orderBy: {
				name: "asc",
			},
		});

		return users.map((user) => ({
			id: user.id,
			email: user.email,
			image_url: `/customers/${user.photo}`,
			name: user.name,
			total_invoices: user.invoices.length,
			total_pending: user.invoices.filter((p) => p.status === "pending").length,
			total_paid: user.invoices.filter((p) => p.status === "paid").length,
		}));
	} catch (error) {
		throw new Error("Error fetching data");
		// throw new Error({ message: 'Error fetching data:' });
	}
}
