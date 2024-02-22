'use client';

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { createCustomer } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { CreateCustomer } from './clientButtons';

export default function Form() {
  const initialState = { message: null, errors: {} };

  const [state, dispatch] = useFormState(createCustomer, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Customer name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                aria-describedby="name-error"
                id="name"
                name="name"
                type="text"
                placeholder="Enter name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Customer email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                aria-describedby="email-error"
                id="email"
                name="email"
                type="text"
                placeholder="Enter email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Customer Street */}
          <div>
            <label htmlFor="street" className="mb-2 block text-sm font-medium">
              Street <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  aria-describedby="street-error"
                  id="street"
                  name="street"
                  type="text"
                  placeholder="Street"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="street-error" aria-live="polite" aria-atomic="true">
                {state.errors?.street &&
                  state.errors.street.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
          {/* Customer City */}
          <div>
            <label htmlFor="city" className="mb-2 block text-sm font-medium">
              City <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  aria-describedby="city-error"
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="city-error" aria-live="polite" aria-atomic="true">
                {state.errors?.city &&
                  state.errors.city.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
          {/* State */}
          <div>
            <label htmlFor="state" className="mb-2 block text-sm font-medium">
              State <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  aria-describedby="state-error"
                  id="state"
                  name="state"
                  type="text"
                  placeholder="state"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="state-error" aria-live="polite" aria-atomic="true">
                {state.errors?.state &&
                  state.errors.state.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
          {/* Zip */}
          <div>
            <label htmlFor="zip" className="mb-2 block text-sm font-medium">
              Zip <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  aria-describedby="zip-error"
                  id="zip"
                  name="zip"
                  type="text"
                  placeholder="zip"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="zip-error" aria-live="polite" aria-atomic="true">
                {state.errors?.zip &&
                  state.errors.zip.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <CreateCustomer />
      </div>
    </form>
  );
}
