// in your webpack.d.ts
declare module "*.gql" {
  const content: any;

  export default content;
}

declare module "*.graphql" {
  const content: any;

  export default content;
}
