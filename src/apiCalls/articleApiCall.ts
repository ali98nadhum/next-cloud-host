
import { SingleArticle } from "@/utils/types";
import { Article } from "@prisma/client";


// Get articles based on pageNumber
export async function getArticles(pageNumber: string | undefined): Promise<Article[]> {
    const res = await fetch(
      `http://localhost:3000/api/articles?pageNumber=${pageNumber}` , {
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
      `http://localhost:3000/api/articles/counts`
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
      `http://localhost:3000/api/articles/search?searchText=${searchText}`
    );
  
    if (!res.ok) {
      throw new Error("Faild to fetch articles");
    }
  
    return res.json();
  }


  // Get single article by id
  export async function getArticleById(articleId:string): Promise<SingleArticle>{
    const res = await fetch(`http://localhost:3000/api/articles/${articleId}`,{
      cache: "no-store"
    });
    if(!res.ok){
        throw new Error("Failed to fetch article")
    }
    return res.json()
  }