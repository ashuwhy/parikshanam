'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  mrp: z.coerce.number().min(0).optional(),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  olympiad_type_id: z.string().optional(),
  min_class_id: z.string().optional(),
  max_class_id: z.string().optional(),
})

export type CourseFormData = z.infer<typeof schema>

interface CourseFormProps {
  defaultValues?: Partial<CourseFormData>
  olympiadTypes: { id: string; label: string }[]
  classLevels: { id: string; label: string }[]
  onSubmit: (data: CourseFormData) => Promise<void>
  submitLabel?: string
}

export function CourseForm({ defaultValues, olympiadTypes, classLevels, onSubmit, submitLabel = 'Save' }: CourseFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CourseFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input {...register('title')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Subtitle</label>
        <input {...register('subtitle')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea {...register('description')} rows={3} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (₹) *</label>
          <input type="number" {...register('price')} placeholder="e.g. 499" className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">MRP (₹)</label>
          <input type="number" {...register('mrp')} placeholder="e.g. 999" className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Olympiad Type</label>
        <select {...register('olympiad_type_id')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm">
          <option value="">- Select -</option>
          {olympiadTypes.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Min Class</label>
          <select {...register('min_class_id')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm">
            <option value="">- Select -</option>
            {classLevels.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Class</label>
          <select {...register('max_class_id')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm">
            <option value="">- Select -</option>
            {classLevels.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
        <input {...register('thumbnail_url')} className="w-full border border-ui-border rounded-xl px-3 py-2 text-sm" placeholder="https://..." />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-primary text-white font-bold rounded-xl px-6 py-2.5 border-b-4 border-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
