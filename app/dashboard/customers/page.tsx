import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import { getCustomersCount } from '@/app/lib/data';
import Search from '@/app/ui/search';
import { CreateUser } from '@/app/ui/invoices/buttons';
import { Suspense } from 'react';
import Table from '@/app/ui/customers/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import Pagination from '@/app/ui/invoices/pagination';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const { count = 0, totalPageCount = 0 } = await getCustomersCount(query);
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          {count > 1 ? `${count} Customers` : `${count} Customer`}
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateUser />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPageCount} />
      </div>
    </div>
  );
}
