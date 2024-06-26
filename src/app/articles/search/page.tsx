import { getArticlesBySearch } from "@/apiCalls/articleApiCall";
import ArticleItem from "@/components/articles/ArticleItem";
import { Article } from "@prisma/client";

interface SearchArticlePageProps {
  searchParams: { searchText: string };
}

const SearchPage = async ({ searchParams }: SearchArticlePageProps) => {
  const articles: Article[] = await getArticlesBySearch(
    searchParams.searchText
  );
  return (
    <section className="fix-height container m-auto px-5">
      {articles.length === 0 ? (
        <h2 className="text-gray-800 text-2xl font-bold p-5">لا توجد نتائج</h2>
      ) : (
        <>
          <h1 className="text-2xl font-bold">
            Articles based on
            <span className="ms-1 text-green-700 text-3xl font-bold">
              {searchParams.searchText}
            </span>
          </h1>
          <div className="flex items-center justify-center flex-wrap gap-7">
            {articles.map((item) => (
              <ArticleItem key={item.id} article={item} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default SearchPage;
