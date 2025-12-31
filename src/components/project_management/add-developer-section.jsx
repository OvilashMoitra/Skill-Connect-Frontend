import { useState } from "react"
import { useQuery, useMutation } from '@tanstack/react-query'
import api from "../../services/api"
import projectService from "../../services/project.service"

export default function AddDeveloperSection({ projectId, currentTeam = [], onUserAdded }) {
    const [selectedUserId, setSelectedUserId] = useState("");

    // Fetch all users and filter for developers not already in team
    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
             const res = await api.get("/users");
             // Filter for developers only
             const developers = res.data.data.filter(u => u.role === 'developer');
             
             // Exclude developers already in the current team
             const currentTeamIds = currentTeam?.map(member => member._id) || [];
             return developers.filter(dev => !currentTeamIds.includes(dev._id));
        }
    });

    const addMemberMutation = useMutation({
        mutationFn: (userId) => projectService.addTeamMember(projectId, userId),
        onSuccess: () => {
            alert("Developer added successfully!");
            onUserAdded();
            setSelectedUserId("");
        }
    });

    const handleAdd = () => {
        if(!selectedUserId) return;
        addMemberMutation.mutate(selectedUserId);
    }

    return (
        <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-xs">
                <label className="block text-sm font-medium mb-1">Add Developer</label>
                <select 
                    className="w-full p-2 bg-input border border-input rounded"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="">Select Developer...</option>
                    {users?.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>
            </div>
            <button 
                onClick={handleAdd}
                disabled={!selectedUserId || addMemberMutation.isPending}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
            >
                {addMemberMutation.isPending ? "Adding..." : "Add to Project"}
            </button>

            <div className="ml-4">
                <p className="text-sm font-medium mb-2">Current Team ({currentTeam?.length || 0}):</p>
                <div className="flex flex-wrap gap-2">
                    {currentTeam && currentTeam.map(member => (
                        <span key={member._id} className="text-xs bg-secondary px-2 py-1 rounded">
                            {member.name || member.email}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
