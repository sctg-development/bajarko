import { siteSettings } from '@libs/config/site/site-settings';
import { redirect } from 'react-router';

export const loader = async () => {
  return redirect(siteSettings.favicon, { status: 302 });
};
