<template>
  <div class="upload-img" v-if="!cardInfo.picture">
    <label>
      <input type="file"   name="image"  style="display: none" accept="image/*"   @change="onUpload"  multiple="multiple"/>
      <div class="upload-img-content">
        <img src="../../static/img/icon_touxiang.png" alt="">
      </div>
      <span v-if="isPicture" style="color: red;font-size:0.24rem;margin-top: 100px;margin-left: 35px">上传本人照片</span>
    </label>
  </div>
</template>

<script>
    export default {
        name: "trst",
      data(){
         return{
           file:'',
         }
      },
      methods:{
        onUpload() {
          var that = this;
          var file = event.target.files[0] || event.dataTransfer.files[0];
          lrz(file, {
            width: 500
            //quality: 0.8    //自定义使用压缩方式
          })
            .then(function (rst) {
              // alert('2')
              that.file = rst.formData;//输出bs64用rst.bs64
              that.sendImg()//执行上传函数
              //成功时执行
            }).catch(function (error) {
            // alert('3')
            //失败时执行
          }).always(function (rst) {
            // alert('4')
            //不管成功或失败，都会执行
          })
        },
      }
    }
</script>

<style scoped>

</style>
