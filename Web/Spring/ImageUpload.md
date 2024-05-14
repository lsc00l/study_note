# 기본설정

> conf.properties
> 

```jsx
upload.image.path=C:/log/AccumWeb/upload/img/
```

> 테이블 정보
> 

``` sql
CREATE TABLE `image_info` (
	`IMAGE_SEQ` INT(11) NOT NULL AUTO_INCREMENT COMMENT '이미지 SEQ',
	`FILE_NM` VARCHAR(100) NOT NULL COMMENT '파일명' COLLATE 'utf8_general_ci',
	`REAL_NM` VARCHAR(100) NULL COMMENT '실제 파일명' COLLATE 'utf8_general_ci',
	`FILE_SIZE` VARCHAR(100) NULL COMMENT '파일 사이즈' COLLATE 'utf8_general_ci',
	`FILE_PATH` VARCHAR(200) NULL COMMENT '파일 full path' COLLATE 'utf8_general_ci',
	`FILE_LOC` VARCHAR(200) NULL COMMENT '파일 위치' COLLATE 'utf8_general_ci',
	`DESC` VARCHAR(200) NULL COMMENT '기타' COLLATE 'utf8_general_ci',
	`REG_TIME` DATETIME NULL COMMENT '등록일시',
	`UPDATE_TIME` DATETIME NULL COMMENT '수정일시',
	PRIMARY KEY (`IMAGE_SEQ`) USING BTREE
)
COMMENT='이미지 정보'
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=128
;

```

# Upload

### jsp

```jsx
<input type="file" id="noticeImg" name="noticeImg" class="form-control modal-input" accept="image/*">
```

> form.submit()으로 처리한다면 entype 옵션 필수
> 

`enctype="multipart/form-data"` 

```jsx
<form name="form" method="post" action="/admin/uploadNoticeImage.json" enctype="multipart/form-data">
</form>
```

> ajax 로 보낼때는 아래처럼 설정
> 

`processData: false,`  : defaul(true) : 기본은 쿼리 문자열로 key=value 형태로 처리함. 

처리되지 않은 문자열을 보내려면 false
`contentType: false,` :  서버에 데이터를 보낼 때 데이터 유형 결정 
`data       : formData,` 

```jsx
$.ajax({
    type       : "POST",
    url        : "/admin/uploadNoticeImage.json",
    processData: false,
    contentType: false,
    data       : formData,
    async      : false,
    dataType   : "json",
    success    : function (data) {
        if (data.resultCode && data.result === "Y") {

            toastMsg("success", "파일 업로드 완료");

            if (successCallback && typeof successCallback === "function") {
                successCallback(data);
            }

        } else {
            toastMsg("error", "파일 업로드 실패");
        }
    }, error   : function (xhr, status, error) {
        toastMsg("error", "업로드 중 오류가 발생하였습니다.");
    }
});
```

### Controller

```jsx
@RequestMapping("/admin/uploadNoticeImage.json")
@ResponseBody
public JSONObject uploadNoticeImage(HttpServletRequest request, HttpServletResponse response
        , Principal principal) throws IOException {

    String uploadPath = prop.get("upload.image.path");

    /* 파일 업로드 */
    List<HashMap<String, String>> fileInfo = fileUtil.doUpload(request, uploadPath);

    if (fileInfo.size() > 0) {
        Map<String, String> file = fileInfo.get(0);
        ImageInfo img = new ImageInfo();

        img.setFileNm(file.get("fileSaveName"));
        img.setRealNm(file.get("fileOrgName"));
        img.setFileSize(file.get("fileSize"));
        img.setFileLoc(uploadPath);
        img.setFilePath(uploadPath + file.get("fileSaveName"));

        /* 이미지 정보 저장 */
        headerService.insertImageInfo(img);

        json.put("imageInfo", img);

    }
    return json;
}
```

> fileUtil.java
> 

```jsx
public List<HashMap<String, String>> doUpload(final HttpServletRequest request, String fileUploadPath) throws IOException{
				 
	/*
	 * validate request type
	 */
	final MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
	
	/*
	 * extract files
	 */
	final Map<String, MultipartFile> files = multiRequest.getFileMap();
	
	/*
	 * process files
	 */
	
	Iterator<Entry<String, MultipartFile>> itr = files.entrySet().iterator();
	MultipartFile file;
	List<HashMap<String, String>> fileInfoList = new ArrayList<HashMap<String, String>>();
	
	String filePath;
	
	while (itr.hasNext()) {
		Entry<String, MultipartFile> entry = itr.next();
	 
		file = entry.getValue();
		if (!"".equals(file.getOriginalFilename())) {
			logger.debug("doUpload start!!");
			
			File saveFolder = new File(fileUploadPath);
			
			logger.debug("doUpload mkdir!!");
			// 디렉토리 생성
			if (!saveFolder.exists() || saveFolder.isFile()) {
				saveFolder.mkdirs();
			}
			
			// 파일 명 변경(uuid로 암호화) 
			String ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.')); 
			// 확장자 
			String saveFileName = getUuid() + ext; 
			
			//파일저장
			filePath = fileUploadPath + File.separator + saveFileName;
			logger.debug("***************** uploadPath *************************" + filePath);
			logger.debug("doUpload transferTo!!");
			file.transferTo(new File(filePath));

			HashMap<String, String> fileVo = new HashMap<String, String>();
			fileVo.put("filePath",fileUploadPath);
			fileVo.put("fileOrgName",file.getOriginalFilename());
			fileVo.put("fileSaveName",saveFileName);
			fileVo.put("fileSize",Long.toString(file.getSize()));
			fileInfoList.add(fileVo);
			 
		}
	}
	
	return fileInfoList;
}
```

# View

```jsx
const html = '<img src="/admin/display-image.json?filename=' + rowData.fileNm + '" alt="">';
$('#imagePreview').html(html);
```

```jsx
@RequestMapping(method = RequestMethod.GET, value = "/admin/display-image.json")
public ResponseEntity<Resource> getImages(@RequestParam("filename") String fileName){
    logger.info("getImage()........." + fileName);

    String path = prop.get("upload.image.path");
    Resource resource = new FileSystemResource(path + fileName);
    if(!resource.exists())
        return new ResponseEntity<Resource>(HttpStatus.NOT_FOUND);
    HttpHeaders header = new HttpHeaders();
    Path filePath = null;
    try{
        filePath = Paths.get(path + fileName);
        header.add("Content-type", Files.probeContentType(filePath));
    }catch(IOException e) {
        e.printStackTrace();
    }
    return new ResponseEntity<Resource>(resource, header, HttpStatus.OK);

}
```