import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: React.ReactNode;
	color?: 'primary' | 'gold' | 'white' | 'dark-primary' | 'store' ;
	outline?: boolean;
	border?: boolean;
	size?: 'sm' | 'md' | 'lg';
};

const Button: React.FC<ButtonProps> = ({ children, border=true,color='primary',outline=false,size='md',className,...props}) => (
	<button {...props} className={`btn btn--${color} btn--${size} ${border && 'btn--border'} ${outline && 'btn--outline'} ${className}`}>
		{children}
	</button>
);

export default Button;