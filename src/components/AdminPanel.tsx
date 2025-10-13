import { useState, useEffect } from 'react';
import { ref, push, onValue, set } from 'firebase/database';
import { database } from '../firebase';
import { Note, HelpText } from '../types';
import { LogOut, Plus, Save } from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [mainText, setMainText] = useState('');
  const [hiddenDescription, setHiddenDescription] = useState('');
  const [date, setDate] = useState('');
  const [markWithX, setMarkWithX] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const notesRef = ref(database, 'notes');
    const helpRef = ref(database, 'help');

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
  }, []);

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
      <div className="max-w-6xl mx-auto">
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

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Add Note Form */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6 text-yellow-400" />
              Add New Note
            </h2>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Main Text *
                </label>
                <textarea
                  value={mainText}
                  onChange={(e) => setMainText(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hidden Description (Optional)
                </label>
                <textarea
                  value={hiddenDescription}
                  onChange={(e) => setHiddenDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date (DD/MM/YY) *
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="01/01/25"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="markWithX"
                  checked={markWithX}
                  onChange={(e) => setMarkWithX(e.target.checked)}
                  className="w-5 h-5 text-yellow-400 border-gray-600 rounded focus:ring-yellow-400 bg-gray-700"
                />
                <label htmlFor="markWithX" className="text-sm font-medium text-gray-300">
                  Mark with Bloody X
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors shadow-lg"
              >
                Add Note
              </button>
            </form>
          </div>

          {/* Help Text Editor */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Save className="w-6 h-6 text-green-400" />
              Edit Help Text
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Help Content
                </label>
                <textarea
                  value={helpText}
                  onChange={(e) => setHelpText(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                  rows={10}
                  placeholder="Enter help information..."
                />
              </div>

              <button
                onClick={handleSaveHelp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg"
              >
                Save Help Text
              </button>
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            All Notes ({notes.length})
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No notes yet</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-white">{note.mainText}</p>
                      {note.hiddenDescription && (
                        <p className="text-sm text-gray-400 mt-1">Hidden: {note.hiddenDescription}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm text-gray-400 font-date-text">{note.date}</span>
                      {note.markWithX && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">X</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
