import {getMedia} from "@/actions";
import NotFound from "@/app/not-found";
import StudioClient from "@/components/studio/studio-client";
import { RouteParams } from "@/types/global";

const Studio = async ({params}: RouteParams) => {
  const {id} = await params;
  const media = await getMedia({id});

  if (!media.data) {
    return <NotFound />;
  }

  return (
    <div className="h-full flex flex-col justify-center">
      <StudioClient media={media.data} />
    </div>
  );
};

export default Studio;
