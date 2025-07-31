"use client";

import { Api } from "@/services/api-client";
import React from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import ReactStories from "react-insta-stories";
import { IStory } from "@/services/stories";

interface Props {
  className?: string;
}

export const Stories: React.FC<Props> = ({ className }) => {
  const [stories, setStories] = React.useState<IStory[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedStory, setSelectedStory] = React.useState<IStory | null>(null);

  React.useEffect(() => {
    async function fetchStories() {
      const data = await Api.stories.getAll();
      setStories(data);
    }
    fetchStories();
  }, []);

  const onClickStory = (story: IStory) => {
    if (story.items.length > 0) {
      setSelectedStory(story);
      setOpen(true);
    }
  };

  const handleStoriesEnd = () => {
    // Defer state update to avoid render-phase conflict
    setTimeout(() => {
      setOpen(false);
    }, 0);
  };

  return (
    <>
      <Container
        className={cn(
          "flex items-center justify-between gap-2 my-10",
          className
        )}
      >
        {stories.length === 0 &&
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-[200px] h-[250px] bg-gray-200 rounded-md animate-pulse"
            />
          ))}

        {stories.map((story) => (
          <img
            key={story.id}
            onClick={() => onClickStory(story)}
            className="rounded-md cursor-pointer"
            height={250}
            width={200}
            src={story.previewImageUrl}
          />
        ))}
      </Container>

      {open && selectedStory && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-[400px] mx-4">
            <button
              className="absolute -top-6 right-0 z-10"
              onClick={() => setOpen(false)}
              aria-label="Close stories"
            >
              <X className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
            </button>

            <ReactStories
              onAllStoriesEnd={handleStoriesEnd}
              stories={selectedStory.items.map((item) => ({
                url: item.sourceUrl,
              }))}
              defaultInterval={3000}
              width="100%"
              height={600}
              storyContainerStyles={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
