import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { getOwnerSchema } from '../schemas/owner.schema';
import type { OwnerDTO } from '../types/owner.types';

export type OwnerFormValues = z.infer<ReturnType<typeof getOwnerSchema>>;

interface UseOwnerFormProps {
  owner?: OwnerDTO | null;
  isEditMode?: boolean;
  visible?: boolean;
}

export function useOwnerForm({ owner, isEditMode = false, visible }: UseOwnerFormProps) {
  const form = useForm<OwnerFormValues>({
    resolver: zodResolver(getOwnerSchema()),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { name: '', email: '', phone: '' },
  });

  const prevVisible = useRef(visible);

  useEffect(() => {
    if (!visible && prevVisible.current) {
      form.reset({ name: '', email: '', phone: '' });
    }
    if (visible && !prevVisible.current) {
      if (isEditMode && owner) {
        form.reset({ name: owner.name, email: owner.email ?? '', phone: owner.phone });
      }
    }
    prevVisible.current = visible;
  }, [visible, isEditMode, owner]); // eslint-disable-line react-hooks/exhaustive-deps

  return { form };
}
