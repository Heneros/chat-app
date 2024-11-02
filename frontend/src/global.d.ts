declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module "*.css" {
  export default {
    [index: string]: string;
  }
}

declare module '*.css' {
    const content: any;
    export default content;
}
