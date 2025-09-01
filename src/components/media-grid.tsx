import {getAllMedia} from "@/actions";
import MasonryGrid from "@/components/media/masonry-grid";

// Constants
const MEDIA_PAGE_SIZE = 50;
const INITIAL_PAGE = 1;

export default async function MediaGrid() {
  try {
    const result = await getAllMedia({
      page: INITIAL_PAGE,
      pageSize: MEDIA_PAGE_SIZE,
    });

    if (!result.success) {
      return (
        <div className="py-24 text-center">
          <h3 className="mb-2 text-lg">
            Oops, failed to load media. Please try again.
          </h3>
          <p className="text-gray-500">
            {result.error?.message ||
              "Something went wrong while loading your media."}
          </p>
        </div>
      );
    }

    if (!result.data?.media) {
      return (
        <div className="py-24 text-center">
          <h3 className="mb-2 text-lg">No media found</h3>
          <p className="text-gray-500">
            Upload your first image or video to get started.
          </p>
        </div>
      );
    }

    return <MasonryGrid media={result.data.media} />;
  } catch (error) {
    console.error("Failed to load media grid:", error);
    return (
      <div className="py-24 text-center">
        <h3 className="mb-2 text-lg">Unexpected error occurred</h3>
        <p className="text-gray-500">
          Please refresh the page or contact support if the problem persists.
        </p>
      </div>
    );
  }
}
