'use server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

const FormSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' })
    .lt(100000, { message: 'Please enter an amount less than $100,000' }),
  date: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a valid customer',
  }),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  //   const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { status, customerId, amount } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString();

  try {
    await prisma.invoices.create({
      data: {
        status,
        amount: amountInCents,
        date,
        customerId,
      },
    });
    revalidatePath('/dashboard/invoices');
  } catch (err) {
    return { message: 'Database error: Failed to create invoice' };
  }

  redirect('/dashboard/invoices');
}

export type CustomerState = {
  errors?: {
    email?: string[];
    name?: string[];
    street?: string[];
    city?: string[];
    state?: string[];
    zip?: string[];
  };
  message?: string | null;
};

const CustomerSchema = z.object({
  id: z.string(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email (eg: user@domain.com)' }),
  photo: z.string(),
  name: z
    .string()
    .min(2)
    .refine((name) => name.length > 2 && typeof name === 'string', {
      message: 'Please enter a valid name',
    }),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});

const CreateCustomer = CustomerSchema.omit({ id: true, photo: true });

export async function createCustomer(
  prevState: CustomerState,
  formData: FormData,
) {
  //   const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = CreateCustomer.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
    street: formData.get('street'),
    city: formData.get('city'),
    state: formData.get('state'),
    zip: formData.get('zip'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    };
  }

  const { email, name, street, city, state, zip } = validatedFields.data;

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        photo: 'user.png',
        address: {
          city,
          state,
          zip,
          street,
        },
      },
    });
    revalidatePath('/dashboard/customers');
  } catch (err) {
    return { message: `Database error: Failed to create invoice: ${err}` };
  }

  redirect('/dashboard/customers');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Edit Invoice.',
    };
  }

  const { status, customerId, amount } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await prisma.invoices.update({
      where: {
        id,
      },
      data: {
        customerId,
        amount: amountInCents,
        status,
      },
    });
    revalidatePath('/dashboard/invoices');
  } catch (err) {
    return { message: 'Database error: Failed to update invoice' };
  }

  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoices.delete({
      where: {
        id,
      },
    });
    revalidatePath('/dashboard/invoices');
  } catch (err) {
    return { message: 'Database error: Failed to delete invoice' };
  }
}
