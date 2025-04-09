"use client"
import React, { useState } from 'react';
import Pageheader from '@/shared/layout-components/page-header/pageheader'
import Seo from '@/shared/layout-components/seo/seo'
import TableSearch from '../components/TableSearch'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';

type User = {
  id: string;
  name: string;
  email: string;
  nftType: string;
  date: string;
  walletAddress: string;
  totalNFTs: number;
  totalSteps: number;
  rewards: number;
  lastActive: string;
  referredBy: string;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">User Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">NFT Type</label>
                <p className="font-medium">{user.nftType}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Registration Date</label>
                <p className="font-medium">{user.date}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Blockchain Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Wallet Address</label>
                <p className="font-medium break-all">{user.walletAddress}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Total NFTs</label>
                <p className="font-medium">{user.totalNFTs}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-4">Activity Information</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <label className="text-sm text-gray-500">Total Steps</label>
              <p className="font-medium text-lg">{user.totalSteps.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <label className="text-sm text-gray-500">Total Rewards</label>
              <p className="font-medium text-lg">{user.rewards} SSB</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <label className="text-sm text-gray-500">Last Active</label>
              <p className="font-medium text-lg">{user.lastActive}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const defaultData: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    nftType: 'Gold',
    date: '2024-02-20',
    walletAddress: '0x1234...5678',
    totalNFTs: 3,
    totalSteps: 125000,
    rewards: 500,
    lastActive: '2024-04-15',
    referredBy: 'Jane Smith'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    nftType: 'Silver',
    date: '2024-02-19',
    walletAddress: '0x5678...9012',
    totalNFTs: 2,
    totalSteps: 75000,
    rewards: 300,
    lastActive: '2024-04-14',
    referredBy: 'Mike Johnson'
  },
  // Add more sample data as needed
];

const UsersTable = () => {
  const [data, setData] = useState(defaultData);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleEdit = (user: User) => {
    // TODO: Implement edit functionality
    console.log('Edit user:', user);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setData(data.filter(user => user.id !== userId));
    }
  };

  const columnHelper = createColumnHelper<User>();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => (
        <button
          onClick={() => setSelectedUser(info.row.original)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('nftType', {
      header: 'NFT Type',
      cell: info => {
        const nftType = info.getValue();
        let badgeClass = 'px-2 py-1 rounded-full text-xs ';
        switch (nftType) {
          case 'Gold':
            badgeClass += 'bg-yellow-100 text-yellow-800';
            break;
          case 'Silver':
            badgeClass += 'bg-gray-100 text-gray-800';
            break;
          default:
            badgeClass += 'bg-blue-100 text-blue-800';
        }
        return <span className={badgeClass}>{nftType}</span>;
      },
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('referredBy', {
      header: 'Referred By',
      cell: info => {
        const referredBy = info.getValue();
        return referredBy ? (
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
            {referredBy}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  return (
    <div>
      <Seo title={"Users Management"} />
      <Pageheader currentpage="Users Management" activepage="Tables" mainpage="Users" />
      
      <div className="box p-5">
        <div className="mb-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Users List</h2>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                table.setPageSize(Number(e.target.value));
              }}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {[5, 10, 20].map(size => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>

          <TableSearch
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            columns={table.getAllColumns()}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      <span className="ml-2">
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
            <span className="ml-2">
              ({table.getPrePaginationRowModel().rows.length} total records)
            </span>
          </div>
        </div>
      </div>

      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersTable; 