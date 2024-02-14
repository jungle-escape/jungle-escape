// <reference types="vite-plugin-svgr/client" />
declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}
