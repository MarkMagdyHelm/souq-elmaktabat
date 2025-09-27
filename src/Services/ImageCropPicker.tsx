import ImagePicker from 'react-native-image-crop-picker';


export const openAPPCamera = async (type: any = "photo") => {
  try {
    const image = await ImagePicker.openCamera({
      mediaType: "photo",
      cropping:  true 
    });  
    console.log('==========sss==========================');
    console.log(image);
    console.log('====================================');
    return {
      name: image.path.split("/").slice(-1)[0],
      type: image.mime,
      uri: image.path,
    };
  } catch (error) {
    console.log('Camera error:', error);
    return null;
  }
};

export const openAPPPicker = async (type: any = "photo") => {
  try {
    const image = await ImagePicker.openPicker({
      cropping: true,
      multiple: false,
      mediaType: type,
    });

   
 return {
      name: image.path.split("/").slice(-1)[0],
      type: image.mime,
      uri: image.path,
    };
        
  } catch (error) {
    console.log('Picker error:', error);
    return null;
  }
};

export const clearImages = ImagePicker.clean().then(() => {
  console.log('removed all tmp images from tmp directory');
}).catch(e => {
  console.log('====================================');
  console.log(e);
  console.log('====================================');
});


