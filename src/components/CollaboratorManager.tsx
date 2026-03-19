import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { UserCircleIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Collaborator {
  userId: string;
  username: string;
  profilePic?: string;
  role: string;
  addedAt: string;
}

interface CollaboratorManagerProps {
  collectionId: string;
  isOwner: boolean;
}

export function CollaboratorManager({ collectionId, isOwner }: CollaboratorManagerProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("viewer");
  const [inviting, setInviting] = useState(false);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => {
    fetchCollaborators();
  }, [collectionId]);

  async function fetchCollaborators() {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/v1/collections/${collectionId}/collaborators`,
        { headers }
      );
      setCollaborators(res.data.collaborators);
    } catch {
      // May not have permission — that's OK
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite() {
    if (!username.trim()) return;
    setInviting(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/collections/${collectionId}/invite`,
        { username, role },
        { headers }
      );
      toast.success(`${username} added as ${role}`);
      setUsername("");
      fetchCollaborators();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to invite");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(userId: string, name: string) {
    try {
      await axios.delete(
        `${BACKEND_URL}/api/v1/collections/${collectionId}/collaborators/${userId}`,
        { headers }
      );
      setCollaborators(collaborators.filter((c) => c.userId !== userId));
      toast.success(`${name} removed`);
    } catch {
      toast.error("Failed to remove collaborator");
    }
  }

  if (loading) return null;

  return (
    <div className="mt-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Collaborators ({collaborators.length})
      </h3>

      {/* Invite form (owners only) */}
      {isOwner && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "editor" | "viewer")}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={inviting}
            className="px-3 py-2 rounded-lg text-white text-sm font-semibold bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* List */}
      {collaborators.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No collaborators yet.</p>
      ) : (
        <div className="space-y-2">
          {collaborators.map((c) => (
            <div key={c.userId} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                {c.profilePic ? (
                  <img src={c.profilePic} className="w-7 h-7 rounded-full object-cover" alt="" />
                ) : (
                  <UserCircleIcon className="w-7 h-7 text-gray-300" />
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-white">{c.username}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 capitalize">
                  {c.role}
                </span>
              </div>
              {isOwner && (
                <button
                  onClick={() => handleRemove(c.userId, c.username)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
