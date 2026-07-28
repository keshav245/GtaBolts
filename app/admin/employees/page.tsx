import EmployeeAuditTable from '@/components/admin/EmployeeAuditTable';
import { getEmployeeAudits } from '@/lib/queries/admin';

export default async function AdminEmployeesPage() {
  const audits = await getEmployeeAudits();

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase mb-2">// Content team</p>
        <h1 className="font-display font-bold text-3xl">Employee audit</h1>
      </div>
      <EmployeeAuditTable audits={audits} />
    </div>
  );
}
