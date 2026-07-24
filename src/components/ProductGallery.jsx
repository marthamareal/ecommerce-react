import { useEffect, useRef, useState } from "react";
import {
    uploadProductImage,
    deleteProductImage,
    setPrimaryImage,
    reorderProductImages,
} from "../services/ProductService";

/**
 * ProductGallery
 *
 * Public: main image + arrow nav + thumbnail strip, keyboard arrow support.
 * Admin (isAdmin=true): hover-to-delete on thumbnails, drag to reorder, star
 * to set cover, "+" tile to add more — all persist immediately per action.
 * While any upload is in flight, admin controls that mutate state are
 * disabled so you can't reorder/delete out from under an in-progress upload.
 */
export default function ProductGallery({ productId, images, onImagesChange, isAdmin }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [uploading, setUploading] = useState([]); // [{ tempId, previewUrl, progress, error }]
    const inputRef = useRef(null);
    const dragIndex = useRef(null);

    const isBusy = uploading.some((u) => !u.error); // true while any upload is actively in-flight

    useEffect(() => {
        if (activeIndex >= images.length) setActiveIndex(0);
    }, [images.length, activeIndex]);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "ArrowRight") goTo(activeIndex + 1);
            if (e.key === "ArrowLeft") goTo(activeIndex - 1);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex, images.length]);

    const goTo = (index) => {
        if (images.length === 0) return;
        const next = (index + images.length) % images.length;
        setActiveIndex(next);
    };

    const handleFiles = async (fileList) => {
        const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));

        const pending = files.map((file) => ({
            tempId: crypto.randomUUID(),
            previewUrl: URL.createObjectURL(file),
            progress: 0,
            error: null,
            file,
        }));
        setUploading((prev) => [...prev, ...pending]);

        for (const item of pending) {
            try {
                const saved = await uploadProductImage(productId, item.file, (pct) => {
                    setUploading((prev) =>
                        prev.map((u) => (u.tempId === item.tempId ? { ...u, progress: pct } : u))
                    );
                });
                onImagesChange([...images, saved]);
            } catch (err) {
                setUploading((prev) =>
                    prev.map((u) => (u.tempId === item.tempId ? { ...u, error: err.message } : u))
                );
                continue;
            }
            URL.revokeObjectURL(item.previewUrl);
            setUploading((prev) => prev.filter((u) => u.tempId !== item.tempId));
        }
    };

    const handleDelete = async (image) => {
        const previous = images;
        onImagesChange(images.filter((img) => img.id !== image.id));
        try {
            await deleteProductImage(productId, image.id);
        } catch (err) {
            onImagesChange(previous);
            alert(err.message);
        }
    };

    const handleSetPrimary = async (image) => {
        const previous = images;
        onImagesChange(images.map((img) => ({ ...img, isPrimary: img.id === image.id })));
        try {
            await setPrimaryImage(productId, image.id);
        } catch (err) {
            onImagesChange(previous);
            alert(err.message);
        }
    };

    const handleDrop = async (index) => {
        const from = dragIndex.current;
        dragIndex.current = null;
        if (from === null || from === index) return;

        const reordered = [...images];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(index, 0, moved);

        const previous = images;
        onImagesChange(reordered);
        try {
            await reorderProductImages(productId, reordered.map((img) => img.id));
        } catch (err) {
            onImagesChange(previous);
            alert(err.message);
        }
    };

    const hasImages = images.length > 0;
    const activeImage = hasImages ? images[activeIndex] : null;

    return (
        <div>
            {/* Main image */}
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group">
                {activeImage ? (
                    <img
                        key={activeImage.id}
                        src={activeImage.url}
                        alt=""
                        className="w-full h-full object-cover animate-fade-in"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => goTo(activeIndex - 1)}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo(activeIndex + 1)}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            {activeIndex + 1} / {images.length}
                        </div>
                    </>
                )}

                {isAdmin && activeImage && !activeImage.isPrimary && (
                    <button
                        type="button"
                        onClick={() => handleSetPrimary(activeImage)}
                        disabled={isBusy}
                        title="Set as cover image"
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-40"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Thumbnail strip */}
            {(images.length > 0 || isAdmin) && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            draggable={isAdmin}
                            onDragStart={() => (dragIndex.current = index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(index)}
                            onClick={() => goTo(index)}
                            className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === activeIndex ? "border-indigo-500" : "border-transparent hover:border-gray-300"
                                }`}
                        >
                            <img src={image.url} alt="" className="w-full h-full object-cover" />
                            {image.isPrimary && (
                                <span className="absolute bottom-0 left-0 right-0 bg-indigo-600/90 text-white text-[9px] text-center py-0.5">
                                    Cover
                                </span>
                            )}
                            {isAdmin && (
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isBusy) handleDelete(image);
                                    }}
                                    className="absolute top-0.5 right-0.5 bg-white/90 rounded-full w-4 h-4 flex items-center justify-center text-gray-500 hover:text-rose-600 text-[10px] leading-none"
                                >
                                    ×
                                </span>
                            )}
                        </button>
                    ))}

                    {uploading.map((item) => (
                        <div key={item.tempId} className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                            <img src={item.previewUrl} alt="" className="w-full h-full object-cover opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                {item.error ? (
                                    <svg className="w-4 h-4 text-rose-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <span className="text-white text-[10px] font-semibold">{item.progress}%</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/40 flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-colors"
                            aria-label="Add image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            handleFiles(e.target.files);
                            e.target.value = "";
                        }}
                    />
                </div>
            )}

            {isAdmin && images.length > 1 && (
                <p className="mt-2 text-xs text-gray-400">Drag thumbnails to reorder · star sets the cover photo</p>
            )}
        </div>
    );
}
