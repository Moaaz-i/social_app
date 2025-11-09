import React, { useState, useRef, useCallback } from "react";
import { FiImage, FiX, FiSend } from "react-icons/fi";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const CreatePost = () => {
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const validateImage = useCallback((file) => {
    if (!file) return false;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("kind of file not supported (JPEG, PNG, WebP, GIF)");
      return false;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`Image size should be less than ${MAX_IMAGE_SIZE_MB} MB`);
      return false;
    }

    return true;
  }, []);

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!validateImage(file)) return;

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    },
    [validateImage]
  );

  const removeImage = useCallback(() => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imagePreview]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-right">
        Create New Post
      </h1>

      <Card className="shadow-lg">
        <form className="space-y-4 p-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-right">
              {error}
            </div>
          )}

          {/* Post Content */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                id="post"
                rows={4}
                className="w-full px-4 py-3 text-gray-800 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-right"
                placeholder="What's on your mind?"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={1000}
              />

              {/* Character Counter */}
              <div className="absolute bottom-2 left-2 text-xs text-gray-400">
                {body.length}/1000
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-full max-h-96 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Remove Image"
                >
                  <FiX size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="file"
                ref={fileInputRef}
                accept={ALLOWED_IMAGE_TYPES.join(",")}
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                title="إضافة صورة"
              >
                <FiImage size={20} />
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || (!body.trim() && !selectedImage)}
              loading={isSubmitting}
              icon={<FiSend size={18} className="ml-2" />}
            >
              نشر
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePost;
