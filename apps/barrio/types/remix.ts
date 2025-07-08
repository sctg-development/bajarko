import { LoaderFunction } from 'react-router';

export type RemixLoaderResponse<TLoader extends LoaderFunction> = Awaited<ReturnType<TLoader>>;
