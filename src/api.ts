import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/router/index';
import superjson from 'superjson'
export const trpc = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
        httpBatchLink({
            url: 'http://localhost:2022/trpc',
        }),
    ],
});