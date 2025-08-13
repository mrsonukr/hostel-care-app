import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

export interface UploadedImage {
  uri: string;
  mimeType: string;
}

// For profile pictures - 50KB limit
export const compressImageToWebP = async (image: ImagePicker.ImagePickerAsset): Promise<UploadedImage> => {
  let quality = 0.6;
  let uri = image.uri;

  while (quality > 0.05) {
    const result = await manipulateAsync(uri, [{ resize: { width: 400 } }], {
      compress: quality,
      format: SaveFormat.WEBP,
    });

    const blob = await (await fetch(result.uri)).blob();
    if (blob.size / 1024 <= 50) {
      return { uri: result.uri, mimeType: 'image/webp' };
    }

    quality -= 0.05;
    uri = result.uri;
  }

  return { uri, mimeType: image.mimeType || 'image/webp' };
};

// For complaint images - 200KB limit
export const compressComplaintImageToWebP = async (image: ImagePicker.ImagePickerAsset): Promise<UploadedImage> => {
  let quality = 0.8;
  let uri = image.uri;

  while (quality > 0.05) {
    const result = await manipulateAsync(uri, [{ resize: { width: 800 } }], {
      compress: quality,
      format: SaveFormat.WEBP,
    });

    const blob = await (await fetch(result.uri)).blob();
    if (blob.size / 1024 <= 200) {
      return { uri: result.uri, mimeType: 'image/webp' };
    }

    quality -= 0.05;
    uri = result.uri;
  }

  return { uri, mimeType: image.mimeType || 'image/webp' };
};

export const uploadImage = async (image: UploadedImage): Promise<string> => {
  const formData = new FormData();
  formData.append('image', {
    uri: image.uri,
    type: image.mimeType,
    name: `image_${Date.now()}.webp`,
  } as any);

  const response = await fetch('https://hostel.mssonukr.workers.dev/', {
    method: 'POST',
    body: formData,
  });

  const json = await response.json();

  if (response.ok && json.urls?.[0]) {
    return json.urls[0];
  } else {
    throw new Error(json.error || 'Image upload failed.');
  }
};

// For profile pictures - immediate upload
export const pickAndUploadImage = async (): Promise<string | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permission denied. Enable access to photos in settings.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const selected = result.assets[0];
    if (!['image/jpeg', 'image/png'].includes(selected.mimeType || '')) {
      throw new Error('Only JPEG or PNG allowed.');
    }

    try {
      const compressed = await compressImageToWebP(selected);
      const uploadedUrl = await uploadImage(compressed);
      return uploadedUrl;
    } catch (error) {
      throw new Error('Image processing failed.');
    }
  }

  return null;
};

// For complaint images - just pick and compress, don't upload
export const pickComplaintImage = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permission denied. Enable access to photos in settings.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false, // No cropping for complaints
    quality: 1,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const selected = result.assets[0];
    if (!['image/jpeg', 'image/png'].includes(selected.mimeType || '')) {
      throw new Error('Only JPEG or PNG allowed.');
    }

    try {
      const compressed = await compressComplaintImageToWebP(selected);
      return { ...selected, uri: compressed.uri, mimeType: compressed.mimeType };
    } catch (error) {
      throw new Error('Image processing failed.');
    }
  }

  return null;
};

// For complaint images - camera option
export const takeComplaintPhoto = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permission denied. Enable access to camera in settings.');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false, // No cropping for complaints
    quality: 1,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const selected = result.assets[0];
    if (!['image/jpeg', 'image/png'].includes(selected.mimeType || '')) {
      throw new Error('Only JPEG or PNG allowed.');
    }

    try {
      const compressed = await compressComplaintImageToWebP(selected);
      return { ...selected, uri: compressed.uri, mimeType: compressed.mimeType };
    } catch (error) {
      throw new Error('Image processing failed.');
    }
  }

  return null;
};

// Upload multiple complaint images at once
export const uploadComplaintImages = async (images: ImagePicker.ImagePickerAsset[]): Promise<string[]> => {
  const uploadPromises = images.map(async (image) => {
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: image.mimeType,
      name: `complaint_${Date.now()}_${Math.random()}.webp`,
    } as any);

    const response = await fetch('https://hostel.mssonukr.workers.dev/', {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();

    if (response.ok && json.urls?.[0]) {
      return json.urls[0];
    } else {
      throw new Error(json.error || 'Image upload failed.');
    }
  });

  return Promise.all(uploadPromises);
};
