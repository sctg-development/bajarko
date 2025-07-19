import { FC } from 'react';
import { FieldGroup, FieldGroupProps } from '../forms/fields/FieldGroup';
import { StyledPassword } from '../forms/fields/StyledPassword';

export interface ConfirmPasswordFieldGroupProps extends FieldGroupProps {}

export const ConfirmPasswordFieldGroup: FC<ConfirmPasswordFieldGroupProps> = (props) => (
  <FieldGroup {...props}>
    <div className="col-span-12">
      <StyledPassword name="password" label="Password" autoComplete="new-password" />
    </div>
    <div className="col-span-12">
      <StyledPassword name="confirmPassword" label="Confirm Password" />
    </div>
  </FieldGroup>
);
