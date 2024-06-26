'use client';

import { CalendarIcon } from '@heroicons/react/24/outline';

export default function RevenueChartPrevious() {
  const onClickHandle = () => {
    alert('client side event, last 12 clicked');
  };

  return (
    <div onClick={onClickHandle} className="flex items-center pb-2 pt-6">
      <CalendarIcon className="h-5 w-5 text-gray-500" />
      <h3 className="ml-2 cursor-pointer text-sm text-gray-500">
        Last 12 months
      </h3>
    </div>
  );
}
