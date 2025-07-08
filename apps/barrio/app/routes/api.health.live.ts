import { LoaderFunctionArgs } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return Response.json({ status: "It's alive!!!" });
};
