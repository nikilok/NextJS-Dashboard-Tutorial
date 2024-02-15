'use client';
import { Button } from '../button';
import { useFormStatus } from 'react-dom';

export function EditSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Updating...' : 'Edit Invoice'}
    </Button>
  );
}
