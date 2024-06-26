import Maps from '@/app/ui/dashboard/chart/map';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'chart',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  return (
    <>
      <h1 className={`${lusitana.className} text-2xl`}>Map view</h1>
      <Maps />
    </>
  );
}
