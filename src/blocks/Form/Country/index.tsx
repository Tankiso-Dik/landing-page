import type { CountryField } from '@payloadcms/plugin-form-builder/types'
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
// load options dynamically so they are only fetched when needed
// options are stored in JSON under src/data

  export const Country: React.FC<
    CountryField & {
      control: Control
      errors: Partial<FieldErrorsImpl>
    }
  > = ({ name, control, errors, label, required, width }) => {
    const [countryOptions, setCountryOptions] = React.useState<{
      label: string
      value: string
    }[]>([])

    React.useEffect(() => {
      void import('@/data/country-options.json').then((mod) => {
        setCountryOptions(mod.default)
      })
    }, [])

    return (
      <Width width={width}>
        <Label className="" htmlFor={name}>
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
            const controlledValue = countryOptions.find((t) => t.value === value)

            return (
              <Select onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
                <SelectTrigger className="w-full" id={name}>
                  <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map(({ label, value }) => {
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
