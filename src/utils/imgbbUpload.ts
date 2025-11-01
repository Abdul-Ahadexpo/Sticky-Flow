const IMGBB_API_KEY = '4de6da8fb3dc495d860ad7720cbf846a';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';
const MAX_FILE_SIZE = 32 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export interface UploadProgress {
  isLoading: boolean;
  error: string | null;
  imageUrl: string | null;
}

export async function uploadImageToImgbb(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file selected');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 32MB limit');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Use JPEG, PNG, GIF, or WebP');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', IMGBB_API_KEY);

  try {
    const response = await fetch(IMGBB_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('Upload unsuccessful');
    }

    return data.data.url;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    throw new Error('Upload failed: Unknown error');
  }
}
