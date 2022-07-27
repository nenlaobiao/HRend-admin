<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      accept="image/*"
      :limit="limit"
      :class="{ hidden: filelist.length === limit }"
      :on-change="imgChange"
      :file-list="filelist"
      :http-request="handleRequest"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-progress :percentage="percentage"></el-progress>
    <el-dialog :visible.sync="dialogVisible" title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDKUPCl5AmCMHxOaXFiwwiEWYLtCG4dx2r',
  SecretKey: 'cz7zc092g5GCtKWTAcolTv74mFTTEk01'
})
console.log(cos)
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      filelist: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      percentage: 0
    }
  },
  methods: {
    handleRemove (file) {
      console.log(file)
      this.filelist = this.filelist.filter(item => item.uid !== file.uid)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    imgChange (file, filelist) {
      console.log(filelist)
      this.filelist = filelist
    },
    handleRequest (data) {
      var that = this
      console.log(data)
      cos.putObject({
        Bucket: 'ming666-1313062361', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: Date.now() + data.file.name, /* 必须 */
        StorageClass: 'STANDARD',
        Body: data.file, // 上传文件对象
        onProgress: function (progressData) {
          console.log(JSON.stringify(progressData))
          that.percentage = Math.ceil(progressData.loaded / progressData.total * 100)
        }
      }, (err, data) => {
        console.log(err || data)
        // this.src = data.Location
      })
    }
  }
}
</script>

<style scoped lang='scss'>
// 原理：hidden类名是动态绑定
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
