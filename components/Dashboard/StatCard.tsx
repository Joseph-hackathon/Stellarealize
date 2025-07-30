interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  description?: string
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  description 
}: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-400'
      case 'negative':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getChangeSymbol = () => {
    switch (changeType) {
      case 'positive':
        return '↗'
      case 'negative':
        return '↘'
      default:
        return '→'
    }
  }

  return (
    <div className="card-gradient p-6 rounded-xl hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="text-stellar-400">
              {icon}
            </div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          <div className="text-2xl md:text-3xl font-bold text-white mb-1">
            {value}
          </div>
          
          <div className={`text-sm font-medium ${getChangeColor()}`}>
            <span className="mr-1">{getChangeSymbol()}</span>
            {change}
          </div>
          
          {description && (
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}