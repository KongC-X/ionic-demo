import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class PhotoService {
  // 定义一个 Photos 数组，其中将包含对使用相机拍摄的每张照片的引用
  public photos: UserPhoto[] = [];
  // 定义一个常量变量作为存储的键
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types, @typescript-eslint/naming-convention
  private PHOTO_STORAGE: string = 'photos';

  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  // 定义一个新的类方法 addNewToGallery 将包含拍摄设备照片并将其保存到文件系统的核心逻辑
  public async addNewToGallery() {
    // Take a photo
    // Camera.getPhoto()它将打开设备的相机并允许我们拍照
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100 // highest quality (0 to 100)
    });

    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    // 在addNewToGallery函数中，将新捕获的照片添加到 Photos 数组的开头
    // this.photos.unshift({
    //   filepath: 'soon...',
    //   webviewPath: capturedPhoto.webPath
    // });

    // 在addNewToGallery函数的末尾添加Storage.set()对保存 Photos 数组的调用。通过在此处添加它，每次拍摄新照片时都会存储照片数组。这样，应用程序用户何时关闭或切换到其他应用程序都无关紧要 - 所有照片数据都会保存。
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  // 保存照片阵列数据后，创建一个调用函数loadSaved()来检索该数据。我们使用相同的键来检索 JSON 格式的照片数组，然后将其解析为一个数组
  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];
    // Display the photo by reading into base64 format
    // eslint-disable-next-line prefer-const

    if(!this.platform.is('hybrid')){
      // eslint-disable-next-line prefer-const
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
      });
    // Web platform only: Load the photo as base64 data
    photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }
}

  // 所选照片首先从照片数组中删除,然后使用 Capacitor Storage API 来更新 Photos 数组的缓存版本,最后使用 Filesystem API 删除实际的照片文件本身
  public async deletePicture(photo: UserPhoto, position: number){
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);
    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }

  // 创建一个新的类方法,我们传入photo对象，它代表新捕获的设备照片
  private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path : fileName,
      data : base64Data,
      directory : Directory.Data
    });

    if(this.platform.is('hybrid')){
      return{
        filepath : savedFile.uri,
        webviewPath : Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else{
      return {
        // Use webPath to display the new image instead of base64 since it's already loaded into memory
        filepath : fileName,
        webviewPath : photo.webPath
      };
    }
}

  // 我们使用内置的 Web API：fetch() 作为一种将文件读取为 blob 格式的简洁方法，然后使用 FileReader 的 readAsDataURL() 将照片 blob 转换为 base64
  private async readAsBase64(photo: Photo) {
      // "hybrid" will detect Cordova or Capacitor
      if(this.platform.is('hybrid')){
        // Read the file into base64 format
        const file = await Filesystem.readFile({
            path : photo.path
          });
        return file.data;
      }
      else{
        // Fetch the photo, read as a blob, then convert to base64 format
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        return await this.convertBlobToBase64(blob) as string;
      }

  }
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
