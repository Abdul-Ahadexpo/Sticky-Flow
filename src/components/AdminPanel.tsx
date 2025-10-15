import { useState, useEffect } from 'react';
import { ref, push, onValue, set, remove } from 'firebase/database';
import { database } from '../firebase';
import { Note, VisitorData } from '../types';
import { LogOut, Plus, Save, Users, StickyNote as StickyNoteIcon } from 'lucide-react';
import VisitorCard from './VisitorCard';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'visitors'>('notes');
  const [mainText, setMainText] = useState('');
  const [hiddenDescription, setHiddenDescription] = useState('');
  const [date, setDate] = useState('');
  const [markWithX, setMarkWithX] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [visitors, setVisitors] = useState<VisitorData[]>([]);

  useEffect(() => {
    const notesRef = ref(database, 'notes');
    const helpRef = ref(database, 'help');
    const visitorsRef = ref(database, 'visitors');

    onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notesArray = Object.entries(data).map(([id, note]) => ({
          id,
          ...(note as Omit<Note, 'id'>),
        }));
        setNotes(notesArray.sort((a, b) => b.createdAt - a.createdAt));
      }
    });

    onValue(helpRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.content) {
        setHelpText(data.content);
      }
    });

    onValue(visitorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const visitorsArray = Object.entries(data).map(([id, visitor]) => ({
          id,
          ...(visitor as Omit<VisitorData, 'id'>),
        }));
        setVisitors(visitorsArray.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setVisitors([]);
      }
    });
  }, []);

  const handleDeleteVisitor = async (visitorId: string) => {
    try {
      const visitorRef = ref(database, `visitors/${visitorId}`);
      await remove(visitorRef);
    } catch (error) {
      console.error('Error deleting visitor:', error);
      alert('Failed to delete visitor. Please try again.');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    const notesRef = ref(database, 'notes');
    await push(notesRef, {
      mainText,
      hiddenDescription,
      date,
      markWithX,
      createdAt: Date.now(),
    });

    setMainText('');
    setHiddenDescription('');
    setDate('');
    setMarkWithX(false);
  };

  const handleSaveHelp = async () => {
    const helpRef = ref(database, 'help');
    await set(helpRef, { content: helpText });
    alert('Help text saved successfully!');
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white font-main-text">Admin Panel</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'notes'
                ? 'bg-yellow-400 text-gray-900 shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            <StickyNoteIcon className="w-5 h-5" />
            Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('visitors')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'visitors'
                ? 'bg-yellow-400 text-gray-900 shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            <Users className="w-5 h-5" />
            Visitors ({visitors.length})
          </button>
        </div>

        {activeTab === 'notes' && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Add Note Form */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Add New Note
            </h2>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Text *
                </label>
                <textarea
                  value={mainText}
                  onChange={(e) => setMainText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hidden Description (Optional)
                </label>
                <textarea
                  value={hiddenDescription}
                  onChange={(e) => setHiddenDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date (DD/MM/YY) *
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="01/01/25"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="markWithX"
                  checked={markWithX}
                  onChange={(e) => setMarkWithX(e.target.checked)}
                  className="w-5 h-5 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                />
                <label htmlFor="markWithX" className="text-sm font-medium text-gray-700">
                  Mark with X
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Add Note
              </button>
            </form>
          </div>

          {/* Help Text Editor */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Save className="w-6 h-6" />
              Edit Help Text
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Help Content
                </label>
                <textarea
                  value={helpText}
                  onChange={(e) => setHelpText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                  rows={10}
                  placeholder="Enter help information..."
                />
              </div>

              <button
                onClick={handleSaveHelp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Save Help Text
              </button>
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            All Notes ({notes.length})
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notes.map((note) => (
              <div key={note.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{note.mainText}</p>
                    {note.hiddenDescription && (
                      <p className="text-sm text-gray-600 mt-1">Hidden: {note.hiddenDescription}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm text-gray-600">{note.date}</span>
                    {note.markWithX && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">X</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
            </div>
          </>
        )}

        {activeTab === 'visitors' && (
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Visitor Analytics</h2>
              <p className="text-gray-400 text-sm mb-4">
                All visitors who have accessed the site are listed below
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Visitors</p>
                  <p className="text-3xl font-bold text-white">{visitors.length}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">With Geolocation</p>
                  <p className="text-3xl font-bold text-white">
                    {visitors.filter((v) => v.geo).length}
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Mobile Users</p>
                  <p className="text-3xl font-bold text-white">
                    {visitors.filter((v) => v.isMobile).length}
                  </p>
                </div>
              </div>
            </div>

            {visitors.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-12 text-center">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No visitors yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {visitors.map((visitor) => (
                  <VisitorCard
                    key={visitor.id}
                    visitor={visitor}
                    onDelete={handleDeleteVisitor}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
