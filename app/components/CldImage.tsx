import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { AdvancedImage } from '@cloudinary/react';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'tamas-demo',
  },
});

const CldImage = ({ publicId }: any) => {
  const myImage = cld
    .image(publicId)
    .resize(
      thumbnail().width(250).height(250).zoom(0.75).gravity(focusOn(face()))
    )
    .delivery(format('auto'))
    .delivery(quality('auto'));
  return (
    <AdvancedImage
      cldImg={myImage}
      className="max-w-sm rounded-lg shadow-2xl"
    />
  );
};
export default CldImage;
