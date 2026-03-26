import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<{ name: string; value: number }>()
const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('value', { header: 'Value' }),
]
const data = [{ name: 'Alice', value: 42 }]

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  it('renders row data', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
