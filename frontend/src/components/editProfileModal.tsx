'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthViewModel';
import { updateProfile } from 'firebase/auth';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onUpdate: (newName: string) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  onUpdate,
}: EditProfileModalProps) {
  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (name === currentName) {
      onClose();
      return;
    }

    setIsLoading(true);

    try {
      // Update Firebase display name
      if (user) {
        await updateProfile(user, {
          displayName: name,
        });
      }

      // Call the parent component's update handler
      await onUpdate(name);

      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-lg shadow-2xl max-w-md w-full p-6 border border-purple-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none cursor-pointer"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-purple-300 font-semibold mb-2"
            >
              Display Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-purple-500 focus:outline-none focus:border-pink-500 transition"
              placeholder="Enter your name"
              disabled={isLoading}
              maxLength={50}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition disabled:opacity-50 cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white hover:scale-105 hover:shadow-xl transition disabled:opacity-50 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
