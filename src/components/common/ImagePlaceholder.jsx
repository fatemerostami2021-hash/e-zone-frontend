import { Image } from 'lucide-react';
import './ImagePlaceholder.css';

function ImagePlaceholder({ label = 'Image', aspect = '16 / 9', className = '' }) {
  return (
    <div
      className={`img-placeholder ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <Image size={32} strokeWidth={1.5} />
      <span>{label}</span>
    </div>
  );
}

export default ImagePlaceholder;
