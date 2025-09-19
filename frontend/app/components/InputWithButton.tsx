import { Button } from "@/components/ui/button"
import {Input} from "@/components/ui/input"

export function InputWithButton({onChange, onClick, children, disabled}: {onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onClick: () => void, children: React.ReactNode, disabled: boolean}) {
  return (
    <div className="flex flex-row gap-3 w-full">
      <div className="flex-grow">
        <Input 
          type="text" 
          placeholder={children as string} 
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onClick();
            }
          }}
          className="w-full"
        />
      </div>
      <div className="flex justify-center">    
        <Button 
        type="submit"
        variant="spotify"
        onClick={onClick}
        size="default"
        disabled={disabled}
      >
        Search
      </Button ></div>
   
    </div>
  )
}
