import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock next/navigation router
const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))
vi.mock('@/components/RichText', () => ({
  default: () => null,
}))

import { FormBlock, type FormBlockType } from '@/blocks/Form/Component'

const baseForm: FormBlockType['form'] = {
  id: 'test-form',
  confirmationMessage: {
    root: {
      type: 'root',
      children: [],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  confirmationType: 'message',
  emails: [],
  fields: [
    {
      name: 'full-name',
      blockName: 'full-name',
      blockType: 'text',
      label: 'Full Name',
      required: true,
      width: 100,
    },
    {
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Email',
      required: true,
      width: 100,
    },
  ],
  submitButtonLabel: 'Submit',
  title: 'Test Form',
}

describe('FormBlock', () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('shows errors for required fields', async () => {
    const fetchMock = vi.fn()
    // @ts-expect-error - allow assigning to global
    global.fetch = fetchMock

    render(<FormBlock enableIntro={false} form={baseForm} />)

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findAllByText('This field is required')).toHaveLength(2)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('submits form data and redirects on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({}),
    })
    // @ts-expect-error - allow assigning to global
    global.fetch = fetchMock

    const form = {
      ...baseForm,
      confirmationType: 'redirect',
      redirect: { url: '/thanks' },
    }

    render(<FormBlock enableIntro={false} form={form} />)

    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'john@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    expect(fetchMock.mock.calls[0][0]).toContain('/api/form-submissions')
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/thanks'))
  })

  it('shows submission error message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 400,
      json: () => Promise.resolve({ errors: [{ message: 'Bad' }], status: '400' }),
    })
    // @ts-expect-error - allow assigning to global
    global.fetch = fetchMock

    render(<FormBlock enableIntro={false} form={baseForm} />)

    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'john@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await screen.findByText('400: Bad')
  })
})

