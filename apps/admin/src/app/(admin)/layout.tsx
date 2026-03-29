import { Sidebar } from '@/components/Sidebar'
import { AdminHeader } from '@/components/AdminHeader'
import { AdminBottomNav } from '@/components/AdminBottomNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-background">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8 lg:px-10">
          <div className="max-w-7xl mx-auto pb-24 md:pb-0">
            {children}
          </div>
        </main>
      </div>
      <AdminBottomNav />
    </div>
  )
}
