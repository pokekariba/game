import React, { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	haveLogo?: boolean;
}

const Card: React.FC<CardProps> = ({ children, haveLogo, className, ...props}) => (
	<div {...props} className={`card ${className} ${haveLogo ? 'card__logo' : ''}`}>
		{children}
	</div>
);

export default Card;