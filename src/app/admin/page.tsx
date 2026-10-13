import AdminEventsTable from '@/components/admin/admin-events-table';

export default function AdminPage() {
	return (
		<main className='mx-auto max-w-7xl px-5 py-10'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold'>Admin Dashboard</h1>
				<p className='mt-2 text-slate-500'>Manage events, create new events, and update existing ones.</p>
			</div>

			<AdminEventsTable />
		</main>
	);
}
