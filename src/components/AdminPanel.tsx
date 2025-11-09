import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, set, remove } from 'firebase/database';
import { database } from '../firebase';
import { Note, VisitorData } from '../types';
import { LogOut, Plus, Save, Users, StickyNote as StickyNoteIcon, Upload, X } from 'lucide-react';
import VisitorCard from './VisitorCard';
import { uploadImageToImgbb } from '../utils/imgbbUpload';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'visitors'>('notes');
  const [mainText, setMainText] = useState('');
  const [hiddenDescription, setHiddenDescription] = useState('');
  const [hiddenType, setHiddenType] = useState<'text' | 'image'>('text');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      setUploadError('No image selected');
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const url = await uploadImageToImgbb(selectedImage);
      setUploadedImageUrl(url);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hiddenType === 'text' && !hiddenDescription && hiddenType === 'text') {
      alert('Please enter hidden text or select image mode');
      return;
    }

    if (hiddenType === 'image' && !uploadedImageUrl) {
      alert('Please upload an image');
      return;
    }

    const notesRef = ref(database, 'notes');
    await push(notesRef, {
      mainText,
      ...(hiddenType === 'text' && { hiddenDescription, hiddenType: 'text' }),
      ...(hiddenType === 'image' && { hiddenImageUrl: uploadedImageUrl, hiddenType: 'image' }),
      date,
      markWithX,
      createdAt: Date.now(),
    });

    setMainText('');
    setHiddenDescription('');
    setDate('');
    setMarkWithX(false);
    setHiddenType('text');
    setSelectedImage(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setUploadError(null);
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
                  Hidden Content Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="text"
                      checked={hiddenType === 'text'}
                      onChange={(e) => {
                        setHiddenType(e.target.value as 'text' | 'image');
                        setUploadedImageUrl(null);
                        setImagePreview(null);
                        setSelectedImage(null);
                      }}
                      className="w-4 h-4 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                    />
                    <span className="text-sm text-gray-700">Text Mode</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="image"
                      checked={hiddenType === 'image'}
                      onChange={(e) => {
                        setHiddenType(e.target.value as 'text' | 'image');
                        setHiddenDescription('');
                      }}
                      className="w-4 h-4 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                    />
                    <span className="text-sm text-gray-700">Image Mode</span>
                  </label>
                </div>
              </div>

              {hiddenType === 'text' && (
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
              )}

              {hiddenType === 'image' && (
                <div className="space-y-3 p-4 bg-gray-100 rounded-lg">
                  {!uploadedImageUrl ? (
                    <>
                      <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center justify-center gap-2 w-full text-gray-700 hover:text-gray-900 font-medium"
                        >
                          <Upload className="w-5 h-5" />
                          Click to select image
                        </button>
                      </div>

                      {imagePreview && (
                        <div className="space-y-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleUploadImage}
                              disabled={isUploadingImage}
                              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
                            >
                              {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="flex items-center justify-center gap-1 px-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {uploadError && (
                        <div className="text-red-600 text-sm font-medium">
                          {uploadError}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 font-medium">Image uploaded successfully!</p>
                      <img
                        src={uploadedImageUrl}
                        alt="Uploaded"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="w-full flex items-center justify-center gap-2 px-3 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
              )}

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
                    {note.hiddenType === 'text' && note.hiddenDescription && (
                      <p className="text-sm text-gray-600 mt-1">Hidden Text: {note.hiddenDescription}</p>
                    )}
                    {note.hiddenType === 'image' && note.hiddenImageUrl && (
                      <p className="text-sm text-gray-600 mt-1">Hidden Image: {note.hiddenImageUrl}</p>
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

            {visitors.length > 0 && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg shadow-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-red-300 mb-2">Danger Zone</h3>
                    <p className="text-red-200 text-sm mb-3">
                      Reset all visitor records to force everyone to login again. This action is permanent and cannot be undone.
                    </p>
                    <button
                      onClick={handleResetAllVisitors}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Reset All Visitors
                    </button>
                  </div>
                </div>
              </div>
            )}

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
