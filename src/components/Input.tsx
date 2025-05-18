import React, { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	small?: string;
};

const Input: React.FC<InputProps> = (props) => {
	return (
		<div className='input__container'>
			{props.label && (
				<label htmlFor={props.id} className="input__label">
					{props.label}
				</label>
			)}
			<input
				{...props}
				className={`input ${props.className || ''}`}
			/>
			{props.small && (
				<small className="input__small">
					{props.small}
				</small>
			)}
		</div>
	);
};

export default Input;