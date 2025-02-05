import * as React from "react"
import { Command } from "cmdk"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import {
  Command as CommandPrimitive,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className={cn(!value && "text-muted-foreground")}>
              {value || placeholder || "Select location..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <CommandPrimitive>
          <CommandInput
            placeholder="Search location..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              "No location found."
            )}
          </CommandEmpty>
          <CommandGroup>
            {locations?.map((location: any) => (
              <CommandItem
                key={location.id}
                value={location.name}
                onSelect={() => {
                  onChange(location.name)
                  setOpen(false)
                }}
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
        </CommandPrimitive>
      </PopoverContent>
    </Popover>
  )
}
