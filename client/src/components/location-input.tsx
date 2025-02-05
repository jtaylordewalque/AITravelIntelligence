import * as React from "react"
import { Command } from "cmdk"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import {
  Command as CommandPrimitive,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: React.ReactNode
}

export function LocationInput({
  value,
  onChange,
  placeholder,
  icon
}: LocationInputProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const { data: locations, isLoading } = useQuery({
    queryKey: ['/api/locations/suggestions', searchTerm],
    queryFn: async () => {
      if (searchTerm.length < 2) return []
      const response = await fetch(`/api/locations/suggestions?q=${encodeURIComponent(searchTerm)}`)
      if (!response.ok) throw new Error('Failed to fetch locations')
      return response.json()
    },
    enabled: searchTerm.length >= 2
  })

  return (
    <div className="relative">
      <CommandPrimitive className="relative">
        <div className="flex items-center border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {icon && <div className="pl-3">{icon}</div>}
          <CommandInput
            ref={inputRef}
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder={placeholder}
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        {(searchTerm.length >= 2 && (locations?.length > 0 || isLoading)) && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover text-popover-foreground shadow-md rounded-md overflow-hidden">
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                "No location found."
              )}
            </CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {locations?.map((location: any) => (
                <CommandItem
                  key={location.id}
                  value={location.name}
                  onSelect={(value) => {
                    onChange(value)
                    setSearchTerm(value)
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === location.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {location.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        )}
      </CommandPrimitive>
    </div>
  )
}