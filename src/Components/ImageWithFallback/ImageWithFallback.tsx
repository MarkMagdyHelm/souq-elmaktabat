import React, { useEffect, useState } from 'react';
import { Image, ImageProps, StyleProp, ImageStyle } from 'react-native';

type Props = {
  uri?: string | null;
  type: string | number | null;
  style?: StyleProp<ImageStyle>;
} & Omit<ImageProps, 'source'>;

const ImageWithFallback: React.FC<Props> = ({ uri, type, style, ...rest }) => {
  const [error, setError] = useState(false);

  const validUri = cleanUri(uri);

  useEffect(() => {
    setError(false);
  }, [uri]);
  console.log('uriuri', uri);

  return (
    <Image
      source={
        !validUri || error
          ? type == 1
            ? require('../../Assets/Images/paperDef.jpg')
            : type == 2
            ? require('../../Assets/Images/InkDef.jpg')
            : require('../../Assets/Images/printDef1.png')
          : { uri: uri ,cache: 'reload' }
      }
      style={style}
      onError={() => {
        console.log('ooooo', uri);

        setError(true);
      }}
      {...rest}
    />
  );
};

export default ImageWithFallback;
const cleanUri = (uri?: string | null) => {
  if (!uri) return null;

  let value = uri.trim();

  if (!value || value === '/' || value === 'undefined' || value === 'null') {
    return null;
  }

  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return null;
  }

  return value;
};
