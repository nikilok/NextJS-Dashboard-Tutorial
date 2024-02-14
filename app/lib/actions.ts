'use server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

const FormSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'paid']),
  amount: z.coerce.number(),
  date: z.string(),
  customerId: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const { status, customerId, amount } = CreateInvoice.parse(rawFormData);
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
  } catch (err) {
    console.error('Database error', err);
    throw new Error('createInvoice action');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

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
  } catch (err) {
    console.error('Database error', err);
    throw new Error('updateInvoice action');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoices.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    console.error('Database error', err);
    throw new Error('deleteInvoice action');
  }

  revalidatePath('/dashboard/invoices');
}
