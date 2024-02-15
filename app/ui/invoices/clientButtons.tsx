'use client';
import { Button } from '../button';
import { useFormStatus } from 'react-dom';

export function EditSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? 'Updating...' : 'Edit Invoice'}
    </Button>
  );
}

export function CreateInvoiceButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? 'Creating...' : 'Create Invoice'}
    </Button>
  );
}
