import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'text';
type Size = 'sm' | 'md' | 'lg';

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

interface AsLink extends CommonProps {
  to: string;
  href?: never;
  onClick?: never;
}

interface AsExternal extends CommonProps {
  href: string;
  to?: never;
  onClick?: never;
}

interface AsButton
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> {
  to?: never;
  href?: never;
}

type ButtonProps = AsLink | AsExternal | AsButton;

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-medium uppercase tracking-[0.1em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    'border border-charcoal-900 bg-charcoal-900 text-surface-50 hover:border-charcoal-700 hover:bg-charcoal-700',
  secondary:
    'border border-gold-300 bg-transparent text-charcoal-900 hover:bg-gold-300 hover:text-charcoal-900',
  text:
    'border-b border-gold-500 bg-transparent px-0 text-gold-500 hover:border-charcoal-900 hover:text-charcoal-900',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-[11px]',
  md: 'h-12 px-7 text-[12px]',
  lg: 'h-14 px-9 text-[13px]',
};

export default function Button(props: ButtonProps) {
  const variant = props.variant ?? 'primary';
  const size = props.size ?? 'md';
  const sizeClasses = variant === 'text' ? '' : sizes[size];
  const classes = cn(base, variants[variant], sizeClasses, props.className);
  const motionProps = { whileHover: { y: -1 } };

  if ('to' in props && props.to) {
    return (
      <motion.span {...motionProps} className="inline-block">
        <Link to={props.to} className={classes}>
          {props.children}
        </Link>
      </motion.span>
    );
  }

  if ('href' in props && props.href) {
    return (
      <motion.a
        {...motionProps}
        href={props.href}
        target="_blank"
        rel="noreferrer"
        className={classes}
      >
        {props.children}
      </motion.a>
    );
  }

  const { children, variant: _v, size: _s, className: _c, to: _t, href: _h, ...rest } =
    props as AsButton & { to?: undefined; href?: undefined };
  void _v; void _s; void _c; void _t; void _h;

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}
