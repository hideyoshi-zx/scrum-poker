const BASE_CLASS_NAME = 'inline-flex items-center justify-center border font-medium shadow-sm'
const STATE_CLASS_NAMES = {
  normal: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
  disabled: 'bg-opacity-50 pointer-events-none',
}
const SIZE_CLASS_NAMES = {
  xs: {
    button: 'px-2.5 py-1.5 text-xs rounded',
    spinner: 'h-4 w-4',
  },
  sm: {
    button: 'px-3 py-2 text-sm rounded-md',
    spinner: 'h-4 w-4',
  },
  md: {
    button: 'px-4 py-2 text-sm rounded-md',
    spinner: 'h-4 w-4',
  },
  lg: {
    button: 'px-4 py-2 text-base rounded-md',
    spinner: 'h-5 w-5',
  },
  xl: {
    button: 'px-6 py-3 text-base rounded-md',
    spinner: 'h-5 w-5',
  },
  '2xl': {
    button: 'px-8 py-3 text-base rounded-md md:py-4 md:text-lg md:px-10',
    spinner: 'h-5 w-5',
  },
}
const VARIANT_CLASS_NAMES = {
  primary: {
    button: 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    spinner: 'text-white'
  },
  secondary: {
    button: 'border-transparent text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500',
    spinner: 'text-white'
  },
}

type Props = {
  size?: keyof typeof SIZE_CLASS_NAMES
  variant: keyof typeof VARIANT_CLASS_NAMES
  loading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button (props: Props) {
  const { disabled, size = 'md', variant, loading = false, ...childProps } = props
  const state = (disabled || loading) ? 'disabled' : 'normal'
  const className = [
    BASE_CLASS_NAME,
    STATE_CLASS_NAMES[state],
    SIZE_CLASS_NAMES[size]['button'],
    VARIANT_CLASS_NAMES[variant]['button'],
    props.className,
  ].join(' ')

  return (
    <button
      {...childProps}
      disabled={state === 'disabled'}
      className={className}
    >
      <Spinner loading={loading} size={size} variant={variant} />
      {props.children}
    </button>
  )
}

type SpinnerProps = {
  size: keyof typeof SIZE_CLASS_NAMES
  variant: keyof typeof VARIANT_CLASS_NAMES
  loading: boolean
}

function Spinner ({ loading, size, variant }: SpinnerProps) {
  if (!loading) return null

  const className = [
    'animate-spin -ml-1 mr-3',
    SIZE_CLASS_NAMES[size]['spinner'],
    VARIANT_CLASS_NAMES[variant]['spinner']
  ].join(' ')

  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}
