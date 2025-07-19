import { Alert } from '@app/components/common/alert';
import { newsletterSubscriberSchema } from '@app/routes/api.newsletter-subscriptions';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form';
import clsx from 'clsx';
import { type FC, useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { SubmitButton } from '../common/remix-hook-form/buttons/SubmitButton';

export const NewsletterSubscription: FC<{ className?: string }> = ({ className }) => {
  const [isClient, setIsClient] = useState(false);

  const fetcher = useFetcher<{
    success: boolean;
    errors?: Record<string, { message: string }>;
  }>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render a placeholder during SSR
  if (!isClient) {
    return (
      <div className={clsx('card flex flex-col rounded text-white', className)}>
        <div className="items-end gap-2 border-b border-white">
          <div className="flex flex-col text-white gap-5">
            <span className="text-lg font-bold">Newsletter</span>
            <p className="font-light">Sign up for our newsletter to only receive good things.</p>
          </div>
          <div className="flex items-end gap-2">
            <input
              placeholder="Enter your email"
              className="min-w-[220px] w-full text-white border-none rounded-none mt-2 pl-0 bg-transparent placeholder:text-white"
              disabled
            />
            <button className="pr-0 pl-0 bg-transparent border-none text-white">
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ClientNewsletterForm fetcher={fetcher} className={className} />;
};

const ClientNewsletterForm: FC<{
  fetcher: any;
  className?: string;
}> = ({ fetcher, className }) => {
  const form = useRemixForm<Zod.infer<typeof newsletterSubscriberSchema>>({
    fetcher,
    submitConfig: {
      method: 'post',
      action: '/api/newsletter-subscriptions',
    },
  });

  useEffect(() => {
    if (fetcher.data?.success) {
      form.reset();
    }
  }, [form, fetcher.data]);

  return (
    <div className={clsx('card flex flex-col rounded text-white', className)}>
      {fetcher.data?.success ? (
        <Alert type="success" className="mb-2 mt-4 min-w-[280px]" title={`Thank you for subscribing!`} />
      ) : (
        <RemixFormProvider {...form}>
          <fetcher.Form onSubmit={form.handleSubmit}>
            <div className="items-end gap-2 border-b border-white">
              <div className="flex flex-col text-white gap-5">
                <span className="text-lg font-bold">Newsletter</span>
                <p className="font-light">Sign up for our newsletter to only receive good things.</p>
              </div>

              <div className="flex items-end gap-2">
                <input
                  {...form.register('email')}
                  name="email"
                  placeholder="Enter your email"
                  className="min-w-[220px] w-full text-white border-none rounded-none mt-2 pl-0 bg-transparent placeholder:text-white"
                />
                <SubmitButton variant="ghost" className="pr-0 pl-0">
                  <ArrowRightIcon className="w-5 h-5" />
                </SubmitButton>
              </div>
            </div>
          </fetcher.Form>
        </RemixFormProvider>
      )}
    </div>
  );
};
