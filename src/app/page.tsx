import { DashboardDataProvider } from '@/data/DashboardDataProvider';
import { DashboardView } from '@/components/dashboard/DashboardView';

export default function DashboardPage() {
  return (
    <DashboardDataProvider>
      <DashboardView />
    </DashboardDataProvider>
  );
}
