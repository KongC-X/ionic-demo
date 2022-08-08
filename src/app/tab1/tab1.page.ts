import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonSlides) slides: IonSlides;	// 声明轮播图对象

  public pageContentList = [];

  // 给轮播图的参数，和 html 中的 [options] 相对应
  slideOpts = {
    initialSlide : 0,
    speed : 200
  };

  constructor(private router: Router,private alertController: AlertController) {
    this.pageContentList = [{
      title: '解决 Redis、MySQL 缓存双写不一致问题',
      subtitle: '副标题1',
      content: 'redis、mysql 双写缓存不一致： 但是在更新缓存方面，对于更新完数据库，是更新缓存呢，还是删除缓存。又或者是先删除缓存，再更新数据库，其实大家存在很大的争议。目前没有一篇全面的博客，对这几种方案',
      // eslint-disable-next-line max-len
      imgUrl: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5faae06bcd6844a4a5a2c662552d9d14~tplv-k3u1fbpfcp-no-mark:270:270:270:180.awebp?',
      id: 0
    },{
      title: '一份工作 6 年前端的 Git 备忘录 🛠',
      subtitle: '副标题2',
      content: '熟练的使用 git 指令，是一个程序员的基本功，本文记录了我这些年常用的一些 git 操作指令 .....',
      // eslint-disable-next-line max-len
      imgUrl: 'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24d19f0a66904662a3d24276f2208a4f~tplv-k3u1fbpfcp-no-mark:270:270:270:180.awebp?',
      id: 1
    },{
      title: '单点登录的三种实现方式',
      subtitle: '副标题3',
      content: '假如你是企业管理者，你的公司正在使用包括考勤系统、差旅报销系统、在线协同工具等十几甚至几十套不同的软件系统，你的员工是否可以在这些不同的系统中，一次登录全部搞定？',
      // eslint-disable-next-line max-len
      imgUrl: 'https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30509ef8124e402391f4dbe14c8d819d~tplv-k3u1fbpfcp-no-mark:270:270:270:180.awebp?',
      id: 2
    },{
      title: 'ES6 万字极简总结，帮你快速过一遍知识点！',
      subtitle: '副标题4',
      content: '由于常用 ES6 语法不多,时常需要重新查看阮一峰大佬的《ES6 入门》，这次直接抽时间总结出来万字知识点，下次直接花半个小时快速过一下 ES6 所有知识点，谁还敢说我不会 ES6!!!',
      // eslint-disable-next-line max-len
      imgUrl: 'https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7253e994ecf643c2a12cfce1d07b9ade~tplv-k3u1fbpfcp-no-mark:270:270:270:180.awebp?',
      id: 3
    }];
  }

  gotoTab(){
    this.router.navigate(['/tab-detail']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'theme',
      // subHeader: '主题色测试button',
      message: 'This is an alert!',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // 如果想要在一开始就让轮播图自动播放
  ionViewDidEnter() {
    console.log(this.slides);
    this.slides.startAutoplay();
  };


}
