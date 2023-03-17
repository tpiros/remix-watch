export const openUploadWidget = (options: any, callback: any) => {
  return (window as any).cloudinary.openUploadWidget(options, callback);
};

const UploadWidget = ({ callback }: any) => {
  const configureAndOpenWidget = () => {
    const presets = ['tag-as-coffee', 'preset-1', 'preset-2'];
    const getUploadPresets = (callback: any) => callback(presets);
    const myUploadWidget = openUploadWidget(
      {
        cloudName: 'tamas-demo',
        uploadPreset: 'imagecon-uw',
        sources: ['local', 'url', 'camera'],
        showAdvancedOptions: true,
        multiple: false,
        getUploadPresets,
      },
      callback
    );
    myUploadWidget.open();
  };
  return (
    <button
      id="upload_widget"
      className="cloudinary-button btn btn-primary"
      onClick={configureAndOpenWidget}
    >
      Upload a profile picture
    </button>
  );
};
export default UploadWidget;
