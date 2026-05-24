import { Fragment } from 'react';
import type { ReactNode } from 'react';

interface Props { children: ReactNode }

export default function PageTransition({ children }: Props) {
  return <Fragment>{children}</Fragment>;
}
