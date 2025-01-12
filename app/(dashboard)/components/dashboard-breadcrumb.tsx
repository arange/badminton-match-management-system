'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { usePathname, useSearchParams, useParams } from 'next/navigation';

export default function DashboardBreadcrumb() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pathParams = useParams();

  // Derive breadcrumb data
  const breadcrumbs = [
    { href: '/', label: 'Dashboard' },
    {
      href: pathname.includes('players') ? '/players' : '/',
      label: pathname.includes('players') ? 'Players' : 'Matches'
    },
    {
      href: pathname.includes('players') ? '/players' : '/',
      label:
        searchParams.get('s') ||
        pathParams?.userId ||
        pathParams?.matchId ||
        'all'
    }
  ];

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={index}>
            {index < breadcrumbs.length - 1 ? (
              <>
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
