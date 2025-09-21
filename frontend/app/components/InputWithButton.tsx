import { Button } from "@/components/ui/button"
import {Input} from "@/components/ui/input"

export function InputWithButton({onChange, onClick, children, disabled, value, placeholder, onClear}: {onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onClick: () => void, children: React.ReactNode, disabled: boolean, value: string, placeholder?: string, onClear?: () => void}) {
  return (
    <div className="relative w-full">
              {/* Spotify-style search container */}
              <div className="relative flex items-center bg-gray-800/40 backdrop-blur-sm rounded-full border border-gray-600/50 hover:border-gray-500/70 transition-all duration-200 focus-within:border-green-400 focus-within:bg-gray-800/60">
        {/* Search icon */}
        <div className="pl-4 pr-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Input field */}
        <input
          type="text"
          placeholder={placeholder || (children as string)}
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onClick();
            }
          }}
          disabled={disabled}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 py-4 pr-4 text-lg focus:outline-none disabled:opacity-50"
        />
        
        {/* Clear button - only show when there's text */}
        {value && onClear && (
          <button
            onClick={onClear}
            className="mr-2 p-1 text-gray-400 hover:text-white transition-colors duration-200"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
                {/* Search button */}
                <button
                  onClick={onClick}
                  disabled={disabled}
                  className={`mr-3 rounded-full px-5 py-2.5 font-medium text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${
                    value.trim() 
                      ? 'bg-white text-gray-900 hover:bg-gray-100' 
                      : 'bg-gray-800/80 text-white hover:bg-gray-700/80'
                  }`}
                >
                  Search
                </button>
      </div>
    </div>
  )
}
