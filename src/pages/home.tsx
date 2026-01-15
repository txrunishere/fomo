import { PostCard } from "@/components/post-card";
import { useGetPosts } from "@/lib/react-query/queries";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const Home = () => {
  const [ref, inView] = useInView();

  const {
    data,
    isFetchingNextPage,
    status,
    hasNextPage,
    fetchNextPage,
    error,
  } = useGetPosts();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending") {
    return <p>Loading posts...</p>;
  }

  if (status === "error") {
    return (
      <p>
        {error.message ||
          "an error occurred while fetching posts. Please try again"}
      </p>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-scroll">
      <div className="space-y-4 px-2 py-8">
        {data.pages.map((page, index) => (
          <div key={index} className="flex flex-col gap-4">
            {page.data?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ))}
      </div>
      <div ref={ref}>
        {isFetchingNextPage && <p>Loading...</p>}
        {!hasNextPage && <p>No more posts</p>}
      </div>
    </div>
  );
};
