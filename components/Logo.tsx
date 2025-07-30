interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { width: 24, height: 24, textSize: 'text-lg' },
    md: { width: 32, height: 32, textSize: 'text-xl' },
    lg: { width: 48, height: 48, textSize: 'text-2xl' }
  }

  const { width, height, textSize } = sizes[size]

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 32 32" 
          className="text-stellar-400"
        >
          <defs>
            <radialGradient id={`glow-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{stopColor:'#0ea5e9', stopOpacity:0.3}} />
              <stop offset="100%" style={{stopColor:'#0ea5e9', stopOpacity:0}} />
            </radialGradient>
            
            <linearGradient id={`starGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#38bdf8'}} />
              <stop offset="50%" style={{stopColor:'#0ea5e9'}} />
              <stop offset="100%" style={{stopColor:'#0369a1'}} />
            </linearGradient>
          </defs>
          
          <circle cx="16" cy="16" r="12" fill={`url(#glow-${size})`} />
          
          <g transform="translate(16, 16)">
            <path 
              d="M 0 -9 L 2.25 -2.75 L 9 -2.75 L 4.25 1.25 L 6.5 7.5 L 0 4 L -6.5 7.5 L -4.25 1.25 L -9 -2.75 L -2.25 -2.75 Z" 
              fill={`url(#starGradient-${size})`}
              stroke="currentColor" 
              strokeWidth="0.5"
            />
            
            <circle cx="0" cy="0" r="2" fill="#38bdf8" opacity="0.9"/>
            
            <g stroke="currentColor" strokeWidth="0.8" opacity="0.6">
              <line x1="0" y1="0" x2="12" y2="-4" />
              <line x1="0" y1="0" x2="12" y2="4" />
              <line x1="0" y1="0" x2="15" y2="0" />
            </g>
            
            <circle cx="12" cy="-4" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="12" cy="4" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="15" cy="0" r="1" fill="currentColor" opacity="0.8"/>
          </g>
        </svg>
      </div>
      
      {showText && (
        <span className={`${textSize} font-bold gradient-text`}>
          Stellarealize
        </span>
      )}
    </div>
  )
}