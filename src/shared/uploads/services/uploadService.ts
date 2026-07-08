/**
 * This mock backend has no real file-storage endpoint (json-server can't
 * accept multipart uploads), so a file "upload" here means: read it into a
 * data URL client-side, then hand that string to the caller to persist via
 * a normal JSON PATCH (e.g. companySettingsService.update). The read phase's
 * progress is real (FileReader's own onprogress events) - nothing here is
 * simulated or faked.
 */
export const uploadService = {
  readFileAsDataUrl(file: File, onProgress: (percent: number) => void): { promise: Promise<string>; cancel: () => void } {
    const reader = new FileReader();

    const promise = new Promise<string>((resolve, reject) => {
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      reader.onload = () => {
        onProgress(100);
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(new Error(`Failed to read "${file.name}".`));
      };

      reader.onabort = () => {
        reject(new Error('Upload cancelled.'));
      };

      reader.readAsDataURL(file);
    });

    return { promise, cancel: () => reader.abort() };
  },
};
