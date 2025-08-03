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
              <stop offset="0%" style={{stopColor:'#0ea5e9', stopOpacity:0.4}} />
              <stop offset="100%" style={{stopColor:'#0ea5e9', stopOpacity:0}} />
            </radialGradient>
            
            <linearGradient id={`starGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#38bdf8'}} />
              <stop offset="50%" style={{stopColor:'#0ea5e9'}} />
              <stop offset="100%" style={{stopColor:'#0369a1'}} />
            </linearGradient>

            <linearGradient id={`orbitGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#0ea5e9', stopOpacity:0.8}} />
              <stop offset="100%" style={{stopColor:'#38bdf8', stopOpacity:0.3}} />
            </linearGradient>
          </defs>
          
          {/* Background glow */}
          <circle cx="16" cy="16" r="14" fill={`url(#glow-${size})`} />
          
          {/* Main star (Stellar) */}
          <g transform="translate(16, 16)">
            <path 
              d="M 0 -10 L 2.5 -3 L 10 -3 L 4.5 2 L 7.5 9 L 0 5 L -7.5 9 L -4.5 2 L -10 -3 L -2.5 -3 Z" 
              fill={`url(#starGradient-${size})`}
              stroke="currentColor" 
              strokeWidth="0.5"
            />
            
            {/* Center core */}
            <circle cx="0" cy="0" r="2.5" fill="#38bdf8" opacity="0.9"/>
            
            {/* Orbital rings representing network connections */}
            <circle cx="0" cy="0" r="12" fill="none" stroke={`url(#orbitGradient-${size})`} strokeWidth="0.8" opacity="0.6"/>
            <circle cx="0" cy="0" r="9" fill="none" stroke={`url(#orbitGradient-${size})`} strokeWidth="0.6" opacity="0.4"/>
            
            {/* Network nodes */}
            <g stroke="currentColor" strokeWidth="0.8" opacity="0.7">
              <line x1="0" y1="0" x2="13" y2="-5" />
              <line x1="0" y1="0" x2="13" y2="5" />
              <line x1="0" y1="0" x2="16" y2="0" />
              <line x1="0" y1="0" x2="11" y2="-8" />
              <line x1="0" y1="0" x2="11" y2="8" />
            </g>
            
            {/* Network nodes */}
            <circle cx="13" cy="-5" r="1.2" fill="currentColor" opacity="0.9"/>
            <circle cx="13" cy="5" r="1.2" fill="currentColor" opacity="0.9"/>
            <circle cx="16" cy="0" r="1.2" fill="currentColor" opacity="0.9"/>
            <circle cx="11" cy="-8" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="11" cy="8" r="1" fill="currentColor" opacity="0.8"/>
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