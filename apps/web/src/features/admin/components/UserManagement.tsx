import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { apiClient } from '@/api/client';
import { useState } from 'react';

import {
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';

export const UserManagement = () => {
  const queryClient =
    useQueryClient();

  const [showForm, setShowForm] =
    useState(false);

  const {
    data: users,
    isLoading,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      apiClient
        .get('/api/v1/users')
        .then(
          (res) =>
            res.data.data.users
        ),
  });

  const createUser =
    useMutation({
      mutationFn: (
        data: any
      ) =>
        apiClient
          .post(
            '/api/v1/users',
            data
          )
          .then(
            (res) =>
              res.data
          ),

      onSuccess: () =>
        queryClient.invalidateQueries(
          {
            queryKey: [
              'users',
            ],
          }
        ),
    });

  const deleteUser =
    useMutation({
      mutationFn: (
        id: string
      ) =>
        apiClient
          .delete(
            `/api/v1/users/${id}`
          )
          .then(
            (res) =>
              res.data
          ),

      onSuccess: () =>
        queryClient.invalidateQueries(
          {
            queryKey: [
              'users',
            ],
          }
        ),
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <div className="flex items-center gap-3">
            <Users className="text-cyan-400" />

            <h2 className="text-4xl font-bold text-white">
              Staff Accounts
            </h2>
          </div>

          <p className="text-slate-400 mt-2">
            Manage restaurant employees
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(true)
          }
          className="
            px-5
            py-3
            rounded-2xl
            bg-cyan-500
            text-slate-950
            font-semibold
            flex
            items-center
            gap-2
            hover:bg-cyan-400
            transition-all
            shadow-lg
            shadow-cyan-500/20
          "
        >
          <UserPlus size={18} />
          Add Staff
        </button>

      </div>

      {/* Table */}
      <div
        className="
          bg-slate-900/60
          backdrop-blur-xl
          border
          border-white/10
          rounded-3xl
          overflow-hidden
        "
      >
        <table className="min-w-full">

          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                Name
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                Email
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                Role
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">

            {users?.map(
              (user: any) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-5 text-white font-medium">
                    {user.name}
                  </td>

                  <td className="px-6 py-5 text-slate-300">
                    {user.email}
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          user.role === 'ADMIN'
                            ? 'bg-red-500/20 text-red-300'
                            : user.role === 'MANAGER'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : user.role === 'CHEF'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }
                      `}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete ${user.name}?`
                          )
                        ) {
                          deleteUser.mutate(
                            user.id
                          );
                        }
                      }}
                      className="
                        text-red-400
                        hover:text-red-300
                        transition-colors
                      "
                    >
                      <Trash2
                        size={18}
                      />
                    </button>
                  </td>
                </tr>
              )
            )}

          </tbody>
        </table>
      </div>

      {showForm && (
        <UserForm
          onSave={(
            data: any
          ) => {
            createUser.mutate(
              data
            );

            setShowForm(
              false
            );
          }}
          onCancel={() =>
            setShowForm(
              false
            )
          }
        />
      )}
    </div>
  );
};

const UserForm = ({
  onSave,
  onCancel,
}: any) => {
  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [role, setRole] =
    useState('WAITER');

  return (
    <div
      className="
        fixed inset-0
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-slate-900/95
          backdrop-blur-2xl
          border border-white/10
          rounded-3xl
          p-8
          max-w-md
          w-full
        "
      >
        <h3 className="text-2xl font-bold text-white mb-6">
          Add Staff Member
        </h3>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="
              w-full
              px-4
              py-3
              rounded-xl
              bg-white/5
              border border-white/10
              text-white
              placeholder:text-slate-500
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-500
            "
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="
              w-full
              px-4
              py-3
              rounded-xl
              bg-white/5
              border border-white/10
              text-white
              placeholder:text-slate-500
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-500
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              px-4
              py-3
              rounded-xl
              bg-white/5
              border border-white/10
              text-white
              placeholder:text-slate-500
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-500
            "
          />

          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value
              )
            }
            className="
              w-full
              px-4
              py-3
              rounded-xl
              bg-white/5
              border border-white/10
              text-white
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-500
            "
          >
            <option value="WAITER">
              Waiter
            </option>

            <option value="CHEF">
              Chef
            </option>

            <option value="MANAGER">
              Manager
            </option>

            <option value="ADMIN">
              Admin
            </option>
          </select>

          <div className="flex gap-3 justify-end pt-4">

            <button
              onClick={onCancel}
              className="
                px-5
                py-3
                rounded-xl
                border border-white/10
                text-slate-300
                hover:bg-white/5
              "
            >
              Cancel
            </button>

            <button
              onClick={() =>
                onSave({
                  name,
                  email,
                  password,
                  role,
                })
              }
              className="
                px-5
                py-3
                rounded-xl
                bg-cyan-500
                text-slate-950
                font-semibold
                hover:bg-cyan-400
              "
            >
              Save
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};