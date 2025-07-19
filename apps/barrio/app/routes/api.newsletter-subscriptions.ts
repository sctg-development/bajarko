import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, data } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

export const newsletterSubscriberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const { data: validatedData, errors } = await getValidatedFormData(
    await request.formData(),
    zodResolver(newsletterSubscriberSchema),
  );

  if (errors) {
    return data({ errors }, { status: 400 });
  }

  const { email } = validatedData;

  // Implement newsletter subscription here!

  console.log('Subscribed to newsletter', email);

  return data({ success: true }, { status: 200 });
};
