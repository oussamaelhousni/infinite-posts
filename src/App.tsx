import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
const fetchPosts = async (page: number = 1) => {
  const limit = 10;
  const res = await fetch(
    `https://dummyjson.com/posts?limit=${limit}&skip=${limit * (page - 1)}`
  );
  return res.json();
};

let counter = 0;

function App() {
  const { ref, inView } = useInView();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam }) => {
        return fetchPosts(pageParam);
      },
      initialPageParam: 1,
      getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
        return lastPageParam + 1;
      },
    });
  console.log("counting re-renders", (counter += 1));
  const allPosts = data?.pages.flatMap((page: any) => page.posts) ?? [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <div>Loading....</div>;
  }
  return (
    <div className="min-h-screen h-auto bg-zinc-950">
      <div className="max-w-4xl font-semibold mx-auto py-8 px-4">
        <h1 className="text-4xl text-white">Infinite Posts</h1>

        <div className="flex flex-col gap-6 mt-8">
          {allPosts?.map((post: any) => {
            return <Post {...post} key={post.id} />;
          })}
        </div>
        {!isFetchingNextPage && <div ref={ref} />}
      </div>
    </div>
  );
}

function Post({ id, title, body }: { id: any; title: string; body: string }) {
  return (
    <div className="bg-zinc-800 p-4 rounded-md">
      <h2 className="text-xl font-semibold text-zinc-400 mb-4">
        {id} - {title}
      </h2>
      <p className="text-sm text-zinc-100">{body}</p>
    </div>
  );
}
export default App;
