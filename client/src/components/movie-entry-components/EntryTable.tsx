import { useEffect, useRef, useMemo, useState } from "react";
import type { Entry } from "../../types";
import EditModal from "./EditModal";
import axios from 'axios';

const EntryTable = () => {
  // Ref to track the scrollable table container
  const containerRef = useRef<HTMLDivElement>(null);

  // State variables for search, filter, pagination, loading, editing
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [loadingMoreData, setLoadingMoreData] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initial data fetch
  useEffect(() => {
    setLoadingData(true);

    const fetchData = async () => {
      try {
        const response = await axios.get<Entry[]>("http://localhost:5000/api/entries", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEntries(response.data);
      } catch (err: any) {
        console.log(err.message || "Error fetching data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Function to load more entries for pagination
  const loadMoreEntries = async () => {
    if (loadingMoreData) return;
    setLoadingMoreData(true);

    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      ...(searchQuery && { search: searchQuery }),
      ...(typeFilter && { type: typeFilter }),
    });

    const res = await fetch(`http://localhost:5000/api/entries?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    // If no data returned, stop further loading
    if (data.length === 0) setHasMore(false);
    else {
      setEntries((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    }

    setLoadingMoreData(false);
  };

  // Scroll listener for infinite scrolling
  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      if (!container || loadingMoreData || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      // If near bottom, load more entries
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        loadMoreEntries();
      }
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [loadMoreEntries, loadingMoreData, hasMore]);

  // Filter entries by search and type
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter ? entry.type === typeFilter : true;
      return matchesSearch && matchesType;
    });
  }, [entries, searchQuery, typeFilter]);

  // Get unique types (Movie, TV Show) for the filter dropdown
  const uniqueTypes = [...new Set(entries.map((entry) => entry.type))];

  // Handle opening the edit modal with selected entry
  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setIsEditOpen(true);
  };

  // Handle form submission from EditModal to update an entry
  const handleUpdateSubmit = async (updated: Entry) => {
    setIsUpdating(true);

    try {
      const response = await axios.put<Entry>(`http://localhost:5000/api/movies/${updated.id}`, updated, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Replace updated entry in the list
      setEntries((prev) => prev.map((e) => (e.id === updated.id ? response.data : e)));
    } catch (err: any) {
      console.error("Failed to update:", err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete action with confirmation
  const handleDelete = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this entry?");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Remove entry from list
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Failed to delete entry:", error);
      alert("Something went wrong while deleting the entry.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-5 md:p-20 min-h-screen bg-gradient-to-tr from-blue-100 via-white to-pink-100">

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by Title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full sm:max-w-sm"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full sm:max-w-sm"
        >
          <option value="">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Table Container with Scroll */}
      <div ref={containerRef} className="overflow-x-auto border rounded shadow-sm" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-sm text-left">
            <tr>
              {["Title", "Type", "Director", "Budget", "Location", "Duration", "Year/Time", "Actions"].map((header) => (
                <th key={header} className="px-4 py-2 font-medium text-gray-700">{header}</th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  {loadingData ? 'Loading Entries...' : 'No entries found.'}
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{entry.title}</td>
                  <td className="px-4 py-2">{entry.type}</td>
                  <td className="px-4 py-2">{entry.director}</td>
                  <td className="px-4 py-2">${entry.budget}</td>
                  <td className="px-4 py-2">{entry.location}</td>
                  <td className="px-4 py-2">{entry.duration}</td>
                  <td className="px-4 py-2">{entry.yearOrTime}</td>
                  <td className="px-4 py-2 space-x-2">
                    {/* Update Button */}
                    <button
                      onClick={() => handleEdit(entry)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Update'}
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Loader for infinite scroll */}
        {loadingMoreData && (
          <div className="text-center py-4 text-sm text-gray-600">Loading more...</div>
        )}
      </div>

      {/* Edit Modal Component */}
      <EditModal
        entry={editingEntry}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdateSubmit}
      />
    </div>
  );
};

export default EntryTable;
