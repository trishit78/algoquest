import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
}

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  const base = 'px-4 py-2 rounded-md font-semibold focus:outline-none'
  const styles =
    variant === 'primary'
      ? 'bg-primary hover:bg-primaryHover text-white'
      : variant === 'danger'
      ? 'bg-danger text-white'
      : 'bg-transparent border border-borderZ text-textSecondary'

  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  )
}
