import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Move, RotateCcw, Check } from "lucide-react";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedFile: File, croppedPreviewUrl: string) => void;
}

const CROP_CONTAINER_SIZE = 280; // Size of the circular crop viewport in pixels
const OUTPUT_SIZE = 600; // Output cropped image resolution

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const imgRef = useRef<HTMLImageElement | null>(null);

  // Reset pan & zoom when image changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  if (!imageSrc) return null;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImgDimensions({ width: naturalWidth, height: naturalHeight });
  };

  // Mouse / Touch Dragging
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setPan({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleCrop = () => {
    if (!imgRef.current || !imgDimensions.width || !imgDimensions.height) return;

    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Base scale to cover crop container
    const baseScale = Math.max(
      CROP_CONTAINER_SIZE / imgDimensions.width,
      CROP_CONTAINER_SIZE / imgDimensions.height
    );
    const scaleFactor = baseScale * zoom;

    const displayedWidth = imgDimensions.width * scaleFactor;
    const displayedHeight = imgDimensions.height * scaleFactor;

    const imgLeft = (CROP_CONTAINER_SIZE - displayedWidth) / 2 + pan.x;
    const imgTop = (CROP_CONTAINER_SIZE - displayedHeight) / 2 + pan.y;

    // Source coordinates on original image
    const srcX = (0 - imgLeft) / scaleFactor;
    const srcY = (0 - imgTop) / scaleFactor;
    const srcW = CROP_CONTAINER_SIZE / scaleFactor;
    const srcH = CROP_CONTAINER_SIZE / scaleFactor;

    // Draw circular clip on output canvas if desired or high quality square
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], "profile-cropped.jpg", {
            type: "image/jpeg",
          });
          const previewUrl = canvas.toDataURL("image/jpeg", 0.92);
          onCropComplete(croppedFile, previewUrl);
          onClose();
        }
      },
      "image/jpeg",
      0.92
    );
  };

  // Base scale calculation for inline styles
  const baseScale =
    imgDimensions.width && imgDimensions.height
      ? Math.max(
          CROP_CONTAINER_SIZE / imgDimensions.width,
          CROP_CONTAINER_SIZE / imgDimensions.height
        )
      : 1;

  const currentWidth = imgDimensions.width * baseScale;
  const currentHeight = imgDimensions.height * baseScale;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Move className="w-5 h-5 text-primary" />
            Crop Profile Picture
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Drag image to center your face inside the circle, use slider to zoom in or out.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4 space-y-6 select-none">
          {/* Crop Container Viewport */}
          <div className="relative flex items-center justify-center">
            {/* Outer dark backdrop frame */}
            <div
              className="relative overflow-hidden rounded-full border-4 border-primary/80 shadow-2xl cursor-grab active:cursor-grabbing bg-black/60"
              style={{
                width: `${CROP_CONTAINER_SIZE}px`,
                height: `${CROP_CONTAINER_SIZE}px`,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Image element being panned & zoomed */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={handleImageLoad}
                draggable={false}
                style={{
                  width: `${currentWidth}px`,
                  height: `${currentHeight}px`,
                  maxWidth: "none",
                  maxHeight: "none",
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
                className="absolute inset-0 m-auto pointer-events-none"
              />

              {/* Grid Overlay Guide */}
              <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-full flex items-center justify-center">
                <div className="w-full h-[1px] bg-white/10" />
                <div className="h-full w-[1px] bg-white/10 absolute" />
              </div>
            </div>
          </div>

          {/* Controls: Zoom & Reset */}
          <div className="w-full space-y-3 px-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                <ZoomOut className="w-3.5 h-3.5" /> Zoom
              </span>
              <span className="font-mono text-primary font-bold">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.05}
                onValueChange={(vals) => setZoom(vals[0])}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs h-7 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset Position
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCrop} className="bg-primary text-primary-foreground">
            <Check className="w-4 h-4 mr-1.5" /> Apply & Save Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
