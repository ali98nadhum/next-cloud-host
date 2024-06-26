
import { SingleArticle } from "@/utils/types";
import { Article } from "@prisma/client";


// Get articles based on pageNumber
export async function getArticles(pageNumber: string | undefined): Promise<Article[]> {
    const res = await fetch(
      `https://next-cloud-host-ewq0r9dx5-ali98nadhums-projects.vercel.app/api/articles?pageNumber=${pageNumber}` , {
        cache: "no-store"
      }
    );
  
    if (!res.ok) {
      throw new Error("Faild to fetch articles");
    }
  
    return res.json();
  }


// Get articles count
  export async function getArticlesCount(): Promise<number> {
    const res = await fetch(
      `https://next-cloud-host-ewq0r9dx5-ali98nadhums-projects.vercel.app/api/articles/counts`
    );
  
    if (!res.ok) {
      throw new Error("Faild to fetch articles count");
    }
  
    const {countArticle} = await res.json() as {countArticle:number}
    return countArticle;
    
  }


// Get articles based on searchText
  export async function getArticlesBySearch(searchText: string): Promise<Article[]> {
    const res = await fetch(
      `https://next-cloud-host-ewq0r9dx5-ali98nadhums-projects.vercel.app/api/articles/search?searchText=${searchText}`
    );
  
    if (!res.ok) {
      throw new Error("Faild to fetch articles");
    }
  
    return res.json();
  }


  // Get single article by id
  export async function getArticleById(articleId:string): Promise<SingleArticle>{
    const res = await fetch(`https://next-cloud-host-ewq0r9dx5-ali98nadhums-projects.vercel.app/api/articles/${articleId}`,{
      cache: "no-store"
    });
    if(!res.ok){
        throw new Error("Failed to fetch article")
    }
    return res.json()
  }