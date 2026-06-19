import React from 'react';

const MockNextImage = (props: React.ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}) => {
  const { fill, priority, sizes, ...rest } = props;
  return <img {...rest} />;
};

export default MockNextImage;
