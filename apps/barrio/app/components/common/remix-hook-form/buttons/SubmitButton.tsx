import { Button, ButtonProps } from '@app/components/common/buttons/Button';
import { FC } from 'react';
import { useRemixFormContext } from 'remix-hook-form';

export interface SubmitButtonProps extends ButtonProps {}

export const SubmitButton: FC<SubmitButtonProps> = ({ children, ...props }) => {
  const { formState } = useRemixFormContext();

  return (
    <Button variant="primary" type="submit" disabled={formState.isSubmitting} {...props}>
      {children || (formState.isSubmitting ? 'Submitting...' : 'Submit')}
    </Button>
  );
};
