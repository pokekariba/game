import React from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  color?:
    | 'primary'
    | 'gold'
    | 'white'
    | 'dark-primary'
    | 'store'
    | 'error'
    | 'warning';
  outline?: boolean;
  border?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  iconButton?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  border = true,
  color = 'primary',
  outline = false,
  size = 'md',
  className,
  href,
  iconButton = false,
  ...props
}) =>
  href ? (
    <Link
      to={href}
      className={`btn btn--${color} btn--${size} ${border && 'btn--border'} ${outline && 'btn--outline'} ${className} ${iconButton && 'btn--icon'} ${className}`}
    >
      {children}
    </Link>
  ) : (
    <button
      {...props}
      className={`btn btn--${color} btn--${size} ${border && 'btn--border'} ${outline && 'btn--outline'} ${iconButton && 'btn--icon'} ${className}`}
    >
      {children}
    </button>
  );

export default Button;
