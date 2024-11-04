declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}


// src/declarations.d.ts
declare module 'echarts-for-react' {
  import { EChartsOption } from 'echarts';
  import { FC } from 'react';

  interface EChartsReactProps {
    option: EChartsOption;
    echarts: any;
  }

  const EChartsReact: FC<EChartsReactProps>;
  export default EChartsReact;
}
