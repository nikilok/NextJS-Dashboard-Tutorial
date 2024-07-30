import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
// import { fetchInvoicesData, fetchPrismaRevenue } from '@/app/lib/data';
import { Suspense } from "react";
import {
	RevenueChartSkeleton,
	LatestInvoicesSkeleton,
} from "@/app/ui/skeletons";
import type { Metadata } from "next";
import {
	invoiceCollected,
	invoicePending,
	invoiceTotal,
	totalCustomers,
} from "@/app/lib/data";

export const metadata: Metadata = {
	title: "Home",
};

export default async function Page() {
	// The below calls runs it in series, causing a waterfall
	// const revenue = await fetchPrismaRevenue();
	// const latestInvoices = await fetchInvoicesData();

	// The below calls runs the queries in parallel...
	// const [revenue, latestInvoices] = await Promise.all([
	//   fetchPrismaRevenue(),
	//   fetchInvoicesData(),
	// ]);
	const [countCollected, countPending, countTotal, countCustomers] =
		(await Promise.all([
			invoiceCollected(),
			invoicePending(),
			invoiceTotal(),
			totalCustomers(),
		])) as number[];

	return (
		<main>
			<h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
				Dashboard
			</h1>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Card title="Collected" value={countCollected} type="collected" />
				<Card title="Pending" value={countPending} type="pending" />
				<Card title="Total Invoices" value={countTotal} type="invoices" />
				<Card title="Total Customers" value={countCustomers} type="customers" />
			</div>
			<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
				<Suspense fallback={<RevenueChartSkeleton />}>
					<RevenueChart />
				</Suspense>

				<Suspense fallback={<LatestInvoicesSkeleton />}>
					<LatestInvoices />
				</Suspense>
			</div>
		</main>
	);
}
