declare module 'front-matter' {
  interface FrontMatterResult<T> {
    attributes: T;
    body: string;
    bodyBegin: number;
    frontmatter: string;
  }

  export default function frontMatter<T>(input: string): FrontMatterResult<T>;
}
