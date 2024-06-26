import ArticleItem from "@/components/articles/ArticleItem";
import Pagination from "@/components/articles/Pagination";
import SearchArticleinput from "@/components/articles/SearchArticleinput";
import { Article } from "@prisma/client";
import {getArticles , getArticlesCount} from "@/apiCalls/articleApiCall"
import { articlePerPage } from "@/utils/constants";

interface ArticlesPageProps {
  searchParams: { pageNumber: string };
}



const ArticlesPage = async ({ searchParams }: ArticlesPageProps) => {
  const { pageNumber } = searchParams;
  

  const data: Article[] = await getArticles(pageNumber);
  const count: number = await getArticlesCount();
  const pages = Math.ceil(count / articlePerPage)

  return (
    <section className="container m-auto px-5 fix-height">
      <SearchArticleinput />
      <div className="flex items-center justify-center flex-wrap gap-7">
        {data.map((item) => (
          <ArticleItem article={item} key={item.id} />
        ))}
      </div>
      <Pagination pageNumber={parseInt(pageNumber)} route="/articles" pages={pages} />
    </section>
  );
};

export default ArticlesPage;
