import React, { useEffect, useState } from 'react';
import { Image, ImageProps, StyleProp, ImageStyle } from 'react-native';

type Props = {
  uri?: string | null;
  type: string | number | null;
  style?: StyleProp<ImageStyle>;
} & Omit<ImageProps, 'source'>;

const ImageWithFallback: React.FC<Props> = ({
  uri,
  type,
  style,
  ...rest
}) => {
  const [error, setError] = useState(false);

  const validUri = cleanUri(uri);

  useEffect(() => {
    setError(false);
  }, [uri]);

  console.log('uriuri', uri);

  const getSource = () => {
    if (!validUri || error) {
      return getFallback(type);
    }

    return {
      uri: validUri,
      cache: 'reload',
    };
  };

  return (
    <Image
      source={getSource()}
      style={style}
      onError={() => setError(true)}
      {...rest}
      resizeMode="contain"
    />
  );
};

export default ImageWithFallback;

/* ---------------- HELPERS ---------------- */

const cleanUri = (uri?: string | null) => {
  if (!uri) return null;

  let value = uri.trim();

  if (
    !value ||
    value === '/' ||
    value === 'undefined' ||
    value === 'null'
  ) {
    return null;
  }

  const isHttp =
    value.startsWith('http://') || value.startsWith('https://');

  const isLocal =
    value.startsWith('file://') || value.startsWith('content://');

  if (!isHttp && !isLocal) {
    return null;
  }

  return value;
};

const getFallback = (type: string | number | null) => {
  if (type == 1) {
    return require('../../Assets/Images/paperDef.jpg');
  }

  if (type == 2) {
    return require('../../Assets/Images/InkDef.jpg');
  }

  if (type == 3) {
    return require('../../Assets/Images/printDef1.png');
  }

  return require('../../Assets/Images/default-image.webp');
};