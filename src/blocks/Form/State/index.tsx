import type { StateField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'
// options for U.S. states are dynamically imported from JSON

  export const State: React.FC<
    StateField & {
      control: Control
      errors: Partial<FieldErrorsImpl>
    }
  > = ({ name, control, errors, label, required, width }) => {
    const [stateOptions, setStateOptions] = React.useState<{
      label: string
      value: string
    }[]>([])

    React.useEffect(() => {
      void import('@/data/state-options.json').then((mod) => {
        setStateOptions(mod.default)
      })
    }, [])

    return (
      <Width width={width}>
        <Label htmlFor={name}>
          {label}
          {required && (
            <span className="required">
              * <span className="sr-only">(required)</span>
            </span>
          )}
        </Label>
        <Controller
          control={control}
          defaultValue=""
          name={name}
          render={({ field: { onChange, value } }) => {
            const controlledValue = stateOptions.find((t) => t.value === value)

            return (
              <Select onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
                <SelectTrigger className="w-full" id={name}>
                  <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map(({ label, value }) => {
                    return (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            )
          }}
          rules={{ required }}
        />
        {errors[name] && <Error name={name} />}
      </Width>
    )
  }
