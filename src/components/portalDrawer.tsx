import dynamic from "next/dynamic";
export const PortalDraw = dynamic(
  () =>
    import(
      /* webpackChunkName: "DrawerContent" */
      "./drawerContent"
    ),
    {ssr:false}
);
