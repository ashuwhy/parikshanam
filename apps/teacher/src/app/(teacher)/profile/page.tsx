'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';

const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  bio: z.string().optional().default(''),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('full_name, bio, avatar_url')
          .eq('id', session.user.id)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          reset({
            full_name: data.full_name || '',
            bio: data.bio || '',
            avatar_url: data.avatar_url || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile');
      }
    };

    loadProfile();
  }, [session?.user?.id, reset]);

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.id) {
      setError('Not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSaved(false);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          bio: data.bio,
          avatar_url: data.avatar_url,
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-navy">Edit Profile</h1>
          <p className="mt-2 text-base text-gray-600">
            Update your profile information
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {saved && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">
                Profile saved successfully
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-900"
            >
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              {...register('full_name')}
              className="mt-1 block w-full rounded-md border border-ui-border bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              placeholder="John Doe"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-900"
            >
              Bio
            </label>
            <textarea
              id="bio"
              {...register('bio')}
              rows={4}
              className="mt-1 block w-full rounded-md border border-ui-border bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              placeholder="Tell us about yourself..."
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="avatar_url"
              className="block text-sm font-medium text-gray-900"
            >
              Avatar URL
            </label>
            <input
              type="url"
              id="avatar_url"
              {...register('avatar_url')}
              className="mt-1 block w-full rounded-md border border-ui-border bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              placeholder="https://example.com/avatar.jpg"
            />
            {errors.avatar_url && (
              <p className="mt-1 text-sm text-red-600">
                {errors.avatar_url.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-md bg-brand-primary px-4 py-2 text-white font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="flex-1 rounded-md border border-ui-border bg-white px-4 py-2 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
