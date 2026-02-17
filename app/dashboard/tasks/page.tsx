import { getTasks } from "@/app/actions/tasks";
import { TaskList } from "@/components/crm/task-list";
import { AddTaskButton } from "@/components/crm/add-task-button";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function TasksPage() {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const tasks = await getTasks({ view: 'my' });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                    <p className="text-sm text-gray-500 mt-1">Stay on top of your to-dos.</p>
                </div>
                <AddTaskButton />
            </div>

            <TaskList initialTasks={tasks} />
        </div>
    );
}
